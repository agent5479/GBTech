import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import FacilityPicker from '../components/FacilityPicker';
import BookingConfirmationDetails from '../components/BookingConfirmationDetails';
import {
  BOOKING_FACILITIES,
  getFacilityById,
  SITE_ADDRESS,
} from '../data/bookingFacilities';
import {
  defaultBookingDate,
  formatDisplayDate,
  getQuickDateOptions,
  maxBookingDate,
  minBookingDate,
  BOOKING_POLICY,
  type AvailabilityResult,
  type BookingSlot,
} from '../data/bookingConfig';
import {
  BOOKING_SERVICE_TYPES,
  getServiceTypesForFacility,
  type BookingServiceType,
} from '@shared/bookingServiceTypes';
import type { BookingCategoryId } from '@shared/bookingCategories';
import { FORM_ENDPOINT } from '../data/formConfig';
import { IS_SHOWCASE_MODE } from '@shared/showcaseMode';
import {
  fetchShowcaseAvailability,
  submitShowcaseBooking,
} from '../services/showcaseBookingApi';
import {
  buildExtendedDetailsPayload,
  emptyExtendedDetailsState,
  type BookingExtendedDetailsState,
} from '../data/bookingExtendedDetails';
import { DURATION_LABELS } from '../data/bookingConfig';

type WizardStep = 1 | 2 | 3 | 4 | 5;

export default function BookForm() {
  const [stepFacilityDone, setStepFacilityDone] = useState(false);
  const [stepDurationDone, setStepDurationDone] = useState(false);
  const [stepDateTimeDone, setStepDateTimeDone] = useState(false);
  const [stepDetailsDone, setStepDetailsDone] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [facilityId, setFacilityId] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState<BookingServiceType | null>(null);
  const [selectedDate, setSelectedDate] = useState(defaultBookingDate());
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [message, setMessage] = useState('');
  const [extended, setExtended] = useState<BookingExtendedDetailsState>(emptyExtendedDetailsState());

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [lastExtendedJson, setLastExtendedJson] = useState<string | undefined>();

  const facility = facilityId ? getFacilityById(facilityId) : undefined;
  const serviceConfig = serviceType ? BOOKING_SERVICE_TYPES[serviceType] : undefined;
  const category: BookingCategoryId | undefined = facility?.category;
  const durationOptions = facilityId ? getServiceTypesForFacility(facilityId) : [];

  useEffect(() => {
    if (!stepDurationDone || !serviceType || !facility || !selectedDate) return;

    let cancelled = false;
    setLoadingSlots(true);
    setSlotError('');
    setSlots([]);
    setSelectedSlot(null);

    async function loadSlots() {
      try {
        const data = IS_SHOWCASE_MODE
          ? await fetchShowcaseAvailability(selectedDate, serviceType!, facility!.label, facility!.category)
          : ((await (
              await fetch(FORM_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({
                  action: 'availability',
                  date: selectedDate,
                  booking_type: serviceType,
                  location: facility!.label,
                  category: facility!.category,
                }),
              })
            ).json()) as AvailabilityResult);
        if (cancelled) return;
        if (!data.success) {
          setSlotError(data.message || 'Could not load availability.');
          return;
        }
        setSlots(data.slots || []);
        if (!data.slots?.length) setSlotError('No slots available on this date. Try another day.');
      } catch {
        if (!cancelled) setSlotError('Could not load availability. Please try again.');
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    }

    loadSlots();

    return () => {
      cancelled = true;
    };
  }, [stepDurationDone, serviceType, facility, selectedDate]);

  function selectFacility(id: string) {
    setFacilityId(id);
    setServiceType(null);
    setStepFacilityDone(true);
    setStepDurationDone(false);
    setStepDateTimeDone(false);
    setStepDetailsDone(false);
    setSelectedSlot(null);
  }

  function selectDuration(type: BookingServiceType) {
    setServiceType(type);
    setStepDurationDone(true);
    setStepDateTimeDone(false);
    setStepDetailsDone(false);
    setSelectedSlot(null);
  }

  function selectSlot(slot: BookingSlot) {
    setSelectedSlot(slot);
    setStepDateTimeDone(true);
    setStepDetailsDone(false);
  }

  function currentStep(): WizardStep {
    if (submitted) return 5;
    if (!stepFacilityDone) return 1;
    if (!stepDurationDone) return 2;
    if (!stepDateTimeDone) return 3;
    if (!stepDetailsDone) return 4;
    return 5;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!facility || !serviceConfig || !selectedSlot || !serviceType || !category) return;
    if (!phone.trim()) {
      setSubmitError('Phone is required.');
      return;
    }
    if (!name.trim() && !organisation.trim()) {
      setSubmitError('Please provide your name or organisation.');
      return;
    }
    if (category === 'equipment' && !extended.depositAck) {
      setSubmitError('Please acknowledge the equipment deposit terms.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const extendedJson = buildExtendedDetailsPayload(extended, {
        bookingType: serviceType,
        durationPackage: serviceConfig.durationPackage,
        priceLabel: serviceConfig.priceLabel,
        category,
      });
      setLastExtendedJson(extendedJson);

      const payload = {
        booking_type: serviceType,
        location: facility.label,
        category,
        slot_start: selectedSlot.start,
        slot_end: selectedSlot.end,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        organisation: organisation.trim(),
        message: message.trim(),
        extended_json: extendedJson,
      };

      const data = IS_SHOWCASE_MODE
        ? await submitShowcaseBooking(payload)
        : ((await (
            await fetch(FORM_ENDPOINT, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({ action: 'book', ...payload, website: '' }),
            })
          ).json()) as { success?: boolean; message?: string });

      if (!data.success) {
        setSubmitError(data.message || 'Booking failed. Please try again.');
        return;
      }
      setSubmitted(true);
      setStepDetailsDone(true);
    } catch {
      setSubmitError('Booking failed. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted && facility && serviceConfig && serviceType && category && selectedSlot) {
    return (
      <BookingConfirmationDetails
        bookingType={serviceType}
        category={category}
        slotLabel={selectedSlot.label}
        slotEndLabel={new Date(selectedSlot.end).toLocaleTimeString('en-NZ', {
          hour: 'numeric',
          minute: '2-digit',
        })}
        locationLabel={facility.label}
        name={name}
        phone={phone}
        email={email}
        organisation={organisation}
        message={message}
        extendedJson={lastExtendedJson}
      />
    );
  }

  const step = currentStep();

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <p className="book-form__policy">{BOOKING_POLICY}</p>
      <p className="book-form__address">All facilities at {SITE_ADDRESS}</p>

      <section className="book-step" aria-current={step === 1 ? 'step' : undefined}>
        <h2>Step 1 — Choose a facility</h2>
        <FacilityPicker
          facilities={BOOKING_FACILITIES}
          selectedId={facilityId}
          onSelect={selectFacility}
        />
      </section>

      {stepFacilityDone && facility && (
        <section className="book-step" aria-current={step === 2 ? 'step' : undefined}>
          <h2>Step 2 — Choose duration</h2>
          <div className="duration-grid">
            {durationOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`duration-card${serviceType === opt.id ? ' duration-card--selected' : ''}`}
                onClick={() => selectDuration(opt.id)}
              >
                <strong>{DURATION_LABELS[opt.durationPackage]}</strong>
                <span>{opt.priceLabel}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {stepDurationDone && serviceConfig && (
        <section className="book-step" aria-current={step === 3 ? 'step' : undefined}>
          <h2>Step 3 — Pick date and time</h2>
          <label className="field">
            <span>Date</span>
            <input
              type="date"
              value={selectedDate}
              min={minBookingDate()}
              max={maxBookingDate()}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSlot(null);
                setStepDateTimeDone(false);
              }}
            />
          </label>
          <div className="quick-dates">
            {getQuickDateOptions(5).map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`quick-date${selectedDate === opt.value ? ' quick-date--selected' : ''}`}
                onClick={() => {
                  setSelectedDate(opt.value);
                  setSelectedSlot(null);
                  setStepDateTimeDone(false);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {loadingSlots && <p className="status">Loading available times…</p>}
          {slotError && <p className="error">{slotError}</p>}
          {!loadingSlots && slots.length > 0 && (
            <div className="slot-grid">
              {slots.map((slot) => (
                <button
                  key={slot.start}
                  type="button"
                  className={`slot-btn${selectedSlot?.start === slot.start ? ' slot-btn--selected' : ''}`}
                  onClick={() => selectSlot(slot)}
                >
                  {slot.label.split(', ').slice(1).join(', ') || slot.label}
                </button>
              ))}
            </div>
          )}
          {selectedSlot && (
            <p className="selected-slot">
              Selected: <strong>{formatDisplayDate(selectedDate)}</strong> — {selectedSlot.label}
            </p>
          )}
        </section>
      )}

      {stepDateTimeDone && (
        <section className="book-step" aria-current={step === 4 ? 'step' : undefined}>
          <h2>Step 4 — Your details</h2>
          <label className="field">
            <span>Name</span>
            <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </label>
          <label className="field">
            <span>Phone *</span>
            <input type="tel" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required autoComplete="tel" />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </label>
          <label className="field">
            <span>Organisation / group</span>
            <input type="text" name="organisation" value={organisation} onChange={(e) => setOrganisation(e.target.value)} />
          </label>
          <label className="field">
            <span>Notes</span>
            <textarea name="message" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>
        </section>
      )}

      {stepDateTimeDone && (
        <section className="book-step" aria-current={step === 5 ? 'step' : undefined}>
          <h2>Step 5 — Confirm and add-ons</h2>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={extended.firewood}
              onChange={(e) => setExtended((s) => ({ ...s, firewood: e.target.checked }))}
            />
            Request firewood (additional fee applies)
          </label>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={extended.cleaningFeeAck}
              onChange={(e) => setExtended((s) => ({ ...s, cleaningFeeAck: e.target.checked }))}
            />
            I acknowledge cleaning fees may apply
          </label>
          {category === 'equipment' && (
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={extended.depositAck}
                onChange={(e) => setExtended((s) => ({ ...s, depositAck: e.target.checked }))}
                required
              />
              I acknowledge the $50 equipment deposit (refundable when returned clean and functional)
            </label>
          )}
          <label className="field">
            <span>Add-on notes</span>
            <input
              type="text"
              value={extended.addonNotes}
              onChange={(e) => setExtended((s) => ({ ...s, addonNotes: e.target.value }))}
            />
          </label>

          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp-field" aria-hidden="true" />

          {submitError && <p className="error">{submitError}</p>}

          <button type="submit" className="btn-primary" disabled={submitting || !selectedSlot}>
            {submitting ? 'Confirming…' : 'Confirm booking'}
          </button>
        </section>
      )}

      <p className="book-form__enquiry">
        Questions? <Link to="/contact">Send an enquiry</Link>
      </p>
    </form>
  );
}

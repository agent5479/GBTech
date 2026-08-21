import { useMemo, useState } from 'react';
import { BOOKING_FACILITIES } from '../data/bookingFacilities';
import { formatIsoDate } from '../data/bookingConfig';
import { getShowcaseBookedBlocks } from '../services/showcaseAvailability';

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  // Monday-start week
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

const HOURS = [9, 10, 11, 12, 13, 14, 15, 16];

/** Interactive sample calendar for showcase mode — no Google Calendar required. */
export default function ShowcaseDemoCalendar() {
  const [weekAnchor, setWeekAnchor] = useState(() => startOfWeek(new Date()));
  const [facilityFilter, setFacilityFilter] = useState<string>('all');

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekAnchor, i)), [weekAnchor]);

  const weekLabel = useMemo(() => {
    const end = addDays(weekAnchor, 6);
    const fmt = (d: Date) =>
      d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' });
    return `${fmt(weekAnchor)} – ${fmt(end)}`;
  }, [weekAnchor]);

  return (
    <div className="showcase-demo-calendar">
      <div className="showcase-demo-calendar__toolbar">
        <button type="button" className="bookings-calendar__view-btn" onClick={() => setWeekAnchor((w) => addDays(w, -7))}>
          ← Prev
        </button>
        <p className="showcase-demo-calendar__week-label">{weekLabel}</p>
        <button type="button" className="bookings-calendar__view-btn" onClick={() => setWeekAnchor((w) => addDays(w, 7))}>
          Next →
        </button>
      </div>

      <label className="showcase-demo-calendar__filter field">
        <span>Show room</span>
        <select value={facilityFilter} onChange={(e) => setFacilityFilter(e.target.value)}>
          <option value="all">All rooms</option>
          {BOOKING_FACILITIES.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </label>

      <div className="showcase-demo-calendar__grid" role="table" aria-label="Sample week availability">
        <div className="showcase-demo-calendar__corner" />
        {days.map((day) => (
          <div key={formatIsoDate(day)} className="showcase-demo-calendar__day-head">
            <strong>{day.toLocaleDateString('en-NZ', { weekday: 'short' })}</strong>
            <span>{day.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })}</span>
          </div>
        ))}

        {HOURS.map((hour) => (
          <div key={hour} className="showcase-demo-calendar__row" role="row">
            <div className="showcase-demo-calendar__hour">{hour}:00</div>
            {days.map((day) => {
              const date = formatIsoDate(day);
              const facilities =
                facilityFilter === 'all'
                  ? BOOKING_FACILITIES
                  : BOOKING_FACILITIES.filter((f) => f.id === facilityFilter);
              const busy = facilities.some((f) =>
                getShowcaseBookedBlocks(date, f.id).some((b) => hour >= b.startHour && hour < b.endHour)
              );
              const titles = facilities
                .flatMap((f) => getShowcaseBookedBlocks(date, f.id))
                .filter((b) => hour >= b.startHour && hour < b.endHour)
                .map((b) => b.facilityLabel);

              return (
                <div
                  key={`${date}-${hour}`}
                  className={`showcase-demo-calendar__cell${busy ? ' is-busy' : ' is-free'}`}
                  title={busy ? titles.join(', ') : 'Available'}
                >
                  <span className="visually-hidden">
                    {busy ? `Booked: ${titles.join(', ')}` : 'Available'}
                  </span>
                  {busy ? 'Busy' : 'Free'}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <ul className="showcase-demo-calendar__legend">
        <li>
          <span className="showcase-demo-calendar__swatch is-free" /> Available (you can book in the wizard)
        </li>
        <li>
          <span className="showcase-demo-calendar__swatch is-busy" /> Sample conflict (slots hidden in the wizard)
        </li>
      </ul>
    </div>
  );
}

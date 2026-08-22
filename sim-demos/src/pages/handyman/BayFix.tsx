import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoChrome } from '../../components/DemoChrome'
import { DemoModeBar } from '../../components/DemoModeBar'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import { buildYachtCalendar } from '../../shared/calendarMock'
import { GB_PLACES } from '../../shared/gbPlaces'
import {
  HANDYMAN_JOBS,
  HANDYMAN_QUICK_ADDS,
  estimateHandymanJobs,
  formatHandymanBracket,
  jobById,
} from '../../shared/handymanJobs'

/**
 * Bay Fix — classic job-ticket wizard.
 * Steps: Jobs (multi-select) → When → Site → Review.
 */
export default function BayFix() {
  const days = useMemo(() => buildYachtCalendar(8), [])
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState<string[]>(['plumbing'])
  const [date, setDate] = useState<string>()
  const [time, setTime] = useState<string>()
  const [placeId, setPlaceId] = useState(GB_PLACES[0].id)
  const [gateCode, setGateCode] = useState('')
  const [parkingNote, setParkingNote] = useState('')
  const [dogOnSite, setDogOnSite] = useState(false)
  const [photoName, setPhotoName] = useState<string>()
  const [notes, setNotes] = useState('')
  const [done, setDone] = useState(false)

  const estimate = useMemo(() => estimateHandymanJobs(selected), [selected])
  const selectedDay = days.find((d) => d.date === date)
  const canWhen = Boolean(date && time)
  const canConfirm = Boolean(estimate && canWhen)

  const toggleJob = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  if (done && estimate) {
    return (
      <div className="handyman-page theme-bayfix">
        <DemoChrome
          theme="Bay Fix"
          title="Demo job ticket logged"
          subtitle="Nothing was booked — simulation only."
          imageId="bayfix"
        />
        <div className="yacht-panel success-panel demo-enter-success">
          <h2>You&apos;re on the list (demo)</h2>
          <p>
            {selected.map((id) => jobById(id)?.name).filter(Boolean).join(' · ')}
          </p>
          <p>
            {date} @ {time} · {GB_PLACES.find((p) => p.id === placeId)?.name}
          </p>
          <p className="estimate-bracket">{formatHandymanBracket(estimate)}</p>
          <DemoQuoteCta styleName="Bay Fix" />
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              setDone(false)
              setStep(1)
            }}
          >
            Book another (demo)
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
        <DemoPitchBar
          packageTier="essential"
          compareTo="/handyman/tradeboard"
          compareLabel="Site job board"
          engineNote="Two jobs, not two skins — repair ticket vs site job board."
        />
      </div>
    )
  }

  return (
    <div className="handyman-page theme-bayfix">
      <DemoChrome
        theme="Bay Fix"
        title="Repair ticket"
        subtitle="Handyman for hire — add plumbing, electrical, or carpentry, then schedule the visit."
        imageId="bayfix"
      />
        <DemoPitchBar
          packageTier="essential"
          compareTo="/handyman/tradeboard"
          compareLabel="Site job board"
          engineNote="Two jobs, not two skins — repair ticket vs site job board."
        />
      <DemoModeBar
        clientTo="/handyman/bayfix"
        clientLabel="Client view"
        opsTo="/handyman/tradeboard"
        opsLabel="Admin view"
      />

      <ol className="wizard-steps" aria-label="Booking steps">
        {[1, 2, 3, 4].map((n) => (
          <li key={n} className={step === n ? 'active' : step > n ? 'done' : ''}>
            {n}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <section key="step-1" className="yacht-panel demo-enter">
          <h2>1. What needs doing?</h2>
          <p className="hint">Add a trade, then tick anything else.</p>
          <div className="add-kind-row">
            {HANDYMAN_QUICK_ADDS.map((q) => (
              <button
                key={q.id}
                type="button"
                className="chip"
                onClick={() =>
                  setSelected((prev) => (prev.includes(q.id) ? prev : [...prev, q.id]))
                }
              >
                {q.label}
              </button>
            ))}
          </div>
          <div className="job-check-list">
            {HANDYMAN_JOBS.map((j) => {
              const on = selected.includes(j.id)
              return (
                <label key={j.id} className={`job-check${on ? ' on' : ''}`}>
                  <input type="checkbox" checked={on} onChange={() => toggleJob(j.id)} />
                  <span>
                    <strong>{j.name}</strong>
                    <small>
                      {j.blurb} · {j.durationHint} · from ${j.basePrice}
                    </small>
                  </span>
                </label>
              )
            })}
          </div>
          {estimate && (
            <p className="live-estimate">
              Running estimate <strong>{formatHandymanBracket(estimate)}</strong>
            </p>
          )}
          <div className="btn-row">
            <button type="button" className="btn primary" disabled={!estimate} onClick={() => setStep(2)}>
              Next: When
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section key="step-2" className="yacht-panel demo-enter">
          <h2>2. Preferred window</h2>
          <div className="day-rail" role="listbox" aria-label="Available days">
            {days.map((d) => {
              const openCount = d.slots.filter((s) => s.status === 'open').length
              const blocked = openCount === 0
              return (
                <button
                  key={d.date}
                  type="button"
                  role="option"
                  aria-selected={date === d.date}
                  disabled={blocked}
                  className={`day-pill${date === d.date ? ' on' : ''}${blocked ? ' blocked' : ''}`}
                  onClick={() => {
                    setDate(d.date)
                    setTime(undefined)
                  }}
                >
                  <span>{d.label}</span>
                  <small>{blocked ? 'Full' : `${openCount} open`}</small>
                </button>
              )
            })}
          </div>
          {selectedDay && (
            <div className="time-rail">
              {selectedDay.slots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  disabled={slot.status !== 'open'}
                  className={`time-chip status-${slot.status}${time === slot.time ? ' on' : ''}`}
                  title={slot.note}
                  onClick={() => setTime(slot.time)}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(1)}>
              Back
            </button>
            <button type="button" className="btn primary" disabled={!canWhen} onClick={() => setStep(3)}>
              Next: Site
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section key="step-3" className="yacht-panel demo-enter">
          <h2>3. Site details</h2>
          <div className="site-access-card">
            <h3 className="subhead">Site access</h3>
            <label className="field">
              Gate code / buzzer
              <input
                value={gateCode}
                onChange={(e) => setGateCode(e.target.value)}
                placeholder="e.g. #4821 or ring front bell"
              />
            </label>
            <label className="field">
              Parking
              <input
                value={parkingNote}
                onChange={(e) => setParkingNote(e.target.value)}
                placeholder="Driveway, street, or farm gate"
              />
            </label>
            <label className={`job-check${dogOnSite ? ' on' : ''}`}>
              <input type="checkbox" checked={dogOnSite} onChange={(e) => setDogOnSite(e.target.checked)} />
              <span>
                <strong>Dog on site</strong>
                <small>Tradie will call before entering</small>
              </span>
            </label>
          </div>
          <label className="field">
            Area
            <select value={placeId} onChange={(e) => setPlaceId(e.target.value)}>
              {GB_PLACES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Notes for the tradie
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything else…" />
          </label>
          <div className="photo-attach">
            <button
              type="button"
              className="btn ghost"
              onClick={() => setPhotoName(`leak-${Date.now().toString(36).slice(-4)}.jpg`)}
            >
              Attach photo (demo)
            </button>
            {photoName ? (
              <p className="photo-stub-name">
                Attached: <strong>{photoName}</strong>
              </p>
            ) : (
              <p className="hint">Real tickets usually need a photo of the problem — stub filename only here.</p>
            )}
          </div>
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(2)}>
              Back
            </button>
            <button type="button" className="btn primary" onClick={() => setStep(4)}>
              Next: Review
            </button>
          </div>
        </section>
      )}

      {step === 4 && estimate && (
        <section key="step-4" className="yacht-panel demo-enter">
          <h2>4. Review ticket</h2>
          <div className="summary">
            <p>
              <strong>Jobs:</strong> {selected.map((id) => jobById(id)?.name).join(', ')}
            </p>
            <p>
              <strong>When:</strong> {date} @ {time}
            </p>
            <p>
              <strong>Site:</strong> {GB_PLACES.find((p) => p.id === placeId)?.name}
            </p>
            {notes && (
              <p>
                <strong>Notes:</strong> {notes}
              </p>
            )}
            {(gateCode || parkingNote || dogOnSite) && (
              <p>
                <strong>Access:</strong>
                {gateCode ? ` Gate ${gateCode}` : ''}
                {parkingNote ? ` · Parking ${parkingNote}` : ''}
                {dogOnSite ? ' · Dog on site' : ''}
              </p>
            )}
            {photoName && (
              <p>
                <strong>Photo:</strong> {photoName}
              </p>
            )}
            <p>
              Jobs ${estimate.jobsTotal.toFixed(2)} + travel ${estimate.travelFee.toFixed(2)}
              {estimate.multiJobDiscount > 0 ? ` − multi-job $${estimate.multiJobDiscount.toFixed(2)}` : ''}
            </p>
            <p className="estimate-bracket">Estimated cost {formatHandymanBracket(estimate)}</p>
          </div>
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(3)}>
              Back
            </button>
            <button type="button" className="btn primary" disabled={!canConfirm} onClick={() => setDone(true)}>
              Confirm ticket (demo)
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

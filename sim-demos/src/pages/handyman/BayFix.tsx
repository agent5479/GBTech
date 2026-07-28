import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoChrome } from '../../components/DemoChrome'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import { buildYachtCalendar } from '../../shared/calendarMock'
import { GB_PLACES } from '../../shared/gbPlaces'
import {
  HANDYMAN_JOBS,
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
        <div className="yacht-panel success-panel">
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
          compareLabel="Trade Board"
          engineNote="Same job types and live estimate engine — wizard vs pin-board UI."
        />
      </div>
    )
  }

  return (
    <div className="handyman-page theme-bayfix">
      <DemoChrome
        theme="Bay Fix"
        title="Bay Fix"
        subtitle="Handyman for hire — multi-select job types on a classic ticket wizard."
        imageId="bayfix"
      />
      <DemoPitchBar
        packageTier="essential"
        compareTo="/handyman/tradeboard"
        compareLabel="Trade Board"
        engineNote="Same job types and live estimate engine — wizard vs pin-board UI."
      />

      <ol className="wizard-steps" aria-label="Booking steps">
        {[1, 2, 3, 4].map((n) => (
          <li key={n} className={step === n ? 'active' : step > n ? 'done' : ''}>
            {n}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <section className="yacht-panel">
          <h2>1. What needs doing?</h2>
          <p className="hint">Select one or more job types.</p>
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
        <section className="yacht-panel">
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
        <section className="yacht-panel">
          <h2>3. Site details</h2>
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
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Gate code, parking, pets…" />
          </label>
          <div className="photo-attach">
            <button type="button" className="btn ghost" disabled title="Demo only — photo upload ships in a live build">
              Attach photo (coming soon)
            </button>
            <p className="hint">Real tickets usually need a photo of the problem — included in a live portal.</p>
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
        <section className="yacht-panel">
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

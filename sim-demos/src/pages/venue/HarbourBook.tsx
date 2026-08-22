import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoChrome } from '../../components/DemoChrome'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import { buildYachtCalendar } from '../../shared/calendarMock'
import {
  HALL_EXTRAS,
  HALL_ROOMS,
  LIVE_BOOK_URL,
  LIVE_STAFF_URL,
  estimateHallBooking,
  formatHallBracket,
  roomById,
} from '../../shared/venueHall'

/** Harbour Book — client facility booking wizard. */
export default function HarbourBook() {
  const days = useMemo(() => buildYachtCalendar(8), [])
  const [step, setStep] = useState(1)
  const [roomId, setRoomId] = useState('workshop')
  const [hours, setHours] = useState(2)
  const [extras, setExtras] = useState<string[]>(['av'])
  const [date, setDate] = useState<string>()
  const [time, setTime] = useState<string>()
  const [party, setParty] = useState(8)
  const [notes, setNotes] = useState('')
  const [done, setDone] = useState(false)

  const estimate = useMemo(() => estimateHallBooking(roomId, hours, extras), [roomId, hours, extras])
  const selectedDay = days.find((d) => d.date === date)
  const room = roomById(roomId)
  const canWhen = Boolean(date && time)
  const canConfirm = Boolean(estimate && canWhen && room && party <= (room?.capacity ?? 0))

  const toggleExtra = (id: string) => {
    setExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  if (done && estimate && room) {
    return (
      <div className="venue-page theme-harbourbook">
        <DemoChrome
          theme="Harbour Book"
          title="Demo booking logged"
          subtitle="Nothing was booked — simulation only."
          imageId="harbourbook"
        />
        <div className="yacht-panel success-panel demo-enter-success">
          <h2>You&apos;re on the list (demo)</h2>
          <p>
            {room.name} · {hours}h · {party} people
          </p>
          <p>
            {date} @ {time}
          </p>
          <p className="estimate-bracket">{formatHallBracket(estimate)}</p>
          <p className="hint">
            Prefer the full product stack?{' '}
            <a href={LIVE_BOOK_URL}>Live Harbour Hall book</a>
            {' · '}
            <a href={LIVE_STAFF_URL}>Staff demo</a>
          </p>
          <DemoQuoteCta styleName="Harbour Book" />
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
          packageTier="advanced"
          compareTo="/venue/hallboard"
          compareLabel="Hall Board"
          engineNote="Client facility book vs staff day board — Harbour Hall pair."
        />
      </div>
    )
  }

  return (
    <div className="venue-page theme-harbourbook">
      <DemoChrome
        theme="Harbour Book"
        title="Book a facility"
        subtitle="Harbour Hall sample venue — pick a room, window, and extras. Client-side booking wizard."
        imageId="harbourbook"
        badge="Simulated · client booking"
      />
      <DemoPitchBar
        packageTier="advanced"
        compareTo="/venue/hallboard"
        compareLabel="Hall Board"
        engineNote="Client facility book vs staff day board — Harbour Hall pair."
      />

      <ol className="wizard-steps" aria-label="Booking steps">
        {[1, 2, 3, 4].map((n) => (
          <li key={n} className={step === n ? 'active' : step > n ? 'done' : ''}>
            {n}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <section className="yacht-panel demo-enter">
          <h2>1. Choose a room</h2>
          <div className="job-check-list">
            {HALL_ROOMS.map((r) => {
              const on = roomId === r.id
              return (
                <label key={r.id} className={`job-check${on ? ' on' : ''}`}>
                  <input type="radio" name="room" checked={on} onChange={() => setRoomId(r.id)} />
                  <span>
                    <strong>{r.name}</strong>
                    <small>
                      {r.blurb} · up to {r.capacity} · ${r.hourlyRate}/hr
                    </small>
                  </span>
                </label>
              )
            })}
          </div>
          <label className="field">
            Hire length (hours)
            <input
              type="number"
              min={1}
              max={8}
              value={hours}
              onChange={(e) => setHours(Math.max(1, Number(e.target.value) || 1))}
            />
          </label>
          <div className="btn-row">
            <button type="button" className="btn primary" onClick={() => setStep(2)}>
              Next: When
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="yacht-panel demo-enter">
          <h2>2. Preferred window</h2>
          <div className="day-rail" role="listbox" aria-label="Available days">
            {days.map((d) => {
              const openCount = d.slots.filter((s) => s.status === 'open').length
              const blocked = openCount === 0
              return (
                <button
                  key={d.date}
                  type="button"
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
              Next: Party &amp; extras
            </button>
          </div>
        </section>
      )}

      {step === 3 && room && (
        <section className="yacht-panel demo-enter">
          <h2>3. Party &amp; extras</h2>
          <label className="field">
            Party size
            <div className="crew-stepper">
              <button type="button" className="btn ghost" onClick={() => setParty((n) => Math.max(1, n - 1))}>
                −
              </button>
              <span>{party}</span>
              <button
                type="button"
                className="btn ghost"
                onClick={() => setParty((n) => Math.min(room.capacity, n + 1))}
              >
                +
              </button>
            </div>
            <small className="hint">Room cap {room.capacity}</small>
          </label>
          <p className="hint">Tick add-ons</p>
          <div className="job-check-list">
            {HALL_EXTRAS.map((e) => {
              const on = extras.includes(e.id)
              return (
                <label key={e.id} className={`job-check${on ? ' on' : ''}`}>
                  <input type="checkbox" checked={on} onChange={() => toggleExtra(e.id)} />
                  <span>
                    <strong>{e.name}</strong>
                    <small>+ ${e.price}</small>
                  </span>
                </label>
              )
            })}
          </div>
          <label className="field">
            Notes for staff
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Setup needs, access…"
            />
          </label>
          {estimate && (
            <p className="live-estimate">
              Running estimate <strong>{formatHallBracket(estimate)}</strong>
            </p>
          )}
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

      {step === 4 && estimate && room && (
        <section className="yacht-panel demo-enter">
          <h2>4. Review</h2>
          <div className="summary">
            <p>
              <strong>Room:</strong> {room.name} · {hours}h
            </p>
            <p>
              <strong>When:</strong> {date} @ {time}
            </p>
            <p>
              <strong>Party:</strong> {party}
            </p>
            {extras.length > 0 && (
              <p>
                <strong>Extras:</strong>{' '}
                {extras.map((id) => HALL_EXTRAS.find((e) => e.id === id)?.name).join(', ')}
              </p>
            )}
            {notes && (
              <p>
                <strong>Notes:</strong> {notes}
              </p>
            )}
            <p className="estimate-bracket">Estimated {formatHallBracket(estimate)}</p>
          </div>
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(3)}>
              Back
            </button>
            <button type="button" className="btn primary" disabled={!canConfirm} onClick={() => setDone(true)}>
              Confirm booking (demo)
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

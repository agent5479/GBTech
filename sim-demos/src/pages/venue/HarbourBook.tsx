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

const SETUP_CHECKLIST = [
  { id: 'tables', label: 'Tables & chairs arranged', hint: 'Trestles and seating for your party size' },
  { id: 'av', label: 'AV kit tested', hint: 'Projector, HDMI, and mic check' },
  { id: 'kitchen', label: 'Kitchen access confirmed', hint: 'Prep bench, sinks, and fridge window' },
] as const

/** Harbour Book — client facility booking wizard. */
export default function HarbourBook() {
  const days = useMemo(() => buildYachtCalendar(8), [])
  const [roomId, setRoomId] = useState('workshop')
  const [hours, setHours] = useState(2)
  const [extras, setExtras] = useState<string[]>(['av'])
  const [date, setDate] = useState<string>()
  const [time, setTime] = useState<string>()
  const [party, setParty] = useState(8)
  const [notes, setNotes] = useState('')
  const [setupDone, setSetupDone] = useState<Record<string, boolean>>({})
  const [recurringWeekly, setRecurringWeekly] = useState(false)
  const [done, setDone] = useState(false)

  const estimate = useMemo(() => estimateHallBooking(roomId, hours, extras), [roomId, hours, extras])
  const selectedDay = days.find((d) => d.date === date)
  const room = roomById(roomId)
  const canWhen = Boolean(date && time)
  const setupComplete = SETUP_CHECKLIST.every((item) => setupDone[item.id])
  const canConfirm = Boolean(estimate && canWhen && room && party <= (room?.capacity ?? 0) && setupComplete)

  const toggleSetup = (id: string) => {
    setSetupDone((prev) => ({ ...prev, [id]: !prev[id] }))
  }

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
        subtitle="Harbour Hall sample venue — tap a room on the floor plan, then a window and extras."
        imageId="harbourbook"
        badge="Simulated · client booking"
      />
      <DemoPitchBar
        packageTier="advanced"
        compareTo="/venue/hallboard"
        compareLabel="Hall Board"
        engineNote="Client facility book vs staff day board — Harbour Hall pair."
      />

      <div className="ops-deck hall-book-deck">
        <div className="hall-floor-pane ops-board-surface">
          <div className="ops-board-head">
            <h2>Floor plan</h2>
            <p className="hint">Tap a room — workshop spans two bays; kitchen and seminar stack beside it.</p>
          </div>
          <div className="hall-rooms">
            {HALL_ROOMS.map((r) => {
              const on = roomId === r.id
              return (
                <button
                  key={r.id}
                  type="button"
                  className={`hall-room hall-room-${r.id}${on ? ' on' : ''}`}
                  onClick={() => setRoomId(r.id)}
                >
                  <span className="hall-room-cap">up to {r.capacity}</span>
                  <strong>{r.name}</strong>
                  <p>{r.blurb}</p>
                  <span className="hall-rate">${r.hourlyRate}/hr</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="hall-book-panel">
          <section className="hall-book-side hall-book-side--calendar ops-board-surface">
            <h2>Hire window</h2>
            <label className="field">
              Hours
              <input
                type="number"
                min={1}
                max={8}
                value={hours}
                onChange={(e) => setHours(Math.max(1, Number(e.target.value) || 1))}
              />
            </label>
            <p className="hall-book-kicker">Pick a day</p>
            <div className="day-rail hall-day-grid">
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
            {selectedDay ? (
              <>
                <p className="hall-book-kicker">Start time</p>
                <div className="time-rail hall-time-grid">
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
              </>
            ) : (
              <p className="hint hall-book-wait">Choose a day to see open slots.</p>
            )}
          </section>

          <section className="hall-book-side hall-book-side--details ops-board-surface">
            <h2>Party &amp; extras</h2>
            {room && (
              <label className="field">
                Party size
                <div className="crew-stepper">
                  <button type="button" className="btn ghost" onClick={() => setParty((n) => Math.max(1, n - 1))}>
                    −
                  </button>
                  <span>
                    {party} / {room.capacity}
                  </span>
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={() => setParty((n) => Math.min(room.capacity, n + 1))}
                  >
                    +
                  </button>
                </div>
              </label>
            )}
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
              Notes
              <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Setup…" />
            </label>

            <div className="setup-check-block">
              <p className="hall-book-kicker">Setup checklist</p>
              <p className="hint">Tick each item before confirming — facilities need this on file.</p>
              <div className="job-check-list">
                {SETUP_CHECKLIST.map((item) => {
                  const on = Boolean(setupDone[item.id])
                  return (
                    <label key={item.id} className={`job-check${on ? ' on' : ''}`}>
                      <input type="checkbox" checked={on} onChange={() => toggleSetup(item.id)} />
                      <span>
                        <strong>{item.label}</strong>
                        <small>{item.hint}</small>
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            <label className={`recurring-toggle${recurringWeekly ? ' on' : ''}`}>
              <input type="checkbox" checked={recurringWeekly} onChange={(e) => setRecurringWeekly(e.target.checked)} />
              <span>
                <strong>Recurring weekly hire</strong>
                <small>Same slot each week — estimate note only in this demo</small>
              </span>
            </label>

            <div className="hall-book-summary-sticky">
              {room && (
                <p className="hall-book-selection">
                  <strong>{room.name}</strong>
                  {canWhen ? (
                    <span>
                      {' '}
                      · {date} @ {time} · {hours}h
                    </span>
                  ) : (
                    <span> · pick a day and time</span>
                  )}
                </p>
              )}
              {estimate && (
                <p className="live-estimate hall-book-estimate">
                  <strong>{formatHallBracket(estimate)}</strong>
                  {recurringWeekly && (
                    <small className="recurring-note"> × weekly · first week shown · cancel anytime (demo)</small>
                  )}
                </p>
              )}
            </div>
            <button type="button" className="btn primary hall-book-confirm" disabled={!canConfirm} onClick={() => setDone(true)}>
              Confirm hire (demo)
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}

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

      <div className="hall-floor">
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
        <aside className="hall-book-side">
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
          <div className="day-rail">
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
          {room && (
            <label className="field">
              Party
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
          {estimate && (
            <p className="live-estimate">
              <strong>{formatHallBracket(estimate)}</strong>
            </p>
          )}
          <button type="button" className="btn primary" disabled={!canConfirm} onClick={() => setDone(true)}>
            Confirm hire (demo)
          </button>
        </aside>
      </div>
    </div>
  )
}

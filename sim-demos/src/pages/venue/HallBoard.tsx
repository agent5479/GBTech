import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoCardImage } from '../../components/DemoHeroImage'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import {
  HALL_ROOMS,
  HALL_STAFF,
  LIVE_BOOK_URL,
  LIVE_STAFF_URL,
  getHolds,
  setHoldAssignee,
  setHoldStatus,
  type HallHold,
} from '../../shared/venueHall'

const FALLBACK_HOURS = ['09:00', '10:00', '13:00', '15:00']
const STATUS_CYCLE: HallHold['status'][] = ['hold', 'confirmed', 'blocked']

const TURNAROUND_BUFFER_MIN = 30

/** Hall Board — staff venue day board (not a client wizard). */
export default function HallBoard() {
  const [, setTick] = useState(0)
  const refresh = () => setTick((n) => n + 1)
  const holds = getHolds()
  const [locked, setLocked] = useState(false)
  const [bufferOn, setBufferOn] = useState(true)

  const hours = [...new Set([...FALLBACK_HOURS, ...holds.map((h) => h.time)])].sort()
  const totalCells = HALL_ROOMS.length * hours.length
  const freeSlots = totalCells - holds.length

  const isBufferCell = (roomId: string, time: string): boolean => {
    if (!bufferOn) return false
    const timeIdx = hours.indexOf(time)
    if (timeIdx <= 0) return false
    const prevTime = hours[timeIdx - 1]
    return holds.some((h) => h.roomId === roomId && h.time === prevTime)
  }

  if (locked) {
    return (
      <div className="hallboard-page theme-hallboard">
        <div className="adventure-launch-ok demo-enter-success">
          <p className="demo-badge">Simulated · staff board</p>
          <h1>Board saved</h1>
          <p>{holds.length} rows on today&apos;s board</p>
          <p className="hint">
            Full product:{' '}
            <a href={LIVE_STAFF_URL}>Harbour Hall staff demo</a>
            {' · '}
            <a href={LIVE_BOOK_URL}>Public book</a>
          </p>
          <DemoQuoteCta styleName="Hall Board" />
          <button type="button" className="btn ghost" onClick={() => setLocked(false)}>
            Keep editing
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
        <DemoPitchBar
          packageTier="advanced"
          compareTo="/venue/harbourbook"
          compareLabel="Harbour Book"
          engineNote="Staff day board vs client facility book — Harbour Hall pair."
        />
      </div>
    )
  }

  return (
    <div className="hallboard-page theme-hallboard">
      <header className="tradeboard-top">
        <Link to="/" className="demo-back">
          ← All demos
        </Link>
        <div>
          <p className="demo-badge">Hall Board · staff</p>
          <h1>Rooms × hours board</h1>
          <p className="demo-sub">Holds, blocks, and who owns each room window — staff side of Harbour Hall.</p>
        </div>
        <span className="demo-theme-tag">Staff · not a wizard</span>
      </header>
      <div className="demo-hero-photo demo-hero-photo--compact">
        <DemoCardImage id="hallboard" className="demo-hero-photo__img" />
      </div>
      <DemoPitchBar
        packageTier="advanced"
        compareTo="/venue/harbourbook"
        compareLabel="Harbour Book"
        engineNote="Staff day board vs client facility book — Harbour Hall pair."
      />

      <div className="ops-deck demo-enter">
        <p className={`coverage-banner${freeSlots === 0 ? '' : ' all-clear'}`}>
          {freeSlots === 0
            ? 'No free room slots — board is full.'
            : `${freeSlots} free room slot${freeSlots === 1 ? '' : 's'} available today.`}
        </p>
        <label className="hive-check" style={{ marginBottom: '0.75rem' }}>
          <input type="checkbox" checked={bufferOn} onChange={(e) => setBufferOn(e.target.checked)} />
          Show {TURNAROUND_BUFFER_MIN} min turnaround buffer after bookings
        </label>

        <div className="ops-board-surface week-grid-wrap">
          <div className="ops-board-head">
            <h2>Rooms × hours</h2>
            <p className="hint">Tap status to cycle hold → confirmed → blocked. Assign staff in occupied cells.</p>
          </div>
          <div className="ops-board-scroll">
            <table className="hall-time-grid ops-cal-table">
              <thead>
                <tr>
                  <th>Room</th>
                  {hours.map((t) => (
                    <th key={t}>{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HALL_ROOMS.map((room) => (
                  <tr key={room.id}>
                    <th>
                      {room.name}
                      <small>{room.capacity} pax</small>
                    </th>
                    {hours.map((time) => {
                      const hold = holds.find((h) => h.roomId === room.id && h.time === time)
                      if (!hold) {
                        if (isBufferCell(room.id, time)) {
                          return (
                            <td key={time} className="hall-cell-free hall-cell-buffer">
                              Buffer {TURNAROUND_BUFFER_MIN}m
                            </td>
                          )
                        }
                        return (
                          <td key={time} className="hall-cell-free">
                            Free
                          </td>
                        )
                      }
                      return (
                        <td key={time} className={`hall-cell status-${hold.status}`}>
                          <button
                            type="button"
                            className="hall-status-cycle"
                            onClick={() => {
                              const i = STATUS_CYCLE.indexOf(hold.status)
                              setHoldStatus(hold.id, STATUS_CYCLE[(i + 1) % STATUS_CYCLE.length])
                              refresh()
                            }}
                          >
                            {hold.status}
                          </button>
                          <p>{hold.partyName === '—' ? 'No party' : hold.partyName}</p>
                          <select
                            value={hold.assigneeId ?? ''}
                            aria-label={`${room.name} ${time} assignee`}
                            onChange={(e) => {
                              setHoldAssignee(hold.id, e.target.value)
                              refresh()
                            }}
                          >
                            <option value="">Unassigned</option>
                            {HALL_STAFF.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="btn primary launch-btn" onClick={() => setLocked(true)}>
            Save board (demo)
          </button>
        </div>
      </div>
    </div>
  )
}

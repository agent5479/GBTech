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
  roomById,
  setHoldAssignee,
  setHoldStatus,
  type HallHold,
} from '../../shared/venueHall'

/** Hall Board — staff venue day board (not a client wizard). */
export default function HallBoard() {
  const [, setTick] = useState(0)
  const refresh = () => setTick((n) => n + 1)
  const holds = getHolds()
  const [roomFilter, setRoomFilter] = useState<string>('all')
  const [locked, setLocked] = useState(false)

  const visible =
    roomFilter === 'all' ? holds : holds.filter((h) => h.roomId === roomFilter)

  if (locked) {
    return (
      <div className="hallboard-page theme-hallboard">
        <div className="adventure-launch-ok demo-enter-success">
          <p className="demo-badge">Simulated · staff board</p>
          <h1>Board saved</h1>
          <p>{visible.length} rows on today&apos;s board</p>
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
          <h1>Venue day board</h1>
          <p className="demo-sub">Holds, blocks, and who owns each room window — staff side of Harbour Hall.</p>
        </div>
        <span className="demo-theme-tag">Staff · not a wizard</span>
      </header>
      <div className="demo-hero-photo">
        <DemoCardImage id="hallboard" className="demo-hero-photo__img" />
      </div>
      <DemoPitchBar
        packageTier="advanced"
        compareTo="/venue/harbourbook"
        compareLabel="Harbour Book"
        engineNote="Staff day board vs client facility book — Harbour Hall pair."
      />

      <div className="tradeboard-deck demo-enter">
        <aside className="tradeboard-jobs">
          <h2>Rooms</h2>
          <div className="class-type-tabs">
            <button
              type="button"
              className={`chip${roomFilter === 'all' ? ' selected' : ''}`}
              onClick={() => setRoomFilter('all')}
            >
              All
            </button>
            {HALL_ROOMS.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`chip${roomFilter === r.id ? ' selected' : ''}`}
                onClick={() => setRoomFilter(r.id)}
              >
                {r.name}
              </button>
            ))}
          </div>
          <div className="hall-hold-stack">
            {visible.map((h) => (
              <HoldCard key={h.id} hold={h} onChange={refresh} />
            ))}
          </div>
        </aside>
        <aside className="tradeboard-side">
          <section>
            <h2>Legend</h2>
            <p className="hint">Toggle hold → confirmed → blocked. Assign front-desk or facilities.</p>
            <ul className="benefit-list-sim">
              <li>Confirmed — imported booking</li>
              <li>Hold — awaiting deposit / staff OK</li>
              <li>Blocked — maintenance or private</li>
            </ul>
          </section>
          <button type="button" className="btn primary launch-btn" onClick={() => setLocked(true)}>
            Save board (demo)
          </button>
        </aside>
      </div>
    </div>
  )
}

function HoldCard({ hold, onChange }: { hold: HallHold; onChange: () => void }) {
  const room = roomById(hold.roomId)
  return (
    <article className={`hall-hold status-${hold.status}`}>
      <header>
        <strong>
          {hold.dayLabel} {hold.time}
        </strong>
        <span>{room?.name}</span>
      </header>
      <p>{hold.partyName === '—' ? 'No party' : hold.partyName}</p>
      <label className="field">
        Status
        <select
          value={hold.status}
          onChange={(e) => {
            setHoldStatus(hold.id, e.target.value as HallHold['status'])
            onChange()
          }}
        >
          <option value="hold">Hold</option>
          <option value="confirmed">Confirmed</option>
          <option value="blocked">Blocked</option>
        </select>
      </label>
      <label className="field">
        Assignee
        <select
          value={hold.assigneeId ?? ''}
          onChange={(e) => {
            setHoldAssignee(hold.id, e.target.value)
            onChange()
          }}
        >
          <option value="">Unassigned</option>
          {HALL_STAFF.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
    </article>
  )
}

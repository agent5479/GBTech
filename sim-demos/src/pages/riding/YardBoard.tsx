import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoImageTiles } from '../../components/DemoHeroImage'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import {
  STAYS,
  addStayNight,
  clockFromMin,
  eventsOn,
  getEvents,
  getHorses,
  setHorseMax,
  syncLabels,
  todayKey,
  toggleHorseRest,
  addDaysKey,
  PLANNER_DAYS,
  type StayId,
} from '../../shared/horseYard'

/**
 * Yard Board — operator: horse rest days, stays, calendar conflicts.
 */
export default function YardBoard() {
  const [, setTick] = useState(0)
  const refresh = () => setTick((n) => n + 1)

  const horses = getHorses()
  const [dayOffset, setDayOffset] = useState(0)
  const [stayId, setStayId] = useState<StayId>('camp')
  const [locked, setLocked] = useState(false)
  const date = addDaysKey(todayKey(), dayOffset)
  const dayEvents = eventsOn(date)
  const sync = syncLabels()
  const allEvents = getEvents()

  if (locked) {
    return (
      <div className="yardboard-page theme-yardboard">
        <div className="adventure-launch-ok demo-enter-success">
          <p className="demo-badge">Simulated · not a live calendar</p>
          <h1>Yard saved</h1>
          <p>
            {horses.filter((h) => h.restWeekday != null).length} horses on rest · {allEvents.filter((e) => e.kind === 'stay').length} stay
            nights · {allEvents.filter((e) => e.kind === 'busy' || e.kind === 'booking').length} calendar blocks
          </p>
          <p className="sync-chip">{sync.script}</p>
          <p className="sync-chip">{sync.calendar}</p>
          <DemoQuoteCta styleName="Yard Board" />
          <button type="button" className="btn ghost" onClick={() => setLocked(false)}>
            Keep editing
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
        <DemoPitchBar
          packageTier="advanced"
          compareTo="/riding/shoreride"
          compareLabel="Shore Ride"
          engineNote="Same tide, sun, horse roster, and calendar check — yard board vs guest wizard."
        />
      </div>
    )
  }

  return (
    <div className="yardboard-page theme-yardboard">
      <header className="classboard-top">
        <Link to="/" className="demo-back">
          ← All demos
        </Link>
        <div>
          <p className="demo-badge">Yard Board · operator</p>
          <h1>Horses, tides, and the calendar in one place</h1>
          <p className="demo-sub">
            Rest days, farrier blocks, and overstays write to a simulated Apps Script calendar — guests cannot double-book.
          </p>
        </div>
        <span className="demo-theme-tag">Different UI · not a wizard</span>
      </header>
      <DemoImageTiles id="yardboard" />
      <DemoPitchBar
        packageTier="advanced"
        compareTo="/riding/shoreride"
        compareLabel="Shore Ride"
        engineNote="Same tide, sun, horse roster, and calendar check — yard board vs guest wizard."
      />

      <div className="classboard-deck yardboard-deck demo-enter">
        <aside className="classboard-schedule">
          <h2>Linked calendar</h2>
          <div className="class-type-tabs">
            {Array.from({ length: PLANNER_DAYS }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`chip${dayOffset === i ? ' selected' : ''}`}
                onClick={() => setDayOffset(i)}
              >
                {addDaysKey(todayKey(), i).slice(5)}
              </button>
            ))}
          </div>
          {dayEvents.length === 0 && <p className="hint">No events this day — the window is clear.</p>}
          {dayEvents.map((ev) => (
            <article key={ev.id} className={`class-fill-card cal-kind-${ev.kind}`}>
              <header>
                <strong>
                  {clockFromMin(ev.startMin)}–{clockFromMin(ev.endMin)}
                </strong>
                <span>{ev.kind}</span>
              </header>
              <p className="roster-line">{ev.title}</p>
              <p className="sync-chip">Calendar event {ev.id}</p>
            </article>
          ))}
        </aside>

        <aside className="classboard-side">
          <section>
            <h2>Horse roster</h2>
            <p className="hint">Tick rest. Cap daily rides. Booking checks this against the calendar.</p>
            <div className="exercise-checks">
              {horses.map((h) => (
                <label key={h.id} className={`exercise-check${h.restWeekday != null ? ' on' : ''}`}>
                  <input
                    type="checkbox"
                    checked={h.restWeekday != null}
                    onChange={() => {
                      toggleHorseRest(h.id)
                      refresh()
                    }}
                  />
                  <span>
                    <strong>{h.name}</strong>
                    <small>
                      {' '}
                      {h.level} · max {h.maxPerDay}/day
                    </small>
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={4}
                    aria-label={`${h.name} max rides`}
                    value={h.maxPerDay}
                    onChange={(e) => {
                      setHorseMax(h.id, Number(e.target.value))
                      refresh()
                    }}
                  />
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2>Overstay</h2>
            <p className="hint">Farmstay, camp, or a visiting horse for the night — blocked on the same calendar.</p>
            <div className="class-type-tabs">
              {STAYS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`chip${stayId === s.id ? ' selected' : ''}`}
                  onClick={() => setStayId(s.id)}
                >
                  {s.name}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                addStayNight(date, stayId)
                refresh()
              }}
            >
              Add {STAYS.find((s) => s.id === stayId)?.name} on this day
            </button>
          </section>

          <p className="sync-chip">{sync.script}</p>
          <p className="sync-chip">{sync.calendar}</p>
          <button type="button" className="btn primary launch-btn" onClick={() => setLocked(true)}>
            Save yard (demo)
          </button>
        </aside>
      </div>
    </div>
  )
}

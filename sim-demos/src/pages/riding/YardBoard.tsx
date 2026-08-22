import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoCardImage } from '../../components/DemoHeroImage'
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
  weekdayFromKey,
  type StayId,
} from '../../shared/horseYard'

/**
 * Yard Board — operator: horse rest days, stays, calendar conflicts.
 */
export default function YardBoard() {
  const [, setTick] = useState(0)
  const refresh = () => setTick((n) => n + 1)

  const horses = getHorses()
  const startKey = todayKey()
  const days = Array.from({ length: PLANNER_DAYS }, (_, i) => addDaysKey(startKey, i))
  const [stayId, setStayId] = useState<StayId>('camp')
  const [stayDate, setStayDate] = useState(startKey)
  const [locked, setLocked] = useState(false)
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
          <h1>Horse week grid</h1>
          <p className="demo-sub">
            Rest days, farrier blocks, and overstays write to a simulated Apps Script calendar — guests cannot double-book.
          </p>
        </div>
        <span className="demo-theme-tag">Different UI · not a wizard</span>
      </header>
      <div className="demo-hero-photo demo-hero-photo--compact">
        <DemoCardImage id="yardboard" className="demo-hero-photo__img" />
      </div>
      <DemoPitchBar
        packageTier="advanced"
        compareTo="/riding/shoreride"
        compareLabel="Shore Ride"
        engineNote="Same tide, sun, horse roster, and calendar check — yard board vs guest wizard."
      />

      <div className="ops-deck yardboard-deck demo-enter">
        <div className="ops-board-surface week-grid-wrap">
          <div className="ops-board-head">
            <h2>Horse × day</h2>
            <p className="hint">Rest toggles and stay nights on one planner.</p>
          </div>
          <div className="ops-board-scroll">
            <table className="horse-week-grid ops-cal-table">
              <thead>
                <tr>
                  <th>Horse</th>
                  {days.map((date) => (
                    <th key={date}>{date.slice(5)}</th>
                  ))}
                </tr>
              </thead>
            <tbody>
              {horses.map((h) => (
                <tr key={h.id}>
                  <th>
                    {h.name}
                    <small>
                      {h.level} · max {h.maxPerDay}/day
                    </small>
                  </th>
                  {days.map((date) => {
                    const resting = h.restWeekday != null && weekdayFromKey(date) === h.restWeekday
                    const cellEvents = eventsOn(date).filter(
                      (e) => e.kind !== 'open' && (e.kind === 'stay' || !e.horseId || e.horseId === h.id),
                    )
                    return (
                      <td key={date} className={resting ? 'horse-cell-rest' : ''}>
                        <label className={`exercise-check${resting ? ' on' : ''}`}>
                          <input
                            type="checkbox"
                            checked={resting}
                            onChange={() => {
                              toggleHorseRest(h.id, date)
                              refresh()
                            }}
                          />
                          Rest
                        </label>
                        {cellEvents.map((ev) => (
                          <p key={ev.id} className={`horse-cell-ev cal-kind-${ev.kind}`}>
                            {ev.kind === 'stay' ? 'Stay' : clockFromMin(ev.startMin)} · {ev.title}
                          </p>
                        ))}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        <aside className="classboard-side">
          <section>
            <h2>Daily cap</h2>
            <p className="hint">Max rides per horse. Booking checks this against the calendar.</p>
            <div className="exercise-checks">
              {horses.map((h) => (
                <label key={h.id} className="exercise-check">
                  <span>
                    <strong>{h.name}</strong>
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
            <h2>Add stay night</h2>
            <p className="hint">Farmstay, camp, or a visiting horse — blocked on the same calendar.</p>
            <label className="field">
              Night
              <select value={stayDate} onChange={(e) => setStayDate(e.target.value)}>
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
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
                addStayNight(stayDate, stayId)
                refresh()
              }}
            >
              Add {STAYS.find((s) => s.id === stayId)?.name}
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

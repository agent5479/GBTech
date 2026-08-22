import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoCardImage } from '../../components/DemoHeroImage'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import {
  APIARY_STAFF,
  HIVE_YARDS,
  LIVE_BEEMARSHALL_URL,
  getAssignments,
  setAssignmentStaff,
  staffById,
  toggleReminder,
  yardById,
} from '../../shared/beekeeping'

/** Apiary Board — management staff schedules & yard organisation. */
export default function ApiaryBoard() {
  const [, setTick] = useState(0)
  const refresh = () => setTick((n) => n + 1)
  const rows = getAssignments()
  const [locked, setLocked] = useState(false)

  if (locked) {
    return (
      <div className="apiary-page theme-apiary">
        <div className="adventure-launch-ok demo-enter-success">
          <p className="demo-badge">Simulated · management</p>
          <h1>Roster saved</h1>
          <p>{rows.filter((r) => r.reminder).length} reminders active</p>
          <p className="hint">
            Live app:{' '}
            <a href={LIVE_BEEMARSHALL_URL} target="_blank" rel="noopener noreferrer">
              BeeMarshall
            </a>
          </p>
          <DemoQuoteCta styleName="Apiary Board" />
          <button type="button" className="btn ghost" onClick={() => setLocked(false)}>
            Keep editing
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
        <DemoPitchBar
          packageTier="advanced"
          compareTo="/beekeeping/hiverun"
          compareLabel="Hive Run"
          engineNote="Management staff schedules vs field hive-cluster actions — no public client."
        />
      </div>
    )
  }

  return (
    <div className="apiary-page theme-apiary">
      <header className="tradeboard-top">
        <Link to="/" className="demo-back">
          ← All demos
        </Link>
        <div>
          <p className="demo-badge">Apiary Board · management</p>
          <h1>Staff &amp; yard roster</h1>
          <p className="demo-sub">Who covers which cluster, reminders, GPS chips — organise the team.</p>
        </div>
        <span className="demo-theme-tag">Management · not field wizard</span>
      </header>
      <div className="demo-hero-photo">
        <DemoCardImage id="apiary" className="demo-hero-photo__img" />
      </div>
      <DemoPitchBar
        packageTier="advanced"
        compareTo="/beekeeping/hiverun"
        compareLabel="Hive Run"
        engineNote="Management staff schedules vs field hive-cluster actions — no public client."
      />

      <div className="tradeboard-deck demo-enter">
        <aside className="tradeboard-jobs">
          <h2>Week assignments</h2>
          <div className="apiary-roster">
            {rows.map((row) => {
              const yard = yardById(row.yardId)
              return (
                <article key={`${row.yardId}-${row.dayLabel}`} className="apiary-row">
                  <header>
                    <strong>
                      {row.dayLabel} · {yard?.name}
                    </strong>
                    <span className="gps-chip">{yard?.gpsLabel}</span>
                  </header>
                  <p className="hint">
                    {yard?.hiveCount} hives · focus: {row.focus}
                  </p>
                  <label className="field">
                    Staff
                    <select
                      value={row.staffId}
                      onChange={(e) => {
                        setAssignmentStaff(row.yardId, row.dayLabel, e.target.value)
                        refresh()
                      }}
                    >
                      {APIARY_STAFF.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} · {s.role}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={`exercise-check${row.reminder ? ' on' : ''}`}>
                    <input
                      type="checkbox"
                      checked={row.reminder}
                      onChange={() => {
                        toggleReminder(row.yardId, row.dayLabel)
                        refresh()
                      }}
                    />
                    Reminder on
                  </label>
                  <p className="roster-line">Assigned: {staffById(row.staffId)?.name}</p>
                </article>
              )
            })}
          </div>
        </aside>
        <aside className="tradeboard-side">
          <section>
            <h2>Clusters</h2>
            <p className="hint">GPS labels match Hive Run yards — same engine, management view.</p>
            <ul className="benefit-list-sim">
              {HIVE_YARDS.map((y) => (
                <li key={y.id}>
                  {y.name} · <span className="gps-chip">{y.gpsLabel}</span>
                </li>
              ))}
            </ul>
          </section>
          <button type="button" className="btn primary launch-btn" onClick={() => setLocked(true)}>
            Save roster (demo)
          </button>
        </aside>
      </div>
    </div>
  )
}

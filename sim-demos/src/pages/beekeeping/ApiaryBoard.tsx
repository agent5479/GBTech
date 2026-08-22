import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoCardImage } from '../../components/DemoHeroImage'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import { MarkersMap } from '../../components/MarkersMap'
import {
  APIARY_STAFF,
  HIVE_MAP_CENTER,
  HIVE_YARDS,
  LIVE_BEEMARSHALL_URL,
  WEEK_DAYS,
  apiaryOpsHint,
  getAssignments,
  quarantineYards,
  setAssignmentStaff,
  staffById,
  toggleReminder,
  totalHives,
} from '../../shared/beekeeping'

/** Apiary Board — management dashboard: KPIs, cluster map, week roster. */
export default function ApiaryBoard() {
  const [, setTick] = useState(0)
  const refresh = () => setTick((n) => n + 1)
  const rows = getAssignments()
  const [locked, setLocked] = useState(false)
  const reminders = rows.filter((r) => r.reminder).length
  const watch = HIVE_YARDS.filter((y) => y.flag !== 'ok').length
  const quarantine = quarantineYards().length
  const seasonHint = apiaryOpsHint()

  const points = HIVE_YARDS.map((y) => ({
    id: y.id,
    lat: y.lat,
    lng: y.lng,
    label: `${y.name} · ${y.hiveCount}`,
    selected: y.flag !== 'ok',
  }))

  if (locked) {
    return (
      <div className="apiary-page theme-apiary">
        <div className="adventure-launch-ok demo-enter-success">
          <p className="demo-badge">Simulated · management</p>
          <h1>Roster saved</h1>
          <p>
            {totalHives()} hives · {reminders} reminders
          </p>
          <p className="hint">
            Live app:{' '}
            <a href={LIVE_BEEMARSHALL_URL} target="_blank" rel="noopener noreferrer">
              BeeMarshall
            </a>
          </p>
          <DemoQuoteCta styleName="Apiary Board" pitchKind="customOps" />
          <button type="button" className="btn ghost" onClick={() => setLocked(false)}>
            Keep editing
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
        <DemoPitchBar
          pitchKind="customOps"
          compareTo="/beekeeping/hiverun"
          compareLabel="Hive Run"
          engineNote="Management dashboard vs field log-action — no public client."
        />
      </div>
    )
  }

  return (
    <div className="apiary-page theme-apiary">
      <header className="apiary-top">
        <Link to="/" className="demo-back">
          ← All demos
        </Link>
        <div>
          <p className="demo-badge">Apiary Board · management</p>
          <h1>Week ops dashboard</h1>
          <p className="demo-sub">
            Assign staff by day, chase reminders, and keep quarantine and dry-only access in view. Management
            only — not a public booking flow.
          </p>
        </div>
        <span className="demo-theme-tag">Ops dashboard</span>
      </header>
      <div className="demo-hero-photo">
        <DemoCardImage id="apiary" className="demo-hero-photo__img" />
      </div>
      <DemoPitchBar
        pitchKind="customOps"
        compareTo="/beekeeping/hiverun"
        compareLabel="Hive Run"
        engineNote="Management dashboard vs field log-action — no public client."
      />

      <div className="kpi-row">
        <article>
          <strong>{totalHives()}</strong>
          <span>Hives</span>
        </article>
        <article>
          <strong>{HIVE_YARDS.length}</strong>
          <span>Clusters</span>
        </article>
        <article>
          <strong>{reminders}</strong>
          <span>Reminders</span>
        </article>
        <article className={quarantine || watch ? 'warn' : ''}>
          <strong>{quarantine}</strong>
          <span>Quarantine yards</span>
        </article>
      </div>
      <p className="ops-season-hint">{seasonHint}</p>

      <div className="apiary-split">
        <div className="hive-map-card hive-map-card--wide">
          <MarkersMap
            points={points}
            center={HIVE_MAP_CENTER}
            zoom={10}
            pathColor="#d4b56a"
            label="Clusters — watch yards highlighted"
          />
        </div>
        <ul className="cluster-dash">
          {HIVE_YARDS.map((y) => (
            <li key={y.id} className={`cluster-dash-item flag-${y.flag}`}>
              <strong>{y.name}</strong>
              <span>
                {y.hiveCount} hives · {y.siteType} · {y.access}
              </span>
              <small>
                {y.landowner}
                {y.contactBefore ? ' · call first' : ''}
              </small>
            </li>
          ))}
        </ul>
      </div>

      <div className="week-grid-wrap">
        <h2>This week</h2>
        <table className="week-grid">
          <thead>
            <tr>
              <th>Yard</th>
              {WEEK_DAYS.map((d) => (
                <th key={d}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HIVE_YARDS.map((y) => (
              <tr key={y.id}>
                <th>{y.name}</th>
                {WEEK_DAYS.map((d) => {
                  const cell = rows.find((r) => r.yardId === y.id && r.dayLabel === d)
                  return (
                    <td key={d}>
                      {cell ? (
                        <div className="week-cell">
                          <select
                            value={cell.staffId}
                            onChange={(e) => {
                              setAssignmentStaff(y.id, d, e.target.value)
                              refresh()
                            }}
                          >
                            {APIARY_STAFF.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                          <label>
                            <input
                              type="checkbox"
                              checked={cell.reminder}
                              onChange={() => {
                                toggleReminder(y.id, d)
                                refresh()
                              }}
                            />
                            remind
                          </label>
                          <small>{staffById(cell.staffId)?.role}</small>
                        </div>
                      ) : (
                        <span className="week-empty">—</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="btn primary launch-btn" onClick={() => setLocked(true)}>
          Save roster (demo)
        </button>
      </div>
    </div>
  )
}

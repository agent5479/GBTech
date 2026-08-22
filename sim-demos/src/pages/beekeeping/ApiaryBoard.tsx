import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminTabShell } from '../../components/AdminTabShell'
import { DemoOutsideShell } from '../../components/DemoChrome'
import { DemoModeBar } from '../../components/DemoModeBar'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import { MarkersMap } from '../../components/MarkersMap'
import { MultiSelectChipRail } from '../../components/MultiSelectChipRail'
import { StaffRoleAllocator } from '../../components/StaffRoleAllocator'
import { WeekCalendarNav } from '../../components/WeekCalendarNav'
import {
  APIARY_STAFF,
  HIVE_MAP_CENTER,
  HIVE_YARDS,
  LIVE_BEEMARSHALL_URL,
  STAFF_SKILLS,
  WEEK_DAYS,
  apiaryOpsHint,
  dryOnlyYardsWithReminder,
  getAllStaff,
  getAssignmentsForWeek,
  quarantineYards,
  setAssignmentAssistant,
  setAssignmentStaff,
  setStaffRole,
  staffWeekLoad,
  toggleReminder,
  toggleStaffSkill,
  totalHives,
} from '../../shared/beekeeping'
import { currentWeekStart } from '../../shared/schedulingMock'

const ADMIN_TABS = [
  { id: 'schedule', label: 'Schedule' },
  { id: 'staff', label: 'Staff' },
  { id: 'yards', label: 'Yards' },
  { id: 'rules', label: 'Rules' },
]

const YARD_FILTERS = [
  { id: 'quarantine', label: 'Quarantine' },
  { id: 'watch', label: 'Watch' },
  { id: 'dry-only', label: 'Dry-only' },
  { id: 'year-round', label: 'Year-round' },
]

/** Apiary Board — management dashboard with admin tabs. */
export default function ApiaryBoard() {
  const [, setTick] = useState(0)
  const refresh = () => setTick((n) => n + 1)
  const [weekStart, setWeekStart] = useState(currentWeekStart())
  const [tab, setTab] = useState('schedule')
  const [yardFilters, setYardFilters] = useState<string[]>([])
  const [locked, setLocked] = useState(false)
  const [visitSeq, setVisitSeq] = useState<Record<string, number>>({})
  const [bulkMsg, setBulkMsg] = useState<string | null>(null)

  const rows = getAssignmentsForWeek(weekStart)
  const reminders = rows.filter((r) => r.reminder).length
  const quarantine = quarantineYards().length
  const seasonHint = apiaryOpsHint()
  const hasOverdue = quarantine > 0 || dryOnlyYardsWithReminder().length > 0

  const filteredYards = useMemo(() => {
    if (!yardFilters.length) return HIVE_YARDS
    return HIVE_YARDS.filter((y) => {
      if (yardFilters.includes('quarantine') && y.flag === 'quarantine') return true
      if (yardFilters.includes('watch') && y.flag === 'watch') return true
      if (yardFilters.includes('dry-only') && y.access === 'dry-only') return true
      if (yardFilters.includes('year-round') && y.siteType === 'year-round') return true
      return false
    })
  }, [yardFilters])

  const seqKey = (yardId: string, day: string) => `${yardId}-${day}-${weekStart}`
  const getSeq = (yardId: string, day: string) => visitSeq[seqKey(yardId, day)] ?? 1
  const setSeq = (yardId: string, day: string, n: number) => {
    setVisitSeq((prev) => ({ ...prev, [seqKey(yardId, day)]: Math.max(1, Math.min(99, n)) }))
  }

  const toggleYardFilter = (id: string) => {
    setYardFilters((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const points = HIVE_YARDS.map((y) => ({
    id: y.id,
    lat: y.lat,
    lng: y.lng,
    label: `${y.name} · ${y.hiveCount}`,
    selected: y.flag !== 'ok' || yardFilters.some((f) => (f === 'quarantine' && y.flag === 'quarantine') || (f === 'watch' && y.flag === 'watch')),
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
        <DemoPitchBar pitchKind="customOps" compareTo="/beekeeping/hiverun" compareLabel="Hive Run" />
      </div>
    )
  }

  return (
    <div className="apiary-page theme-apiary">
      <DemoOutsideShell imageId="apiary" heroCompact />
      <DemoPitchBar pitchKind="customOps" compareTo="/beekeeping/hiverun" compareLabel="Hive Run" />
      <DemoModeBar
        clientTo="/beekeeping/hiverun"
        clientLabel="Field view"
        opsTo="/beekeeping/apiary"
        opsLabel="Admin view"
      />
      <header className="apiary-top ops-admin-head">
        <div>
          <p className="demo-badge">Apiary Board · management</p>
          <h1>Week ops dashboard</h1>
          <p className="demo-sub">Admin backend — schedule staff, assign roles, filter yards.</p>
        </div>
        <span className="demo-theme-tag">Ops dashboard</span>
      </header>

      <div className="kpi-row kpi-row--header">
        <article>
          <strong>{totalHives()}</strong>
          <span>Active hives</span>
        </article>
        <article className={reminders ? 'warn' : undefined}>
          <strong>{reminders}</strong>
          <span>Reminders</span>
        </article>
        <article className={quarantine ? 'warn' : undefined}>
          <strong>{quarantine}</strong>
          <span>Quarantine yards</span>
        </article>
        <article>
          <strong>{getAllStaff().length}</strong>
          <span>Field staff</span>
        </article>
      </div>

      <div className="ops-admin-deck">
        <AdminTabShell tabs={ADMIN_TABS} active={tab} onChange={setTab}>
          {tab === 'schedule' && (
            <div className="ops-admin-split">
              <div className="ops-admin-main">
                <WeekCalendarNav weekStart={weekStart} onChange={setWeekStart} />
                <MultiSelectChipRail label="Filter yards" options={YARD_FILTERS} selected={yardFilters} onToggle={toggleYardFilter} />
                <div className={`ops-overdue-banner ops-season-hint${hasOverdue ? '' : ' all-clear'}`}>
                  <strong>{hasOverdue ? 'Overdue — attention needed' : 'Season check — all clear'}</strong>
                  <p>{seasonHint}</p>
                </div>
                <div className="ops-board-surface week-grid-wrap">
                  <div className="ops-board-head">
                    <h2>Roster grid</h2>
                    <p className="hint">Lead + relief per yard · visit sequence #</p>
                  </div>
                  <div className="ops-board-scroll">
                    <table className="week-grid ops-cal-table">
                      <thead>
                        <tr>
                          <th>Yard</th>
                          {WEEK_DAYS.map((d) => (
                            <th key={d}>{d}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredYards.map((y) => (
                          <tr key={y.id}>
                            <th>{y.name}</th>
                            {WEEK_DAYS.map((d) => {
                              const cell = rows.find((r) => r.yardId === y.id && r.dayLabel === d)
                              return (
                                <td key={d}>
                                  {cell ? (
                                    <div className="week-cell">
                                      <StaffRoleAllocator
                                        compact
                                        staff={APIARY_STAFF}
                                        primaryId={cell.staffId}
                                        assistantId={cell.assistantStaffId}
                                        onPrimaryChange={(id) => {
                                          setAssignmentStaff(y.id, d, weekStart, id)
                                          refresh()
                                        }}
                                        onAssistantChange={(id) => {
                                          setAssignmentAssistant(y.id, d, weekStart, id || undefined)
                                          refresh()
                                        }}
                                      />
                                      <label className="visit-seq-field">
                                        Visit #
                                        <input
                                          type="number"
                                          min={1}
                                          max={99}
                                          value={getSeq(y.id, d)}
                                          onChange={(e) => setSeq(y.id, d, Number(e.target.value))}
                                        />
                                      </label>
                                      <label>
                                        <input
                                          type="checkbox"
                                          checked={cell.reminder}
                                          onChange={() => {
                                            toggleReminder(y.id, d, weekStart)
                                            refresh()
                                          }}
                                        />
                                        remind
                                      </label>
                                      <small>{cell.focus}</small>
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
                  </div>
                  <button type="button" className="btn primary launch-btn" onClick={() => setLocked(true)}>
                    Save roster (demo)
                  </button>
                </div>
              </div>
              <aside className="ops-admin-side">
                <section className="ops-side-card">
                  <h3>This week</h3>
                  <div className="kpi-row kpi-row--compact">
                    <article>
                      <strong>{totalHives()}</strong>
                      <span>Hives</span>
                    </article>
                    <article>
                      <strong>{reminders}</strong>
                      <span>Reminders</span>
                    </article>
                  </div>
                </section>
                <section className="ops-side-card">
                  <h3>Staff load</h3>
                  <ul className="staff-load-list">
                    {getAllStaff().map((s) => (
                      <li key={s.id}>
                        <strong>{s.name}</strong>
                        <span>{staffWeekLoad(s.id, weekStart)} yards</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </aside>
            </div>
          )}

          {tab === 'staff' && (
            <div className="staff-roster-grid">
              {getAllStaff().map((s) => (
                <article key={s.id} className="staff-roster-card">
                  <h3>{s.name}</h3>
                  <label className="field">
                    Role
                    <select
                      value={s.role}
                      onChange={(e) => {
                        setStaffRole(s.id, e.target.value)
                        refresh()
                      }}
                    >
                      <option value="Lead apiarist">Lead apiarist</option>
                      <option value="Field hand">Field hand</option>
                      <option value="Seasonal">Seasonal</option>
                      <option value="Extractor">Extractor</option>
                    </select>
                  </label>
                  <p className="hint">Skills (multi-select)</p>
                  <MultiSelectChipRail
                    options={STAFF_SKILLS.map((sk) => ({ id: sk, label: sk.replace('-', ' ') }))}
                    selected={s.skills}
                    onToggle={(sk) => {
                      toggleStaffSkill(s.id, sk)
                      refresh()
                    }}
                  />
                  <p className="staff-load-line">
                    {staffWeekLoad(s.id, weekStart)} yard assignment{staffWeekLoad(s.id, weekStart) === 1 ? '' : 's'} this week
                  </p>
                </article>
              ))}
            </div>
          )}

          {tab === 'yards' && (
            <div className="yards-admin-panel">
              <div className="hive-map-card hive-map-card--wide">
                <MarkersMap points={points} center={HIVE_MAP_CENTER} zoom={10} pathColor="#d4b56a" label="Clusters" />
              </div>
              <ul className="cluster-dash">
                {HIVE_YARDS.map((y) => (
                  <li key={y.id} className={`cluster-dash-item flag-${y.flag}`}>
                    <strong>{y.name}</strong>
                    <span>
                      {y.hiveCount} hives · {y.siteType} · {y.access}
                    </span>
                    <small>{y.landowner}</small>
                  </li>
                ))}
              </ul>
              {bulkMsg ? <p className="sync-chip">{bulkMsg}</p> : null}
              <button
                type="button"
                className="btn ghost"
                onClick={() => setBulkMsg('Demo: team assign queued for selected yards (simulated).')}
              >
                Bulk assign team (demo)
              </button>
            </div>
          )}

          {tab === 'rules' && (
            <div className="rules-admin-panel">
              <section className="ops-side-card">
                <h3>Season rules</h3>
                <p>{seasonHint}</p>
              </section>
              <section className="ops-side-card">
                <h3>Quarantine policy</h3>
                <p>Quarantine yards require individual hive picks on Hive Run — no supers moved until cleared.</p>
                <p className="hint">{quarantine} yard{quarantine === 1 ? '' : 's'} currently flagged.</p>
              </section>
              <section className="ops-side-card">
                <h3>Dry-only access</h3>
                <p>Soft tracks — check weather before dispatch. Reminders auto-flag on the roster.</p>
              </section>
            </div>
          )}
        </AdminTabShell>
      </div>
    </div>
  )
}

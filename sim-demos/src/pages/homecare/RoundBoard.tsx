import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminTabShell } from '../../components/AdminTabShell'
import { DemoCardImage } from '../../components/DemoHeroImage'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import { MultiSelectChipRail } from '../../components/MultiSelectChipRail'
import { StaffRoleAllocator } from '../../components/StaffRoleAllocator'
import { WeekCalendarNav } from '../../components/WeekCalendarNav'
import {
  CARER_SKILLS,
  CARERS,
  CARE_CLIENTS,
  ROUND_HOURS,
  autoFillCoverageGaps,
  careTaskById,
  carerById,
  carerWeekLoad,
  clientById,
  getAllCarers,
  getRoundsForWeek,
  setCarerRole,
  setRoundCarer,
  setRoundRelief,
  suggestCarerForClient,
  toggleCarerSkill,
  toggleRoundCovered,
} from '../../shared/homecare'
import { currentWeekStart } from '../../shared/schedulingMock'

type VisitStatus = 'scheduled' | 'en-route' | 'done'

const ADMIN_TABS = [
  { id: 'schedule', label: 'Schedule' },
  { id: 'staff', label: 'Staff' },
  { id: 'clients', label: 'Clients' },
  { id: 'coverage', label: 'Coverage' },
]

/** Round Board — admin backend with tabs and multi-week schedule. */
export default function RoundBoard() {
  const [, setTick] = useState(0)
  const refresh = () => setTick((n) => n + 1)
  const [weekStart, setWeekStart] = useState(currentWeekStart())
  const [tab, setTab] = useState('schedule')
  const [filters, setFilters] = useState<string[]>([])
  const [highlightClients, setHighlightClients] = useState<string[]>([])
  const [locked, setLocked] = useState(false)
  const [visitStatus, setVisitStatus] = useState<Record<string, VisitStatus>>({})
  const [coverageMsg, setCoverageMsg] = useState<string | null>(null)

  const rounds = getRoundsForWeek(weekStart)
  const gaps = rounds.filter((r) => !r.covered).length

  const suburbOptions = useMemo(
    () => [...new Set(CARE_CLIENTS.map((c) => c.suburb))].map((s) => ({ id: s, label: s })),
    [],
  )

  const filteredRounds = useMemo(() => {
    let list = rounds
    if (filters.includes('uncovered')) list = list.filter((r) => !r.covered)
    for (const sub of filters) {
      if (sub !== 'uncovered' && suburbOptions.some((o) => o.id === sub)) {
        list = list.filter((r) => clientById(r.clientId)?.suburb === sub)
      }
    }
    return list
  }, [rounds, filters, suburbOptions])

  const toggleFilter = (id: string) => {
    setFilters((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const toggleClientHighlight = (id: string) => {
    setHighlightClients((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const cell = (carerId: string, time: string) =>
    filteredRounds.find((r) => r.carerId === carerId && r.time === time)

  const getStatus = (slotId: string): VisitStatus => visitStatus[slotId] ?? 'scheduled'
  const setStatus = (slotId: string, status: VisitStatus) => {
    setVisitStatus((prev) => ({ ...prev, [slotId]: status }))
  }

  if (locked) {
    return (
      <div className="rounds-page theme-rounds">
        <div className="adventure-launch-ok demo-enter-success">
          <p className="demo-badge">Simulated · management</p>
          <h1>Rounds saved</h1>
          <p>
            {rounds.length} visits · {gaps} coverage gap{gaps === 1 ? '' : 's'}
          </p>
          <DemoQuoteCta styleName="Round Board" pitchKind="customOps" />
          <button type="button" className="btn ghost" onClick={() => setLocked(false)}>
            Keep editing
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
        <DemoPitchBar pitchKind="customOps" compareTo="/homecare/visit" compareLabel="Care Visit" />
      </div>
    )
  }

  return (
    <div className="rounds-page theme-rounds">
      <header className="apiary-top ops-admin-head">
        <Link to="/" className="demo-back">
          ← All demos
        </Link>
        <div>
          <p className="demo-badge">Round Board · management</p>
          <h1>Care rounds admin</h1>
          <p className="demo-sub">Schedule · staff roles · client filters · coverage tools.</p>
        </div>
        <span className="demo-theme-tag">Admin backend</span>
      </header>
      <div className="demo-hero-photo demo-hero-photo--compact">
        <DemoCardImage id="rounds" className="demo-hero-photo__img" />
      </div>
      <DemoPitchBar pitchKind="customOps" compareTo="/homecare/visit" compareLabel="Care Visit" />

      <div className="ops-admin-deck">
        <AdminTabShell tabs={ADMIN_TABS} active={tab} onChange={setTab}>
          {tab === 'schedule' && (
            <div className="ops-admin-split">
              <div className="ops-admin-main">
                <WeekCalendarNav weekStart={weekStart} onChange={setWeekStart} />
                <MultiSelectChipRail
                  label="Filters"
                  options={[{ id: 'uncovered', label: 'Uncovered only' }, ...suburbOptions]}
                  selected={filters}
                  onToggle={toggleFilter}
                />
                <div className={`coverage-hero${gaps > 0 ? ' has-gaps' : ' all-clear'}`}>
                  <p className="coverage-hero__label">Uncovered visits</p>
                  <strong>{gaps}</strong>
                </div>
                <div className="ops-board-surface round-sheet-wrap">
                  <div className="ops-board-scroll">
                    <table className="round-sheet ops-cal-table">
                      <thead>
                        <tr>
                          <th>Carer</th>
                          {ROUND_HOURS.map((h) => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {CARERS.map((c) => (
                          <tr key={c.id}>
                            <th>
                              {c.name}
                              <small>{carerById(c.id)?.role}</small>
                            </th>
                            {ROUND_HOURS.map((h) => {
                              const slot = cell(c.id, h)
                              if (!slot) {
                                return (
                                  <td key={h} className="round-empty">
                                    —
                                  </td>
                                )
                              }
                              const client = clientById(slot.clientId)
                              const highlighted = highlightClients.includes(slot.clientId)
                              return (
                                <td
                                  key={h}
                                  className={`${slot.covered ? 'round-ok' : 'round-gap'}${highlighted ? ' round-highlight' : ''}`}
                                >
                                  <strong>{client?.name}</strong>
                                  <span>{client?.suburb}</span>
                                  <small>{slot.tasks.map((id) => careTaskById(id)?.name).join(' · ')}</small>
                                  <StaffRoleAllocator
                                    compact
                                    staff={CARERS.map((x) => ({ id: x.id, name: x.name, role: carerById(x.id)?.role }))}
                                    primaryId={slot.carerId}
                                    assistantId={slot.reliefCarerId}
                                    onPrimaryChange={(id) => {
                                      setRoundCarer(slot.id, id)
                                      refresh()
                                    }}
                                    onAssistantChange={(id) => {
                                      setRoundRelief(slot.id, id || undefined)
                                      refresh()
                                    }}
                                  />
                                  <select
                                    className="status-pipeline"
                                    value={getStatus(slot.id)}
                                    onChange={(e) => setStatus(slot.id, e.target.value as VisitStatus)}
                                  >
                                    <option value="scheduled">Scheduled</option>
                                    <option value="en-route">En route</option>
                                    <option value="done">Done</option>
                                  </select>
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={slot.covered}
                                      onChange={() => {
                                        toggleRoundCovered(slot.id)
                                        refresh()
                                      }}
                                    />
                                    Covered
                                  </label>
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button type="button" className="btn primary launch-btn" onClick={() => setLocked(true)}>
                    Save rounds (demo)
                  </button>
                </div>
              </div>
              <aside className="ops-admin-side">
                <section className="ops-side-card">
                  <h3>Carer load</h3>
                  <ul className="staff-load-list">
                    {getAllCarers().map((c) => (
                      <li key={c.id}>
                        <strong>{c.name}</strong>
                        <span>
                          {carerWeekLoad(c.id, weekStart)}/{c.maxVisitsPerDay} visits
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </aside>
            </div>
          )}

          {tab === 'staff' && (
            <div className="staff-roster-grid">
              {getAllCarers().map((c) => (
                <article key={c.id} className="staff-roster-card">
                  <h3>{c.name}</h3>
                  <label className="field">
                    Role
                    <select
                      value={c.role}
                      onChange={(e) => {
                        setCarerRole(c.id, e.target.value)
                        refresh()
                      }}
                    >
                      <option value="Lead carer">Lead carer</option>
                      <option value="Relief">Relief</option>
                      <option value="Trainee">Trainee</option>
                    </select>
                  </label>
                  <p className="hint">Certifications</p>
                  <MultiSelectChipRail
                    options={CARER_SKILLS.map((sk) => ({ id: sk, label: sk }))}
                    selected={c.skills}
                    onToggle={(sk) => {
                      toggleCarerSkill(c.id, sk)
                      refresh()
                    }}
                  />
                  <div className="staff-load-bar">
                    <span style={{ width: `${Math.min(100, (carerWeekLoad(c.id, weekStart) / c.maxVisitsPerDay) * 100)}%` }} />
                  </div>
                  <p className="staff-load-line">
                    {carerWeekLoad(c.id, weekStart)} of {c.maxVisitsPerDay} visits this week
                  </p>
                </article>
              ))}
            </div>
          )}

          {tab === 'clients' && (
            <div className="clients-admin-panel">
              <p className="hint">Multi-select clients to highlight on the schedule tab.</p>
              <div className="client-admin-grid">
                {CARE_CLIENTS.map((cl) => (
                  <button
                    key={cl.id}
                    type="button"
                    className={`client-admin-card${highlightClients.includes(cl.id) ? ' on' : ''}`}
                    onClick={() => toggleClientHighlight(cl.id)}
                  >
                    <strong>{cl.name}</strong>
                    <span>{cl.suburb}</span>
                    <small>{cl.planNote}</small>
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  const id = highlightClients[0] ?? CARE_CLIENTS[0].id
                  const suggested = suggestCarerForClient(id, weekStart)
                  setCoverageMsg(
                    suggested
                      ? `Demo: ${carerById(suggested)?.name} suggested for ${clientById(id)?.name}.`
                      : 'No carer available this week (demo).',
                  )
                }}
              >
                Suggest carer for selected (demo)
              </button>
              {coverageMsg ? <p className="sync-chip">{coverageMsg}</p> : null}
            </div>
          )}

          {tab === 'coverage' && (
            <div className="coverage-admin-panel">
              <div className={`coverage-hero${gaps > 0 ? ' has-gaps' : ' all-clear'}`}>
                <p className="coverage-hero__label">Uncovered this week</p>
                <strong>{gaps}</strong>
                <p>{gaps > 0 ? 'Use auto-fill to assign relief carers (demo).' : 'All slots covered.'}</p>
              </div>
              <button
                type="button"
                className="btn primary"
                onClick={() => {
                  const n = autoFillCoverageGaps(weekStart)
                  setCoverageMsg(n ? `Filled ${n} gap${n === 1 ? '' : 's'} with relief carers (demo).` : 'No gaps to fill.')
                  refresh()
                }}
              >
                Auto-fill coverage gaps (demo)
              </button>
              {coverageMsg ? <p className="sync-chip">{coverageMsg}</p> : null}
              <ul className="coverage-gap-list">
                {rounds
                  .filter((r) => !r.covered)
                  .map((r) => {
                    const cl = clientById(r.clientId)
                    return (
                      <li key={r.id}>
                        {cl?.name} · {r.time}
                        {r.reliefCarerId ? ` · relief: ${carerById(r.reliefCarerId)?.name}` : ''}
                      </li>
                    )
                  })}
              </ul>
            </div>
          )}
        </AdminTabShell>
      </div>
    </div>
  )
}

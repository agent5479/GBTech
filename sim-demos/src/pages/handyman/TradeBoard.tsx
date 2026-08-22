import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { buildYachtCalendar } from '../../shared/calendarMock'
import { GB_PLACES } from '../../shared/gbPlaces'
import {
  HANDYMAN_JOBS,
  HANDYMAN_QUICK_ADDS,
  estimateHandymanJobs,
  formatHandymanBracket,
  jobById,
} from '../../shared/handymanJobs'
import { DemoCardImage } from '../../components/DemoHeroImage'
import { DemoModeBar } from '../../components/DemoModeBar'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import { ShowcaseChrome } from '../../components/ShowcaseShell'

const PIPELINE_STAGES = [
  { id: 'new', label: 'New' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'onsite', label: 'On site' },
  { id: 'done', label: 'Done' },
] as const

type PipelineStage = (typeof PIPELINE_STAGES)[number]['id']

/**
 * Trade Board — single-screen multi-select (not a wizard).
 * Job chips + day/time rail + estimate column.
 */
export default function TradeBoard() {
  const days = useMemo(() => buildYachtCalendar(8), [])
  const [selected, setSelected] = useState<string[]>(['gutters', 'carpentry'])
  const [date, setDate] = useState<string>()
  const [time, setTime] = useState<string>()
  const [placeId, setPlaceId] = useState('takaka')
  const [jobStages, setJobStages] = useState<Record<string, PipelineStage>>({})
  const [done, setDone] = useState(false)

  const setJobStage = (jobId: string, stage: PipelineStage) => {
    setJobStages((prev) => ({ ...prev, [jobId]: stage }))
  }

  const estimate = useMemo(() => estimateHandymanJobs(selected), [selected])
  const selectedDay = days.find((d) => d.date === date)
  const canConfirm = Boolean(estimate && date && time)

  const toggleJob = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  if (done && estimate) {
    return (
      <div className="tradeboard-page theme-tradeboard">
        <div className="adventure-launch-ok demo-enter-success">
          <p className="demo-badge">Simulated · not a real booking</p>
          <h1>Board ticket locked</h1>
          <p>{selected.map((id) => jobById(id)?.name).join(' · ')}</p>
          <p>
            {date} @ {time}
          </p>
          <p className="estimate-bracket">{formatHandymanBracket(estimate)}</p>
          <DemoQuoteCta styleName="Trade Board" />
          <button type="button" className="btn ghost" onClick={() => setDone(false)}>
            Plan another job
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
        <DemoPitchBar
          packageTier="advanced"
          compareTo="/handyman/bayfix"
          compareLabel="Repair ticket"
          engineNote="Two jobs, not two skins — site job board vs repair ticket."
        />
      </div>
    )
  }

  return (
    <div className="tradeboard-page theme-tradeboard">
      <ShowcaseChrome>
        <header className="tradeboard-top">
          <Link to="/" className="demo-back">
            ← All demos
          </Link>
          <div>
            <p className="demo-badge">Trade Board · multi-select jobs</p>
            <h1>Site job board</h1>
            <p className="demo-sub">Pin trades on one board — same pricing as a repair ticket.</p>
          </div>
          <span className="demo-theme-tag">Different UI · not a wizard</span>
        </header>
        <div className="demo-hero-photo">
          <DemoCardImage id="tradeboard" className="demo-hero-photo__img" />
        </div>
      </ShowcaseChrome>
      <DemoPitchBar
        packageTier="advanced"
        compareTo="/handyman/bayfix"
        compareLabel="Repair ticket"
        engineNote="Two jobs, not two skins — site job board vs repair ticket."
      />
      <DemoModeBar
        clientTo="/handyman/bayfix"
        clientLabel="Client view"
        opsTo="/handyman/tradeboard"
        opsLabel="Admin view"
      />

      <div className="tradeboard-deck demo-enter">
        <aside className="tradeboard-jobs">
          <h2>Job types</h2>
          <p className="hint">Tap a trade to pin it, or use the chips.</p>
          <div className="add-kind-row">
            {HANDYMAN_QUICK_ADDS.map((q) => (
              <button
                key={q.id}
                type="button"
                className="chip"
                onClick={() =>
                  setSelected((prev) => (prev.includes(q.id) ? prev : [...prev, q.id]))
                }
              >
                {q.label}
              </button>
            ))}
          </div>
          <div className="job-chip-stack">
            {HANDYMAN_JOBS.map((j) => {
              const on = selected.includes(j.id)
              return (
                <button
                  key={j.id}
                  type="button"
                  className={`job-chip${on ? ' on' : ''}`}
                  aria-pressed={on}
                  onClick={() => toggleJob(j.id)}
                >
                  <strong>{j.name}</strong>
                  <span>from ${j.basePrice}</span>
                </button>
              )
            })}
          </div>

          {selected.length > 0 && (
            <section className="job-pipeline-block">
              <h2>Job pipeline</h2>
              <p className="hint">Tap a job card to advance it — New → Scheduled → On site → Done.</p>
              <div className="job-kanban">
                {PIPELINE_STAGES.map((s) => {
                  const cards = selected.filter((id) => (jobStages[id] ?? 'new') === s.id)
                  return (
                    <div key={s.id} className="job-kanban-col" data-stage={s.id}>
                      <h3>
                        {s.label}
                        <span>{cards.length}</span>
                      </h3>
                      {cards.length ? (
                        cards.map((id) => {
                          const job = jobById(id)
                          if (!job) return null
                          const idx = PIPELINE_STAGES.findIndex((x) => x.id === s.id)
                          const next = PIPELINE_STAGES[Math.min(idx + 1, PIPELINE_STAGES.length - 1)]
                          return (
                            <button
                              key={id}
                              type="button"
                              className="job-kanban-card"
                              onClick={() => setJobStage(id, next.id)}
                              title={
                                s.id === 'done'
                                  ? 'Already complete — tap to keep on Done'
                                  : `Advance to ${next.label}`
                              }
                            >
                              <strong>{job.name}</strong>
                              <small>{s.id === 'done' ? 'Complete' : `Tap → ${next.label}`}</small>
                            </button>
                          )
                        })
                      ) : (
                        <p className="job-kanban-empty">Empty</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </aside>

        <aside className="tradeboard-side">
          <section>
            <h2>When</h2>
            <div className="day-rail" role="listbox" aria-label="Available days">
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
          </section>

          <section>
            <h2>Site</h2>
            <label className="field">
              Area
              <select value={placeId} onChange={(e) => setPlaceId(e.target.value)}>
                {GB_PLACES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <div className="tradeboard-estimate">
            {estimate ? (
              <>
                <span>Est. cost</span>
                <strong>{formatHandymanBracket(estimate)}</strong>
                <small>
                  {selected.length} job{selected.length === 1 ? '' : 's'} · travel ${estimate.travelFee}
                  {estimate.multiJobDiscount > 0 ? ` · −$${estimate.multiJobDiscount.toFixed(2)} multi` : ''}
                </small>
              </>
            ) : (
              <p className="hint">Pin at least one job type.</p>
            )}
          </div>

          <button type="button" className="btn primary launch-btn" disabled={!canConfirm} onClick={() => setDone(true)}>
            Lock board ticket (demo)
          </button>
        </aside>
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoChrome } from '../../components/DemoChrome'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import { buildYachtCalendar } from '../../shared/calendarMock'
import {
  HIVE_TASKS,
  HIVE_YARDS,
  LIVE_BEEMARSHALL_URL,
  taskById,
  yardById,
} from '../../shared/beekeeping'

/** Hive Run — field staff yard/cluster work (no public client). */
export default function HiveRun() {
  const days = useMemo(() => buildYachtCalendar(8), [])
  const [step, setStep] = useState(1)
  const [yardId, setYardId] = useState('collingwood')
  const [tasks, setTasks] = useState<string[]>(['inspect'])
  const [date, setDate] = useState<string>()
  const [time, setTime] = useState<string>()
  const [notes, setNotes] = useState('')
  const [done, setDone] = useState(false)

  const yard = yardById(yardId)
  const selectedDay = days.find((d) => d.date === date)
  const canWhen = Boolean(date && time)
  const canConfirm = Boolean(yard && tasks.length && canWhen)

  const toggleTask = (id: string) => {
    setTasks((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  if (done && yard) {
    return (
      <div className="beekeeping-page theme-hiverun">
        <DemoChrome
          theme="Hive Run"
          title="Field run logged"
          subtitle="Simulated hive work — nothing wrote to a live calendar."
          imageId="hiverun"
        />
        <div className="yacht-panel success-panel demo-enter-success">
          <h2>Run queued (demo)</h2>
          <p>
            {yard.name} · {yard.hiveCount} hives · {yard.gpsLabel}
          </p>
          <p>{tasks.map((id) => taskById(id)?.name).join(' · ')}</p>
          <p>
            {date} @ {time}
          </p>
          <p className="hint">
            Live staff app:{' '}
            <a href={LIVE_BEEMARSHALL_URL} target="_blank" rel="noopener noreferrer">
              BeeMarshall on GitHub Pages
            </a>
          </p>
          <DemoQuoteCta styleName="Hive Run" />
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              setDone(false)
              setStep(1)
            }}
          >
            Plan another run
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
        <DemoPitchBar
          packageTier="advanced"
          compareTo="/beekeeping/apiary"
          compareLabel="Apiary Board"
          engineNote="Field hive-cluster actions vs management staff schedules — no public client booking."
        />
      </div>
    )
  }

  return (
    <div className="beekeeping-page theme-hiverun">
      <DemoChrome
        theme="Hive Run"
        title="Hive cluster run"
        subtitle="Field staff — pick a yard, tick seasonal tasks, navigate by GPS label. No external clients."
        imageId="hiverun"
        badge="Simulated · field staff"
      />
      <DemoPitchBar
        packageTier="advanced"
        compareTo="/beekeeping/apiary"
        compareLabel="Apiary Board"
        engineNote="Field hive-cluster actions vs management staff schedules — no public client booking."
      />

      <ol className="wizard-steps" aria-label="Run steps">
        {[1, 2, 3, 4].map((n) => (
          <li key={n} className={step === n ? 'active' : step > n ? 'done' : ''}>
            {n}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <section className="yacht-panel demo-enter">
          <h2>1. Yard / cluster</h2>
          <label className="field">
            Site
            <select value={yardId} onChange={(e) => setYardId(e.target.value)}>
              {HIVE_YARDS.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.name} · {y.hiveCount} hives
                </option>
              ))}
            </select>
          </label>
          {yard && (
            <div className="gps-chip-row" aria-label="Cluster location">
              <span className="gps-chip">{yard.gpsLabel}</span>
              <span className="hint">{yard.accessNote}</span>
            </div>
          )}
          <div className="btn-row">
            <button type="button" className="btn primary" onClick={() => setStep(2)}>
              Next: Tasks
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="yacht-panel demo-enter">
          <h2>2. Seasonal tasks</h2>
          <div className="job-check-list">
            {HIVE_TASKS.map((t) => {
              const on = tasks.includes(t.id)
              return (
                <label key={t.id} className={`job-check${on ? ' on' : ''}`}>
                  <input type="checkbox" checked={on} onChange={() => toggleTask(t.id)} />
                  <span>
                    <strong>{t.name}</strong>
                    <small>
                      {t.blurb} · {t.seasonHint}
                    </small>
                  </span>
                </label>
              )
            })}
          </div>
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(1)}>
              Back
            </button>
            <button
              type="button"
              className="btn primary"
              disabled={!tasks.length}
              onClick={() => setStep(3)}
            >
              Next: When
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="yacht-panel demo-enter">
          <h2>3. When</h2>
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
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(2)}>
              Back
            </button>
            <button type="button" className="btn primary" disabled={!canWhen} onClick={() => setStep(4)}>
              Next: Notes
            </button>
          </div>
        </section>
      )}

      {step === 4 && yard && (
        <section className="yacht-panel demo-enter">
          <h2>4. Site notes &amp; review</h2>
          <label className="field">
            Field notes
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Queen cells, wet track, neighbour dogs…"
            />
          </label>
          <div className="summary">
            <p>
              <strong>Yard:</strong> {yard.name} ({yard.gpsLabel})
            </p>
            <p>
              <strong>Tasks:</strong> {tasks.map((id) => taskById(id)?.name).join(', ')}
            </p>
            <p>
              <strong>When:</strong> {date} @ {time}
            </p>
          </div>
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(3)}>
              Back
            </button>
            <button type="button" className="btn primary" disabled={!canConfirm} onClick={() => setDone(true)}>
              Log run (demo)
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

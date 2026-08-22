import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoChrome } from '../../components/DemoChrome'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import { buildYachtCalendar } from '../../shared/calendarMock'
import {
  CARE_CLIENTS,
  CARE_TASKS,
  CARERS,
  careTaskById,
  clientById,
  visitMinutes,
} from '../../shared/homecare'

/** Care Visit — field carer / staff visit workflow. */
export default function CareVisit() {
  const days = useMemo(() => buildYachtCalendar(8), [])
  const [step, setStep] = useState(1)
  const [clientId, setClientId] = useState('eleanor')
  const [tasks, setTasks] = useState<string[]>(['meds', 'mobility'])
  const [carerId, setCarerId] = useState('ana')
  const [date, setDate] = useState<string>()
  const [time, setTime] = useState<string>()
  const [notes, setNotes] = useState('')
  const [done, setDone] = useState(false)

  const client = clientById(clientId)
  const selectedDay = days.find((d) => d.date === date)
  const minutes = visitMinutes(tasks)
  const canWhen = Boolean(date && time)
  const canConfirm = Boolean(client && tasks.length && canWhen)

  const toggleTask = (id: string) => {
    setTasks((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  if (done && client) {
    return (
      <div className="homecare-page theme-carevisit">
        <DemoChrome
          theme="Care Visit"
          title="Visit logged"
          subtitle="Simulated care visit — no live dispatch."
          imageId="carevisit"
        />
        <div className="yacht-panel success-panel demo-enter-success">
          <h2>Visit queued (demo)</h2>
          <p>
            {client.name} · {client.suburb}
          </p>
          <p>{tasks.map((id) => careTaskById(id)?.name).join(' · ')}</p>
          <p>
            {date} @ {time} · ~{minutes} min · {CARERS.find((c) => c.id === carerId)?.name}
          </p>
          <DemoQuoteCta styleName="Care Visit" />
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              setDone(false)
              setStep(1)
            }}
          >
            Log another visit
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
        <DemoPitchBar
          packageTier="advanced"
          compareTo="/homecare/rounds"
          compareLabel="Round Board"
          engineNote="Field carer visit vs management rounds — staff + coordination, not public booking."
        />
      </div>
    )
  }

  return (
    <div className="homecare-page theme-carevisit">
      <DemoChrome
        theme="Care Visit"
        title="Care visit"
        subtitle="Field carer workflow — household, task ticks, slot, hand-off note. Fictional clients."
        imageId="carevisit"
        badge="Simulated · field staff"
      />
      <DemoPitchBar
        packageTier="advanced"
        compareTo="/homecare/rounds"
        compareLabel="Round Board"
        engineNote="Field carer visit vs management rounds — staff + coordination, not public booking."
      />

      <ol className="wizard-steps" aria-label="Visit steps">
        {[1, 2, 3, 4].map((n) => (
          <li key={n} className={step === n ? 'active' : step > n ? 'done' : ''}>
            {n}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <section className="yacht-panel demo-enter">
          <h2>1. Household</h2>
          <label className="field">
            Client
            <select value={clientId} onChange={(e) => setClientId(e.target.value)}>
              {CARE_CLIENTS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.suburb}
                </option>
              ))}
            </select>
          </label>
          {client && <p className="hint">{client.planNote}</p>}
          <label className="field">
            Carer on this visit
            <select value={carerId} onChange={(e) => setCarerId(e.target.value)}>
              {CARERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <div className="btn-row">
            <button type="button" className="btn primary" onClick={() => setStep(2)}>
              Next: Tasks
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="yacht-panel demo-enter">
          <h2>2. Care tasks</h2>
          <div className="job-check-list">
            {CARE_TASKS.map((t) => {
              const on = tasks.includes(t.id)
              return (
                <label key={t.id} className={`job-check${on ? ' on' : ''}`}>
                  <input type="checkbox" checked={on} onChange={() => toggleTask(t.id)} />
                  <span>
                    <strong>{t.name}</strong>
                    <small>
                      {t.blurb} · ~{t.minutes} min
                    </small>
                  </span>
                </label>
              )
            })}
          </div>
          <p className="live-estimate">
            Visit length <strong>~{minutes} min</strong>
          </p>
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
          <h2>3. Visit slot</h2>
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
              Next: Hand-off
            </button>
          </div>
        </section>
      )}

      {step === 4 && client && (
        <section className="yacht-panel demo-enter">
          <h2>4. Hand-off &amp; review</h2>
          <label className="field">
            Notes for next carer / family
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Appetite, mood, meds taken…"
            />
          </label>
          <div className="summary">
            <p>
              <strong>Client:</strong> {client.name} ({client.suburb})
            </p>
            <p>
              <strong>Tasks:</strong> {tasks.map((id) => careTaskById(id)?.name).join(', ')}
            </p>
            <p>
              <strong>When:</strong> {date} @ {time} · ~{minutes} min
            </p>
            <p>
              <strong>Carer:</strong> {CARERS.find((c) => c.id === carerId)?.name}
            </p>
          </div>
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(3)}>
              Back
            </button>
            <button type="button" className="btn primary" disabled={!canConfirm} onClick={() => setDone(true)}>
              Complete visit (demo)
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

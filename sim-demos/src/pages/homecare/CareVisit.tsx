import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoChrome } from '../../components/DemoChrome'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import { MarkersMap } from '../../components/MarkersMap'
import { PhoneShell } from '../../components/PhoneShell'
import {
  CARE_CLIENTS,
  CARE_MAP_CENTER,
  CARERS,
  DEMO_FIELD_CARER_ID,
  careTaskById,
  carerById,
  clientById,
  getCarerRoundsToday,
  getRoundsForWeek,
  tasksByGroup,
  visitMinutes,
} from '../../shared/homecare'
import { currentWeekStart } from '../../shared/schedulingMock'

const CLOSEOUT_ITEMS = [
  { id: 'keys', label: 'Keys / alarm secured' },
  { id: 'meds', label: 'Meds chart updated' },
  { id: 'family', label: 'Family notified if needed' },
] as const

/** Care Visit — field visit log on a phone (client card, grouped checks, meds due). */
export default function CareVisit() {
  const [clientId, setClientId] = useState('eleanor')
  const [tasks, setTasks] = useState<string[]>(['meds', 'mobility'])
  const [medsDone, setMedsDone] = useState<string[]>([])
  const [carerId, setCarerId] = useState('ana')
  const [notes, setNotes] = useState('')
  const [done, setDone] = useState(false)
  const [concernFlag, setConcernFlag] = useState(false)
  const [concernNote, setConcernNote] = useState('')
  const [closeout, setCloseout] = useState<string[]>([])
  const [phoneTab, setPhoneTab] = useState<'visit' | 'plan' | 'today'>('visit')

  const weekStart = currentWeekStart()
  const myToday = getCarerRoundsToday(DEMO_FIELD_CARER_ID, weekStart)
  const assignedSlot = getRoundsForWeek(weekStart).find((r) => r.clientId === clientId)

  const toggleCloseout = (id: string) => {
    setCloseout((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const client = clientById(clientId)
  const grouped = tasksByGroup()
  const minutes = visitMinutes(tasks)
  const handoffReady = notes.trim().length > 0
  const canComplete = tasks.length > 0 && handoffReady
  const points = CARE_CLIENTS.map((c) => ({
    id: c.id,
    lat: c.lat,
    lng: c.lng,
    label: c.name,
    selected: c.id === clientId,
  }))

  const toggleTask = (id: string) => {
    setTasks((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }
  const toggleMed = (label: string) => {
    setMedsDone((prev) => (prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]))
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
            ~{minutes} min · {CARERS.find((c) => c.id === carerId)?.name}
          </p>
          {notes.trim() ? <p className="hint">Family: {notes.trim()}</p> : null}
          {concernFlag ? <p className="hint">Concern flagged: {concernNote.trim() || 'No detail'}</p> : null}
          <DemoQuoteCta styleName="Care Visit" pitchKind="customOps" />
          <button type="button" className="btn ghost" onClick={() => setDone(false)}>
            Log another visit
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
        <DemoPitchBar
          pitchKind="customOps"
          compareTo="/homecare/rounds"
          compareLabel="Round Board"
          engineNote="Field visit log vs management day roster — staff + coordination."
        />
      </div>
    )
  }

  return (
    <div className="homecare-page theme-carevisit">
      <DemoChrome
        theme="Care Visit"
        title="Log a visit"
        subtitle="Field carer — household on the map, plan ticks, meds due. Not a public booking flow."
        imageId="carevisit"
        badge="Simulated · field log"
      />
      <DemoPitchBar
        pitchKind="customOps"
        compareTo="/homecare/rounds"
        compareLabel="Round Board"
        engineNote="Field visit log vs management day roster — staff + coordination."
      />

      <div className="ops-field-flow">
      <div className="hive-field-layout">
        <div className="hive-map-card hive-map-card--field">
          <MarkersMap
            points={points}
            center={CARE_MAP_CENTER}
            zoom={10}
            pathColor="#3d7ea6"
            label="Households · tap to switch client"
            onSelect={setClientId}
          />
        </div>

        <PhoneShell brand="Care Visit">
          <div className="field-phone-tabs" role="tablist">
            {(['visit', 'plan', 'today'] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                className={phoneTab === t ? 'on' : ''}
                onClick={() => setPhoneTab(t)}
              >
                {t === 'visit' ? 'Visit' : t === 'plan' ? 'Plan' : 'Today'}
              </button>
            ))}
          </div>
          {assignedSlot && phoneTab === 'visit' ? (
            <p className="assigned-banner">
              Assigned: {carerById(assignedSlot.carerId)?.name} · {assignedSlot.time}
              {assignedSlot.reliefCarerId ? ` · relief ${carerById(assignedSlot.reliefCarerId)?.name}` : ''}
            </p>
          ) : null}

          {phoneTab === 'plan' && client && (
            <div className="hive-phone care-phone">
              <aside className="care-plan-sticky care-plan-full">
                <p className="care-plan-kicker">Care plan</p>
                <strong>{client.name}</strong>
                <p>{client.planNote}</p>
                {client.medsDue.length ? (
                  <>
                    <h4>Meds schedule</h4>
                    <ul>
                      {client.medsDue.map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </aside>
            </div>
          )}

          {phoneTab === 'today' && (
            <div className="hive-phone care-phone">
              <p className="phone-kicker">My round today</p>
              <ul className="roster-day-list">
                {myToday.map((r) => {
                  const cl = clientById(r.clientId)
                  return (
                    <li key={r.id}>
                      <strong>
                        {r.time} · {cl?.name}
                      </strong>
                      <span>{cl?.suburb}</span>
                      <small>{r.covered ? 'Covered' : 'Uncovered'}</small>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {phoneTab === 'visit' && (
          <div className="hive-phone care-phone">
            {client && (
              <aside className="care-plan-sticky">
                <p className="care-plan-kicker">Care plan</p>
                <strong>{client.name}</strong>
                <p>{client.planNote}</p>
              </aside>
            )}
            <p className="phone-kicker">This household</p>
            <div className="client-pick">
              {CARE_CLIENTS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`client-card${clientId === c.id ? ' on' : ''}`}
                  onClick={() => setClientId(c.id)}
                >
                  <strong>{c.name}</strong>
                  <span>
                    {c.suburb} · {c.planNote}
                  </span>
                </button>
              ))}
            </div>

            <label className="field">
              Carer
              <select value={carerId} onChange={(e) => setCarerId(e.target.value)}>
                {CARERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            {client && client.medsDue.length > 0 && (
              <section className="task-cat">
                <h3>Due this visit</h3>
                {client.medsDue.map((m) => (
                  <label key={m} className={`hive-check${medsDone.includes(m) ? ' on' : ''}`}>
                    <input type="checkbox" checked={medsDone.includes(m)} onChange={() => toggleMed(m)} />
                    {m}
                  </label>
                ))}
              </section>
            )}

            {Object.entries(grouped).map(([group, list]) => (
              <section key={group} className="task-cat">
                <h3>{group}</h3>
                {list.map((t) => {
                  const on = tasks.includes(t.id)
                  return (
                    <label key={t.id} className={`hive-check${on ? ' on' : ''}`}>
                      <input type="checkbox" checked={on} onChange={() => toggleTask(t.id)} />
                      {t.name}
                      <small> ~{t.minutes}m</small>
                    </label>
                  )
                })}
              </section>
            ))}

            <p className="live-estimate">
              Visit length <strong>~{minutes} min</strong>
            </p>

            <label className={`hive-check concern-flag${concernFlag ? ' on' : ''}`}>
              <input
                type="checkbox"
                checked={concernFlag}
                onChange={(e) => setConcernFlag(e.target.checked)}
              />
              Flag concern / incident
            </label>
            {concernFlag && (
              <label className="field">
                Concern note
                <textarea
                  rows={2}
                  value={concernNote}
                  onChange={(e) => setConcernNote(e.target.value)}
                  placeholder="Fall risk, mood change, missed meds…"
                />
              </label>
            )}

            <section className="checklist-panel">
              <h4>Close-out (optional)</h4>
              {CLOSEOUT_ITEMS.map((c) => (
                <label key={c.id} className={`hive-check${closeout.includes(c.id) ? ' on' : ''}`}>
                  <input
                    type="checkbox"
                    checked={closeout.includes(c.id)}
                    onChange={() => toggleCloseout(c.id)}
                  />
                  {c.label}
                </label>
              ))}
            </section>

            <label className="field">
              Family hand-off
              <textarea
                rows={2}
                required
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Appetite, mood, meds taken… (required)"
              />
            </label>
            {!handoffReady && tasks.length > 0 && (
              <p className="handoff-need">Add a family note before you complete.</p>
            )}
            <button
              type="button"
              className="btn primary"
              disabled={!canComplete}
              onClick={() => setDone(true)}
            >
              Complete visit
            </button>
          </div>
          )}
        </PhoneShell>
      </div>
      </div>
    </div>
  )
}

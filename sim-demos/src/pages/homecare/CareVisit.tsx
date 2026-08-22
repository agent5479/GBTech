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
  careTaskById,
  clientById,
  tasksByGroup,
  visitMinutes,
} from '../../shared/homecare'

/** Care Visit — field visit log on a phone (client card, grouped checks, meds due). */
export default function CareVisit() {
  const [clientId, setClientId] = useState('eleanor')
  const [tasks, setTasks] = useState<string[]>(['meds', 'mobility'])
  const [medsDone, setMedsDone] = useState<string[]>([])
  const [carerId, setCarerId] = useState('ana')
  const [notes, setNotes] = useState('')
  const [done, setDone] = useState(false)

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

      <div className="hive-field-layout">
        <div className="hive-map-card">
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
        </PhoneShell>
      </div>
    </div>
  )
}

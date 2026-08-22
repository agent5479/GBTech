import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoChrome } from '../../components/DemoChrome'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import { MarkersMap } from '../../components/MarkersMap'
import { PhoneShell } from '../../components/PhoneShell'
import {
  HIVE_MAP_CENTER,
  HIVE_YARDS,
  LIVE_BEEMARSHALL_URL,
  taskById,
  tasksByCategory,
  yardById,
  type HiveFlag,
} from '../../shared/beekeeping'

/** Hive Run — field log action (cluster on map, categorised tasks). Not a booking wizard. */
export default function HiveRun() {
  const [yardId, setYardId] = useState('collingwood')
  const [filter, setFilter] = useState<'common' | 'all'>('common')
  const [tasks, setTasks] = useState<string[]>(['inspect', 'queen'])
  const [flag, setFlag] = useState<HiveFlag>('ok')
  const [notes, setNotes] = useState('')
  const [done, setDone] = useState(false)

  const yard = yardById(yardId)
  const grouped = useMemo(() => tasksByCategory(filter), [filter])
  const points = HIVE_YARDS.map((y) => ({
    id: y.id,
    lat: y.lat,
    lng: y.lng,
    label: `${y.name} · ${y.hiveCount}`,
    selected: y.id === yardId,
  }))

  const toggleTask = (id: string) => {
    setTasks((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  if (done && yard) {
    return (
      <div className="beekeeping-page theme-hiverun">
        <DemoChrome
          theme="Hive Run"
          title="Action logged"
          subtitle="Simulated field log — nothing wrote to a live calendar."
          imageId="hiverun"
        />
        <div className="yacht-panel success-panel demo-enter-success">
          <h2>Logged at {yard.name}</h2>
          <p>
            {yard.hiveCount} hives · {yard.gpsLabel} · flag {flag}
          </p>
          <p>{tasks.map((id) => taskById(id)?.name).join(' · ')}</p>
          <p className="hint">
            Live staff app:{' '}
            <a href={LIVE_BEEMARSHALL_URL} target="_blank" rel="noopener noreferrer">
              BeeMarshall
            </a>
          </p>
          <DemoQuoteCta styleName="Hive Run" />
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              setDone(false)
              setTasks(['inspect'])
            }}
          >
            Log another action
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
        <DemoPitchBar
          packageTier="advanced"
          compareTo="/beekeeping/apiary"
          compareLabel="Apiary Board"
          engineNote="Field log-action vs management dashboard — no public client booking."
        />
      </div>
    )
  }

  return (
    <div className="beekeeping-page theme-hiverun">
      <DemoChrome
        theme="Hive Run"
        title="Log a yard action"
        subtitle="Field staff — pick a cluster on the map, tick what you did. Common vs all tasks."
        imageId="hiverun"
        badge="Simulated · field log"
      />
      <DemoPitchBar
        packageTier="advanced"
        compareTo="/beekeeping/apiary"
        compareLabel="Apiary Board"
        engineNote="Field log-action vs management dashboard — no public client booking."
      />

      <div className="hive-field-layout">
        <div className="hive-map-card">
          <MarkersMap
            points={points}
            center={HIVE_MAP_CENTER}
            zoom={10}
            pathColor="#DAA520"
            label="Tap a cluster · GPS yards (demo)"
            onSelect={setYardId}
          />
        </div>

        <PhoneShell brand="Hive Run">
          <div className="hive-phone">
            <p className="phone-kicker">At this cluster</p>
            <div className="cluster-pick">
              {HIVE_YARDS.map((y) => (
                <button
                  key={y.id}
                  type="button"
                  className={`cluster-chip${yardId === y.id ? ' on' : ''}${y.flag !== 'ok' ? ` flag-${y.flag}` : ''}`}
                  onClick={() => setYardId(y.id)}
                >
                  <strong>{y.name}</strong>
                  <span>
                    {y.hiveCount} hives · {y.access}
                  </span>
                </button>
              ))}
            </div>
            {yard && (
              <p className="hive-meta">
                {yard.landowner}
                {yard.contactBefore ? ' · contact before visit' : ''} · {yard.accessNote}
              </p>
            )}

            <div className="task-filter">
              <button
                type="button"
                className={filter === 'common' ? 'on' : ''}
                onClick={() => setFilter('common')}
              >
                Common
              </button>
              <button type="button" className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>
                All tasks
              </button>
            </div>

            {Object.entries(grouped).map(([cat, list]) => (
              <section key={cat} className="task-cat">
                <h3>{cat}</h3>
                {list.map((t) => {
                  const on = tasks.includes(t.id)
                  return (
                    <label key={t.id} className={`hive-check${on ? ' on' : ''}`}>
                      <input type="checkbox" checked={on} onChange={() => toggleTask(t.id)} />
                      {t.name}
                      {t.common && <span className="star">★</span>}
                    </label>
                  )
                })}
              </section>
            ))}

            <label className="field">
              Yard flag
              <select value={flag} onChange={(e) => setFlag(e.target.value as HiveFlag)}>
                <option value="ok">OK</option>
                <option value="watch">Watch</option>
                <option value="quarantine">Quarantine</option>
              </select>
            </label>
            <label className="field">
              Notes
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Queen cells, wet track…"
              />
            </label>
            <button
              type="button"
              className="btn primary"
              disabled={!tasks.length}
              onClick={() => setDone(true)}
            >
              Log actions
            </button>
          </div>
        </PhoneShell>
      </div>
    </div>
  )
}

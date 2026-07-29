import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoImageTiles } from '../../components/DemoHeroImage'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import { buildYachtCalendar } from '../../shared/calendarMock'
import { GB_PLACES } from '../../shared/gbPlaces'
import {
  PAINT_TYPES,
  UNDERCOATS,
  estimatePaintJob,
  formatPaintBracket,
  newWall,
  paintTypeById,
  undercoatById,
  wallAreaM2,
  type PaintSetting,
  type PaintTypeId,
  type UndercoatId,
  type WallSurface,
} from '../../shared/paintingQuote'

/**
 * Paint Board — single-screen wall board (not a wizard).
 * Wall cards + paint/undercoat chips + live ballpark column.
 */
export default function PaintBoard() {
  const days = useMemo(() => buildYachtCalendar(8), [])
  const [walls, setWalls] = useState<WallSurface[]>([
    newWall({ label: 'Weatherboards — street', widthM: 8.0, heightM: 2.7, qty: 1 }),
    newWall({ label: 'Weatherboards — side', widthM: 5.5, heightM: 2.7, qty: 1 }),
  ])
  const [setting, setSetting] = useState<PaintSetting>('outdoor')
  const [paintTypeId, setPaintTypeId] = useState<PaintTypeId>('exterior')
  const [undercoatId, setUndercoatId] = useState<UndercoatId>('acrylic')
  const [date, setDate] = useState<string>()
  const [time, setTime] = useState<string>()
  const [placeId, setPlaceId] = useState('pohara')
  const [done, setDone] = useState(false)

  const estimate = useMemo(
    () => estimatePaintJob(walls, setting, paintTypeId, undercoatId),
    [walls, setting, paintTypeId, undercoatId],
  )
  const selectedDay = days.find((d) => d.date === date)
  const canConfirm = Boolean(estimate && date && time)

  const updateWall = (id: string, patch: Partial<WallSurface>) => {
    setWalls((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)))
  }

  const removeWall = (id: string) => {
    setWalls((prev) => (prev.length <= 1 ? prev : prev.filter((w) => w.id !== id)))
  }

  if (done && estimate) {
    return (
      <div className="paintboard-page theme-paintboard">
        <div className="adventure-launch-ok demo-enter-success">
          <p className="demo-badge">Simulated · not a real booking</p>
          <h1>Board quote locked</h1>
          <p>
            {estimate.totalAreaM2} m² · {setting} · {paintTypeById(paintTypeId)?.name}
          </p>
          <p>
            {date} @ {time}
          </p>
          <p className="estimate-bracket">{formatPaintBracket(estimate)}</p>
          <DemoQuoteCta styleName="Paint Board" />
          <button type="button" className="btn ghost" onClick={() => setDone(false)}>
            Plan another quote
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
        <DemoPitchBar
          packageTier="advanced"
          compareTo="/painting/freshcoat"
          compareLabel="Fresh Coat"
          engineNote="One engine, two interfaces — same m² quote math as Fresh Coat, board skin."
        />
      </div>
    )
  }

  return (
    <div className="paintboard-page theme-paintboard">
      <header className="paintboard-top">
        <Link to="/" className="demo-back">
          ← All demos
        </Link>
        <div>
          <p className="demo-badge">Paint Board · wall measure board</p>
          <h1>Pin the surfaces</h1>
          <p className="demo-sub">Same automatic quote engine as Fresh Coat — live ballpark as you edit.</p>
        </div>
        <span className="demo-theme-tag">Different UI · not a wizard</span>
      </header>
      <DemoImageTiles id="paintboard" />
      <DemoPitchBar
        packageTier="advanced"
        compareTo="/painting/freshcoat"
        compareLabel="Fresh Coat"
        engineNote="One engine, two interfaces — same m² quote math as Fresh Coat, board skin."
      />

      <div className="paintboard-deck demo-enter">
        <aside className="paintboard-walls">
          <h2>Walls</h2>
          <p className="hint">Width × height (m). Tap + to add another face.</p>
          <div className="wall-board-stack">
            {walls.map((w) => (
              <article key={w.id} className="wall-board-card">
                <input
                  className="wall-board-label"
                  value={w.label}
                  onChange={(e) => updateWall(w.id, { label: e.target.value })}
                  aria-label="Wall label"
                />
                <div className="wall-board-dims">
                  <label>
                    W
                    <input
                      type="number"
                      min={0.5}
                      max={20}
                      step={0.1}
                      value={w.widthM}
                      onChange={(e) => updateWall(w.id, { widthM: Number(e.target.value) })}
                    />
                  </label>
                  <span>×</span>
                  <label>
                    H
                    <input
                      type="number"
                      min={0.5}
                      max={6}
                      step={0.1}
                      value={w.heightM}
                      onChange={(e) => updateWall(w.id, { heightM: Number(e.target.value) })}
                    />
                  </label>
                  <label>
                    Qty
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={w.qty}
                      onChange={(e) => updateWall(w.id, { qty: Number(e.target.value) })}
                    />
                  </label>
                </div>
                <div className="wall-board-foot">
                  <strong>{wallAreaM2(w)} m²</strong>
                  <button type="button" disabled={walls.length <= 1} onClick={() => removeWall(w.id)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
          <button
            type="button"
            className="btn ghost"
            onClick={() => setWalls((prev) => [...prev, newWall({ label: `Surface ${prev.length + 1}` })])}
          >
            + Add wall
          </button>
        </aside>

        <aside className="paintboard-side">
          <section>
            <h2>Setting</h2>
            <div className="setting-toggle">
              <button
                type="button"
                className={`chip${setting === 'indoor' ? ' selected' : ''}`}
                onClick={() => setSetting('indoor')}
              >
                Indoor
              </button>
              <button
                type="button"
                className={`chip${setting === 'outdoor' ? ' selected' : ''}`}
                onClick={() => setSetting('outdoor')}
              >
                Outdoor
              </button>
            </div>
          </section>

          <section>
            <h2>Paint</h2>
            <div className="job-chip-stack">
              {PAINT_TYPES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`job-chip${paintTypeId === p.id ? ' on' : ''}`}
                  aria-pressed={paintTypeId === p.id}
                  onClick={() => setPaintTypeId(p.id)}
                >
                  <strong>{p.name}</strong>
                  <span>${p.materialPerM2}/m²</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2>Undercoat</h2>
            <div className="job-chip-stack">
              {UNDERCOATS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  className={`job-chip${undercoatId === u.id ? ' on' : ''}`}
                  aria-pressed={undercoatId === u.id}
                  onClick={() => setUndercoatId(u.id)}
                >
                  <strong>{u.name}</strong>
                  <span>{u.materialPerM2 > 0 ? `$${u.materialPerM2}/m²` : 'skip'}</span>
                </button>
              ))}
            </div>
          </section>

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

          <div className="paintboard-estimate">
            {estimate ? (
              <>
                <span>Ballpark</span>
                <strong>{formatPaintBracket(estimate)}</strong>
                <small>
                  {estimate.totalAreaM2} m² · {undercoatById(undercoatId)?.name}
                  {estimate.outdoorSurcharge > 0 ? ' · outdoor access' : ''}
                </small>
                <small className="paintboard-split">
                  Labour ${estimate.labour.toFixed(0)} · Materials ${estimate.materials.toFixed(0)} · Setup + travel $
                  {(estimate.setupFee + estimate.travelFee).toFixed(0)}
                </small>
              </>
            ) : (
              <p className="hint">Add wall sizes to see a ballpark.</p>
            )}
          </div>

          <button
            type="button"
            className="btn primary launch-btn"
            disabled={!canConfirm}
            onClick={() => setDone(true)}
          >
            Lock board quote (demo)
          </button>
        </aside>
      </div>
    </div>
  )
}

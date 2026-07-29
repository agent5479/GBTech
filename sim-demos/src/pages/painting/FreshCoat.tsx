import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoChrome } from '../../components/DemoChrome'
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
 * Fresh Coat — classic painter quote wizard.
 * Walls (sizes) → paint system → schedule → review ballpark.
 */
export default function FreshCoat() {
  const days = useMemo(() => buildYachtCalendar(8), [])
  const [step, setStep] = useState(1)
  const [walls, setWalls] = useState<WallSurface[]>([
    newWall({ label: 'Lounge — long wall', widthM: 4.2, heightM: 2.4, qty: 1 }),
    newWall({ label: 'Lounge — end walls', widthM: 3.2, heightM: 2.4, qty: 2 }),
  ])
  const [setting, setSetting] = useState<PaintSetting>('indoor')
  const [paintTypeId, setPaintTypeId] = useState<PaintTypeId>('standard')
  const [undercoatId, setUndercoatId] = useState<UndercoatId>('acrylic')
  const [date, setDate] = useState<string>()
  const [time, setTime] = useState<string>()
  const [placeId, setPlaceId] = useState(GB_PLACES[0].id)
  const [notes, setNotes] = useState('')
  const [done, setDone] = useState(false)

  const estimate = useMemo(
    () => estimatePaintJob(walls, setting, paintTypeId, undercoatId),
    [walls, setting, paintTypeId, undercoatId],
  )
  const selectedDay = days.find((d) => d.date === date)
  const canWhen = Boolean(date && time)
  const canConfirm = Boolean(estimate && canWhen)

  const updateWall = (id: string, patch: Partial<WallSurface>) => {
    setWalls((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)))
  }

  const removeWall = (id: string) => {
    setWalls((prev) => (prev.length <= 1 ? prev : prev.filter((w) => w.id !== id)))
  }

  if (done && estimate) {
    return (
      <div className="painting-page theme-freshcoat">
        <DemoChrome
          theme="Fresh Coat"
          title="Demo paint quote locked"
          subtitle="Nothing was booked — simulation only."
          imageId="freshcoat"
        />
        <div className="yacht-panel success-panel demo-enter-success">
          <h2>Ballpark quote saved (demo)</h2>
          <p>
            {estimate.totalAreaM2} m² · {setting} · {paintTypeById(paintTypeId)?.name}
            {undercoatId !== 'none' ? ` · ${undercoatById(undercoatId)?.name}` : ''}
          </p>
          <p>
            {date} @ {time} · {GB_PLACES.find((p) => p.id === placeId)?.name}
          </p>
          <p className="estimate-bracket">{formatPaintBracket(estimate)}</p>
          <DemoQuoteCta styleName="Fresh Coat" />
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              setDone(false)
              setStep(1)
            }}
          >
            Quote another job (demo)
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
        <DemoPitchBar
          packageTier="essential"
          compareTo="/painting/paintboard"
          compareLabel="Paint Board"
          engineNote="Same wall m² quote engine — wizard vs wall-board UI."
        />
      </div>
    )
  }

  return (
    <div className="painting-page theme-freshcoat">
      <DemoChrome
        theme="Fresh Coat"
        title="Fresh Coat"
        subtitle="Golden Bay painter quote — measure walls, choose paint & undercoat, get a ballpark figure."
        imageId="freshcoat"
      />
      <DemoPitchBar
        packageTier="essential"
        compareTo="/painting/paintboard"
        compareLabel="Paint Board"
        engineNote="Same wall m² quote engine — wizard vs wall-board UI."
      />

      <ol className="wizard-steps" aria-label="Quote steps">
        {[1, 2, 3, 4].map((n) => (
          <li key={n} className={step === n ? 'active' : step > n ? 'done' : ''}>
            {n}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <section key="step-1" className="yacht-panel demo-enter">
          <h2>1. Wall sizes</h2>
          <p className="hint">Enter width × height in metres. Use quantity for matching faces.</p>
          <div className="wall-editor-list">
            {walls.map((w) => (
              <div key={w.id} className="wall-editor-card">
                <label className="field">
                  Label
                  <input
                    value={w.label}
                    onChange={(e) => updateWall(w.id, { label: e.target.value })}
                    placeholder="e.g. Hall north"
                  />
                </label>
                <div className="wall-dims">
                  <label className="field">
                    Width (m)
                    <input
                      type="number"
                      min={0.5}
                      max={20}
                      step={0.1}
                      value={w.widthM}
                      onChange={(e) => updateWall(w.id, { widthM: Number(e.target.value) })}
                    />
                  </label>
                  <label className="field">
                    Height (m)
                    <input
                      type="number"
                      min={0.5}
                      max={6}
                      step={0.1}
                      value={w.heightM}
                      onChange={(e) => updateWall(w.id, { heightM: Number(e.target.value) })}
                    />
                  </label>
                  <label className="field">
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
                <div className="wall-editor-meta">
                  <span>{wallAreaM2(w)} m²</span>
                  <button type="button" className="btn ghost" disabled={walls.length <= 1} onClick={() => removeWall(w.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn ghost"
            onClick={() => setWalls((prev) => [...prev, newWall({ label: `Wall ${prev.length + 1}` })])}
          >
            + Add wall
          </button>
          {estimate && (
            <p className="live-estimate">
              Running area <strong>{estimate.totalAreaM2} m²</strong>
            </p>
          )}
          <div className="btn-row">
            <button type="button" className="btn primary" disabled={!estimate} onClick={() => setStep(2)}>
              Next: Paint system
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section key="step-2" className="yacht-panel demo-enter">
          <h2>2. Indoor / outdoor &amp; paint</h2>
          <div className="setting-toggle" role="group" aria-label="Job setting">
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
          <h3 className="subhead">Finish paint</h3>
          <div className="pkg-grid">
            {PAINT_TYPES.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`pkg-card${paintTypeId === p.id ? ' selected' : ''}`}
                onClick={() => setPaintTypeId(p.id)}
              >
                <strong>{p.name}</strong>
                <span className="pkg-price">from ${p.materialPerM2}/m² · {p.finishCoats} coats</span>
                <p>{p.blurb}</p>
              </button>
            ))}
          </div>
          <h3 className="subhead">Undercoat</h3>
          <div className="route-chips">
            {UNDERCOATS.map((u) => (
              <button
                key={u.id}
                type="button"
                className={`chip${undercoatId === u.id ? ' selected' : ''}`}
                onClick={() => setUndercoatId(u.id)}
                title={u.blurb}
              >
                {u.name}
                {u.materialPerM2 > 0 ? ` · $${u.materialPerM2}/m²` : ''}
              </button>
            ))}
          </div>
          {estimate && (
            <p className="live-estimate">
              Ballpark <strong>{formatPaintBracket(estimate)}</strong>
            </p>
          )}
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(1)}>
              Back
            </button>
            <button type="button" className="btn primary" onClick={() => setStep(3)}>
              Next: Schedule
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section key="step-3" className="yacht-panel demo-enter">
          <h2>3. Preferred window</h2>
          <div className="day-rail" role="listbox" aria-label="Available days">
            {days.map((d) => {
              const openCount = d.slots.filter((s) => s.status === 'open').length
              const blocked = openCount === 0
              return (
                <button
                  key={d.date}
                  type="button"
                  role="option"
                  aria-selected={date === d.date}
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
                  title={slot.note}
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
          <label className="field">
            Notes for the painter
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Colour codes, access, furniture move…"
            />
          </label>
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(2)}>
              Back
            </button>
            <button type="button" className="btn primary" disabled={!canWhen} onClick={() => setStep(4)}>
              Next: Review
            </button>
          </div>
        </section>
      )}

      {step === 4 && estimate && (
        <section key="step-4" className="yacht-panel demo-enter">
          <h2>4. Automatic ballpark</h2>
          <div className="summary">
            <p>
              <strong>Area:</strong> {estimate.totalAreaM2} m² ({setting})
            </p>
            <p>
              <strong>System:</strong> {paintTypeById(paintTypeId)?.name}
              {undercoatId !== 'none' ? ` + ${undercoatById(undercoatId)?.name}` : ''}
            </p>
            <p>
              <strong>When:</strong> {date} @ {time} · {GB_PLACES.find((p) => p.id === placeId)?.name}
            </p>
            {notes && (
              <p>
                <strong>Notes:</strong> {notes}
              </p>
            )}
            <ul className="quote-breakdown">
              <li>Labour ${estimate.labour.toFixed(2)}</li>
              <li>Materials ${estimate.materials.toFixed(2)}</li>
              <li>Setup ${estimate.setupFee.toFixed(2)}</li>
              <li>Travel (Golden Bay) ${estimate.travelFee.toFixed(2)}</li>
              {estimate.outdoorSurcharge > 0 && (
                <li>Outdoor access ${estimate.outdoorSurcharge.toFixed(2)}</li>
              )}
            </ul>
            <p className="estimate-bracket">Estimated cost {formatPaintBracket(estimate)}</p>
            <p className="hint">Simulated ballpark for Golden Bay painters — final quote after site measure.</p>
          </div>
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(3)}>
              Back
            </button>
            <button type="button" className="btn primary" disabled={!canConfirm} onClick={() => setDone(true)}>
              Lock quote (demo)
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

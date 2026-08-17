import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoChrome } from '../../components/DemoChrome'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import {
  INDOOR_KINDS,
  INDOOR_PAINT_TYPES,
  INDOOR_UNDERCOATS,
  defaultIndoorSurfaces,
  estimatePaintJob,
  formatAreaLine,
  formatPaintBracket,
  kindMeta,
  newIndoorSurface,
  paintTypeById,
  paintedAreaM2,
  undercoatById,
  type IndoorKind,
  type PaintSurface,
  type PaintTypeId,
  type UndercoatId,
} from '../../shared/paintingQuote'

/**
 * Fresh Coat — indoor rooms estimate wizard.
 * Surfaces (kind + measures) → paint system → ballpark. Not an outdoor job.
 */
export default function FreshCoat() {
  const [step, setStep] = useState(1)
  const [surfaces, setSurfaces] = useState<PaintSurface[]>(() => defaultIndoorSurfaces())
  const [paintTypeId, setPaintTypeId] = useState<PaintTypeId>('standard')
  const [undercoatId, setUndercoatId] = useState<UndercoatId>('acrylic')
  const [notes, setNotes] = useState('')
  const [done, setDone] = useState(false)

  const estimate = useMemo(
    () => estimatePaintJob(surfaces, 'indoor', paintTypeId, undercoatId),
    [surfaces, paintTypeId, undercoatId],
  )

  const updateSurface = (id: string, patch: Partial<PaintSurface>) => {
    setSurfaces((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  const changeKind = (id: string, kind: IndoorKind) => {
    setSurfaces((prev) =>
      prev.map((s) => (s.id === id ? newIndoorSurface(kind, { id: s.id, label: s.label }) : s)),
    )
  }

  const removeSurface = (id: string) => {
    setSurfaces((prev) => (prev.length <= 1 ? prev : prev.filter((s) => s.id !== id)))
  }

  if (done && estimate) {
    return (
      <div className="painting-page theme-freshcoat">
        <DemoChrome
          theme="Fresh Coat"
          title="Indoor ballpark saved"
          subtitle="Impression only — nothing was quoted or booked."
          imageId="freshcoat"
          badge="Ballpark only · impression, not a quote"
          backTo="/painting"
          backLabel="← Painting estimates"
        />
        <div className="yacht-panel success-panel demo-enter-success">
          <h2>Indoor rooms (demo)</h2>
          <p>
            Painted {formatAreaLine(estimate)} · {paintTypeById(paintTypeId)?.name}
            {undercoatId !== 'none' ? ` · ${undercoatById(undercoatId)?.name}` : ''}
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
            Measure another room (demo)
          </button>
          <Link to="/painting" className="adventure-hub-link">
            ← Painting estimates
          </Link>
        </div>
        <DemoPitchBar
          packageTier="essential"
          compareTo="/painting/paintboard"
          compareLabel="Weatherboards, corrugate & roof"
          engineNote="Two jobs, not two skins — indoor rooms vs weatherboards, corrugate and roof."
        />
      </div>
    )
  }

  return (
    <div className="painting-page theme-freshcoat">
      <DemoChrome
        theme="Fresh Coat"
        title="Indoor rooms"
        subtitle="Walls, ceilings, skirting, windows, and trim — a ballpark for interior paint, not weatherboards."
        imageId="freshcoat"
        badge="Ballpark only · impression, not a quote"
        backTo="/painting"
        backLabel="← Painting estimates"
      />
      <DemoPitchBar
        packageTier="essential"
        compareTo="/painting/paintboard"
        compareLabel="Weatherboards, corrugate & roof"
        engineNote="Two jobs, not two skins — indoor rooms vs weatherboards, corrugate and roof."
      />

      <ol className="wizard-steps" aria-label="Quote steps">
        {[1, 2, 3].map((n) => (
          <li key={n} className={step === n ? 'active' : step > n ? 'done' : ''}>
            {n}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <section key="step-1" className="yacht-panel demo-enter">
          <h2>1. Surfaces</h2>
          <p className="hint">Kind changes the measures. Quantity covers matching faces.</p>
          <div className="wall-editor-list">
            {surfaces.map((s) => {
              const meta = kindMeta(s.kind)
              return (
                <div key={s.id} className="wall-editor-card">
                  <div className="wall-kind-row">
                    <label className="field">
                      Label
                      <input
                        value={s.label}
                        onChange={(e) => updateSurface(s.id, { label: e.target.value })}
                        placeholder="e.g. Lounge north"
                      />
                    </label>
                    <label className="field">
                      Kind
                      <select
                        value={s.kind}
                        onChange={(e) => changeKind(s.id, e.target.value as IndoorKind)}
                      >
                        {INDOOR_KINDS.map((k) => (
                          <option key={k.id} value={k.id}>
                            {k.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="wall-dims">
                    <label className="field">
                      {meta.dimA}
                      <input
                        type="number"
                        min={0.01}
                        max={40}
                        step={0.05}
                        value={s.widthM}
                        onChange={(e) => updateSurface(s.id, { widthM: Number(e.target.value) })}
                      />
                    </label>
                    <label className="field">
                      {meta.dimB}
                      <input
                        type="number"
                        min={0.01}
                        max={20}
                        step={0.01}
                        value={s.heightM}
                        onChange={(e) => updateSurface(s.id, { heightM: Number(e.target.value) })}
                      />
                    </label>
                    <label className="field">
                      Qty
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={s.qty}
                        onChange={(e) => updateSurface(s.id, { qty: Number(e.target.value) })}
                      />
                    </label>
                  </div>
                  <div className="wall-editor-meta">
                    <span>{paintedAreaM2(s)} m² painted</span>
                    <button
                      type="button"
                      className="btn ghost"
                      disabled={surfaces.length <= 1}
                      onClick={() => removeSurface(s.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="add-kind-row">
            {INDOOR_KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                className="chip"
                onClick={() => setSurfaces((prev) => [...prev, newIndoorSurface(k.id as IndoorKind)])}
              >
                {k.addLabel}
              </button>
            ))}
          </div>
          {estimate && (
            <p className="live-estimate">
              Running area <strong>{formatAreaLine(estimate)}</strong>
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
          <h2>2. Paint system</h2>
          <p className="hint">Indoor finishes only — weathercoat and metal primer live on the exterior job.</p>
          <h3 className="subhead">Finish paint</h3>
          <div className="pkg-grid">
            {INDOOR_PAINT_TYPES.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`pkg-card${paintTypeId === p.id ? ' selected' : ''}`}
                onClick={() => setPaintTypeId(p.id)}
              >
                <strong>{p.name}</strong>
                <span className="pkg-price">
                  from ${p.materialPerM2}/m² · {p.finishCoats} coats
                </span>
                <p>{p.blurb}</p>
              </button>
            ))}
          </div>
          <h3 className="subhead">Undercoat</h3>
          <div className="route-chips">
            {INDOOR_UNDERCOATS.map((u) => (
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
              Next: Ballpark
            </button>
          </div>
        </section>
      )}

      {step === 3 && estimate && (
        <section key="step-3" className="yacht-panel demo-enter">
          <h2>3. Ballpark</h2>
          <div className="summary">
            <p>
              <strong>Painted:</strong> {formatAreaLine(estimate)}
            </p>
            <p>
              <strong>System:</strong> {paintTypeById(paintTypeId)?.name}
              {undercoatId !== 'none' ? ` + ${undercoatById(undercoatId)?.name}` : ''}
            </p>
            <ul className="quote-breakdown">
              {estimate.lines.map((line) => (
                <li key={line.wallId}>
                  {line.label}: {line.areaM2} m²
                </li>
              ))}
            </ul>
            <ul className="quote-breakdown">
              <li>Labour ${estimate.labour.toFixed(2)}</li>
              <li>Materials ${estimate.materials.toFixed(2)}</li>
              <li>Setup ${estimate.setupFee.toFixed(2)}</li>
              <li>Travel (Golden Bay) ${estimate.travelFee.toFixed(2)}</li>
            </ul>
            <p className="estimate-bracket">Estimated cost {formatPaintBracket(estimate)}</p>
            <label className="field">
              Notes for the painter
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Colour codes, access, furniture move…"
              />
            </label>
            <p className="hint">Impression only — simulated Golden Bay painter rates, not a confirmed quote.</p>
          </div>
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(2)}>
              Back
            </button>
            <button type="button" className="btn primary" onClick={() => setDone(true)}>
              Save impression (demo)
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

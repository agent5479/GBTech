import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BallparkExportActions } from '../../components/BallparkExportActions'
import { DemoChrome } from '../../components/DemoChrome'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import {
  INDOOR_SURFACE_KINDS,
  areaNote,
  estimatePaintJob,
  formatPaintBracket,
  measuredAreaM2,
  newSurface,
  paintTypeById,
  paintableAreaM2,
  paintsFor,
  surfaceKindById,
  undercoatById,
  undercoatsFor,
  type PaintSurface,
  type PaintTypeId,
  type SurfaceKindId,
  type UndercoatId,
} from '../../shared/paintingQuote'

const INDOOR_PAINTS = paintsFor('indoor')
const INDOOR_UNDERCOATS = undercoatsFor('indoor')

function labourHint(kind: SurfaceKindId): string | null {
  if (kind === 'ceiling') return 'slower overhead labour'
  if (kind === 'skirting' || kind === 'window' || kind === 'detailing') return 'fiddly cut-in labour'
  return null
}

/**
 * Fresh Coat — indoor rooms estimate wizard (client-grade calculator).
 */
export default function FreshCoat() {
  const [step, setStep] = useState(1)
  const [surfaces, setSurfaces] = useState<PaintSurface[]>([
    { id: 'wall-lounge-long', label: 'Lounge — long walls', widthM: 3.5, heightM: 2.4, qty: 2, kind: 'wall' },
    { id: 'wall-lounge-ends', label: 'Lounge — end walls', widthM: 2.75, heightM: 2.4, qty: 2, kind: 'wall' },
    { id: 'ceil-lounge', label: 'Lounge — ceiling', widthM: 3.5, heightM: 2.75, qty: 1, kind: 'ceiling' },
    { id: 'skirt-lounge', label: 'Lounge — skirting', widthM: 12.5, heightM: 0.1, qty: 1, kind: 'skirting' },
    { id: 'win-lounge', label: 'Lounge — windows', widthM: 1.2, heightM: 1, qty: 3, kind: 'window' },
    {
      id: 'detail-lounge',
      label: 'Lounge — scotia / trim',
      widthM: 12.5,
      heightM: 0.06,
      qty: 1,
      kind: 'detailing',
    },
  ])
  const [paintTypeId, setPaintTypeId] = useState<PaintTypeId>('standard')
  const [undercoatId, setUndercoatId] = useState<UndercoatId>('acrylic')

  const estimate = useMemo(
    () => estimatePaintJob(surfaces, paintTypeId, undercoatId, 'indoor'),
    [surfaces, paintTypeId, undercoatId],
  )

  const updateSurface = (id: string, patch: Partial<PaintSurface>) => {
    setSurfaces((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  const changeKind = (id: string, kind: SurfaceKindId) => {
    const meta = surfaceKindById(kind)
    setSurfaces((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              kind,
              pitchId: undefined,
              widthM: Math.min(s.widthM, meta?.maxA ?? s.widthM),
              heightM: Math.min(s.heightM, meta?.maxB ?? s.heightM),
            }
          : s,
      ),
    )
  }

  const removeSurface = (id: string) => {
    setSurfaces((prev) => (prev.length <= 1 ? prev : prev.filter((s) => s.id !== id)))
  }

  const addKind = (kind: SurfaceKindId, labelPrefix: string) => {
    setSurfaces((prev) => [
      ...prev,
      newSurface({
        kind,
        label: `${labelPrefix} ${prev.filter((x) => x.kind === kind).length + 1}`,
      }),
    ])
  }

  return (
    <div className="painting-page theme-freshcoat">
      <DemoChrome
        theme="Indoor"
        title="Indoor rooms"
        subtitle="Walls, ceilings, skirting, windows, and trim — pick a paint system for a Golden Bay ballpark."
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
        <section className="yacht-panel demo-enter">
          <h2>1. Room surfaces</h2>
          <p className="hint">
            Measure walls and ceiling in metres. Add skirting, windows, and trim for a full-room figure —
            light plastering and patchwork sits inside the estimate range.
          </p>
          <div className="wall-editor-list">
            {surfaces.map((s) => {
              const kind = surfaceKindById(s.kind)
              const note = areaNote(s)
              const hint = labourHint(s.kind)
              const dimStep = s.kind === 'skirting' || s.kind === 'detailing' || s.kind === 'window' ? 0.01 : 0.1
              return (
                <div key={s.id} className="wall-editor-card">
                  <label className="field">
                    Label
                    <input
                      value={s.label}
                      onChange={(e) => updateSurface(s.id, { label: e.target.value })}
                      placeholder="e.g. Hall north"
                    />
                  </label>
                  <label className="field">
                    Surface
                    <select value={s.kind} onChange={(e) => changeKind(s.id, e.target.value as SurfaceKindId)}>
                      {INDOOR_SURFACE_KINDS.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="wall-dims">
                    <label className="field">
                      {kind?.dimA ?? 'Width (m)'}
                      <input
                        type="number"
                        min={0}
                        max={kind?.maxA ?? 20}
                        step={dimStep}
                        value={s.widthM}
                        onChange={(e) => updateSurface(s.id, { widthM: Number(e.target.value) })}
                      />
                    </label>
                    <label className="field">
                      {kind?.dimB ?? 'Height (m)'}
                      <input
                        type="number"
                        min={0}
                        max={kind?.maxB ?? 6}
                        step={dimStep}
                        value={s.heightM}
                        onChange={(e) => updateSurface(s.id, { heightM: Number(e.target.value) })}
                      />
                    </label>
                    <label className="field">
                      Qty
                      <input
                        type="number"
                        min={1}
                        max={24}
                        value={s.qty}
                        onChange={(e) => updateSurface(s.id, { qty: Number(e.target.value) })}
                      />
                    </label>
                  </div>
                  <div className="wall-editor-meta area-meta">
                    <span>
                      {measuredAreaM2(s)} m² measured
                      {note ? <small> · {note}</small> : null}
                      {hint ? <small> · {hint}</small> : null}
                      <small className="area-paint"> · {paintableAreaM2(s)} m² to paint</small>
                    </span>
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
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => addKind('wall', 'Wall')}>
              + Wall
            </button>
            <button type="button" className="btn ghost" onClick={() => addKind('ceiling', 'Ceiling')}>
              + Ceiling
            </button>
            <button type="button" className="btn ghost" onClick={() => addKind('skirting', 'Skirting')}>
              + Skirting
            </button>
            <button type="button" className="btn ghost" onClick={() => addKind('window', 'Windows')}>
              + Windows
            </button>
            <button type="button" className="btn ghost" onClick={() => addKind('detailing', 'Trim')}>
              + Detailing
            </button>
          </div>
          {estimate && (
            <p className="live-estimate">
              Running area <strong>{estimate.paintableM2} m²</strong>
              {estimate.measuredM2 !== estimate.paintableM2 ? ` (${estimate.measuredM2} m² measured)` : ''}
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
        <section className="yacht-panel demo-enter">
          <h2>2. Paint &amp; undercoat</h2>
          <h3 className="subhead">Finish paint</h3>
          <div className="pkg-grid">
            {INDOOR_PAINTS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`pkg-card${paintTypeId === p.id ? ' selected' : ''}`}
                onClick={() => setPaintTypeId(p.id)}
              >
                <strong>{p.name}</strong>
                <span className="pkg-price">{p.finishCoats} coats</span>
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
            <button type="button" className="btn primary" disabled={!estimate} onClick={() => setStep(3)}>
              See ballpark
            </button>
          </div>
        </section>
      )}

      {step === 3 && estimate && (
        <section className="yacht-panel demo-enter">
          <h2>3. Your ballpark figure</h2>
          <p className="hint">
            Impression only — not a confirmed quote or booking. Light filling and patch prep is allowed for in the
            range.
          </p>
          <div className="summary">
            <p>
              <strong>Area:</strong> {estimate.paintableM2} m² indoor
              {estimate.measuredM2 !== estimate.paintableM2 ? ` (${estimate.measuredM2} m² measured)` : ''}
            </p>
            <p>
              <strong>System:</strong> {paintTypeById(paintTypeId)?.name}
              {undercoatId !== 'none' ? ` + ${undercoatById(undercoatId)?.name}` : ''}
            </p>
            <ul className="quote-breakdown">
              {estimate.lines.map((line) => (
                <li key={line.surfaceId}>
                  {line.label}: {line.paintableM2} m²
                </li>
              ))}
              <li>Labour &amp; materials ${(estimate.labour + estimate.materials).toFixed(2)}</li>
              <li>Setup ${estimate.setupFee.toFixed(2)}</li>
              <li>Travel (Golden Bay) ${estimate.travelFee.toFixed(2)}</li>
            </ul>
            <p className="estimate-bracket">Estimated cost {formatPaintBracket(estimate)}</p>
          </div>
          <BallparkExportActions estimate={estimate} />
          <DemoQuoteCta styleName="Fresh Coat" />
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(2)}>
              Back
            </button>
            <button type="button" className="btn ghost" onClick={() => setStep(1)}>
              Try another job
            </button>
            <Link to="/painting" className="adventure-hub-link">
              ← Painting estimates
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

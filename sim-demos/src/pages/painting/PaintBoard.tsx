import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoImageTiles } from '../../components/DemoHeroImage'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import {
  EXTERIOR_KINDS,
  EXTERIOR_PAINT_TYPES,
  EXTERIOR_UNDERCOATS,
  PITCH_OPTIONS,
  defaultExteriorSurfaces,
  estimateClipboardText,
  estimatePaintJob,
  formatAreaLine,
  formatPaintBracket,
  kindMeta,
  newExteriorSurface,
  paintTypeById,
  paintedAreaM2,
  undercoatById,
  type ExteriorKind,
  type PaintSurface,
  type PaintTypeId,
  type RoofPitch,
  type UndercoatId,
} from '../../shared/paintingQuote'

/**
 * Paint Board — exterior weatherboards / corrugate / roof board (not indoor rooms).
 */
export default function PaintBoard() {
  const [surfaces, setSurfaces] = useState<PaintSurface[]>(() => defaultExteriorSurfaces())
  const [paintTypeId, setPaintTypeId] = useState<PaintTypeId>('exterior')
  const [undercoatId, setUndercoatId] = useState<UndercoatId>('acrylic')
  const [copied, setCopied] = useState(false)

  const estimate = useMemo(
    () => estimatePaintJob(surfaces, 'outdoor', paintTypeId, undercoatId),
    [surfaces, paintTypeId, undercoatId],
  )

  const updateSurface = (id: string, patch: Partial<PaintSurface>) => {
    setSurfaces((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  const changeKind = (id: string, kind: ExteriorKind) => {
    setSurfaces((prev) =>
      prev.map((s) => (s.id === id ? newExteriorSurface(kind, { id: s.id, label: s.label }) : s)),
    )
  }

  const removeSurface = (id: string) => {
    setSurfaces((prev) => (prev.length <= 1 ? prev : prev.filter((s) => s.id !== id)))
  }

  const copyEstimate = async () => {
    if (!estimate) return
    try {
      await navigator.clipboard.writeText(estimateClipboardText(estimate))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="paintboard-page theme-paintboard">
      <header className="paintboard-top no-print">
        <Link to="/painting" className="demo-back">
          ← Painting estimates
        </Link>
        <div>
          <p className="demo-badge">Ballpark only · impression, not a quote</p>
          <h1>Weatherboards, corrugate &amp; roof</h1>
          <p className="demo-sub">
            Cladding profile, fascia, and roof pitch stretch paint area vs a flat indoor measure.
          </p>
        </div>
        <span className="demo-theme-tag">Paint Board</span>
      </header>
      <div className="no-print">
        <DemoImageTiles id="paintboard" />
        <DemoPitchBar
          packageTier="advanced"
          compareTo="/painting/freshcoat"
          compareLabel="Indoor rooms"
          engineNote="Two jobs, not two skins — weatherboards, corrugate and roof vs indoor rooms."
        />
      </div>

      <div className="paintboard-deck demo-enter">
        <aside className="paintboard-walls">
          <h2>Surfaces</h2>
          <p className="hint no-print">Type changes the measures. Roof cards take length × span and pitch.</p>
          <div className="wall-board-stack">
            {surfaces.map((s) => {
              const meta = kindMeta(s.kind)
              const isRoof = s.kind === 'roof'
              return (
                <article key={s.id} className="wall-board-card">
                  <input
                    className="wall-board-label"
                    value={s.label}
                    onChange={(e) => updateSurface(s.id, { label: e.target.value })}
                    aria-label="Surface label"
                  />
                  <label className="field wall-board-kind">
                    Type
                    <select
                      value={s.kind}
                      onChange={(e) => changeKind(s.id, e.target.value as ExteriorKind)}
                    >
                      {EXTERIOR_KINDS.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="wall-board-dims">
                    <label>
                      {meta.dimA}
                      <input
                        type="number"
                        min={0.1}
                        max={40}
                        step={0.1}
                        value={s.widthM}
                        onChange={(e) => updateSurface(s.id, { widthM: Number(e.target.value) })}
                      />
                    </label>
                    <span>×</span>
                    <label>
                      {meta.dimB}
                      <input
                        type="number"
                        min={0.05}
                        max={20}
                        step={0.05}
                        value={s.heightM}
                        onChange={(e) => updateSurface(s.id, { heightM: Number(e.target.value) })}
                      />
                    </label>
                    <label>
                      Qty
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={s.qty}
                        onChange={(e) => updateSurface(s.id, { qty: Number(e.target.value) })}
                      />
                    </label>
                  </div>
                  {isRoof && (
                    <div className="pitch-chips" role="group" aria-label="Roof pitch">
                      {PITCH_OPTIONS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className={`chip${(s.pitch ?? 'typical') === p.id ? ' selected' : ''}`}
                          onClick={() => updateSurface(s.id, { pitch: p.id as RoofPitch })}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="wall-board-foot">
                    <strong>{paintedAreaM2(s)} m² painted</strong>
                    <button type="button" disabled={surfaces.length <= 1} onClick={() => removeSurface(s.id)}>
                      Remove
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
          <div className="add-kind-row no-print">
            {EXTERIOR_KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                className="chip"
                onClick={() => setSurfaces((prev) => [...prev, newExteriorSurface(k.id as ExteriorKind)])}
              >
                {k.addLabel}
              </button>
            ))}
          </div>
        </aside>

        <aside className="paintboard-side">
          <section className="no-print">
            <h2>Paint</h2>
            <div className="job-chip-stack">
              {EXTERIOR_PAINT_TYPES.map((p) => (
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

          <section className="no-print">
            <h2>Primer</h2>
            <div className="job-chip-stack">
              {EXTERIOR_UNDERCOATS.map((u) => (
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

          <div className="paintboard-estimate print-estimate">
            {estimate ? (
              <>
                <span>Ballpark</span>
                <strong>{formatPaintBracket(estimate)}</strong>
                <small>
                  Painted {formatAreaLine(estimate)} · {paintTypeById(paintTypeId)?.name}
                  {undercoatId !== 'none' ? ` · ${undercoatById(undercoatId)?.name}` : ''}
                </small>
                <small className="paintboard-split">
                  Labour ${estimate.labour.toFixed(0)} · Materials ${estimate.materials.toFixed(0)} · Setup + travel $
                  {(estimate.setupFee + estimate.travelFee + estimate.outdoorSurcharge).toFixed(0)}
                </small>
                <ul className="quote-breakdown print-lines">
                  {estimate.lines.map((line) => (
                    <li key={line.wallId}>
                      {line.label}: {line.areaM2} m²
                    </li>
                  ))}
                </ul>
                <p className="hint">Impression only — simulated rates. A painter quotes on site.</p>
              </>
            ) : (
              <p className="hint">Add surfaces to see a ballpark.</p>
            )}
          </div>

          <div className="btn-row no-print">
            <button type="button" className="btn ghost" disabled={!estimate} onClick={() => void copyEstimate()}>
              {copied ? 'Copied' : 'Copy estimate'}
            </button>
            <button type="button" className="btn primary" disabled={!estimate} onClick={() => window.print()}>
              Download PDF
            </button>
          </div>
          <div className="no-print">
            <DemoQuoteCta styleName="Paint Board" />
          </div>
        </aside>
      </div>
    </div>
  )
}

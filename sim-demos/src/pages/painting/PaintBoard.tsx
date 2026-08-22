import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BallparkExportActions } from '../../components/BallparkExportActions'
import { DemoCardImage } from '../../components/DemoHeroImage'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import { ShowcaseChrome } from '../../components/ShowcaseShell'
import { WeatherStrip } from '../../components/WeatherStrip'
import { buildDemoForecast } from '../../shared/weatherMock'
import {
  EXTERIOR_SURFACE_KINDS,
  ROOF_PITCHES,
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
  type RoofPitchId,
  type SurfaceKindId,
  type UndercoatId,
} from '../../shared/paintingQuote'

const EXTERIOR_PAINTS = paintsFor('outdoor')
const EXTERIOR_UNDERCOATS = undercoatsFor('outdoor')

/**
 * Paint Board — exterior weatherboards / corrugate / roof (client-grade calculator).
 */
export default function PaintBoard() {
  const forecast = useMemo(() => buildDemoForecast(5), [])
  const [paintDay, setPaintDay] = useState<string>()
  const [surfaces, setSurfaces] = useState<PaintSurface[]>([
    {
      id: 'wb-street',
      label: 'Weatherboards — street',
      widthM: 8,
      heightM: 2.7,
      qty: 1,
      kind: 'weatherboard',
    },
    {
      id: 'wb-side',
      label: 'Weatherboards — side',
      widthM: 5.5,
      heightM: 2.7,
      qty: 1,
      kind: 'weatherboard',
    },
    {
      id: 'roof-main',
      label: 'Corrugate roof',
      widthM: 9,
      heightM: 6,
      qty: 1,
      kind: 'roof',
      pitchId: 'typical',
    },
  ])
  const [paintTypeId, setPaintTypeId] = useState<PaintTypeId>('exterior')
  const [undercoatId, setUndercoatId] = useState<UndercoatId>('acrylic')

  const estimate = useMemo(
    () => estimatePaintJob(surfaces, paintTypeId, undercoatId, 'outdoor'),
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
              pitchId: kind === 'roof' ? (s.pitchId ?? 'typical') : undefined,
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

  const addKind = (kind: SurfaceKindId) => {
    const meta = surfaceKindById(kind)
    const count = surfaces.filter((s) => s.kind === kind).length + 1
    setSurfaces((prev) => [
      ...prev,
      newSurface({
        kind,
        label: `${meta?.name ?? 'Surface'} ${count}`,
        pitchId: kind === 'roof' ? 'typical' : undefined,
      }),
    ])
  }

  return (
    <div className="paintboard-page theme-paintboard">
      <ShowcaseChrome>
        <header className="paintboard-top">
          <Link to="/painting" className="demo-back">
            ← Painting estimates
          </Link>
          <div>
            <p className="demo-badge">Ballpark only · impression, not a quote</p>
            <h1>Weatherboards, corrugate &amp; roof</h1>
            <p className="demo-sub">
              Exterior calculator — cladding, corrugations, and roof iron. Ridges and pitch add paint area; roofs take
              more labour.
            </p>
          </div>
          <span className="demo-theme-tag">Exterior</span>
        </header>
        <div className="demo-hero-photo">
          <DemoCardImage id="paintboard" className="demo-hero-photo__img" />
        </div>
      </ShowcaseChrome>
      <DemoPitchBar
        packageTier="advanced"
        compareTo="/painting/freshcoat"
        compareLabel="Indoor rooms"
        engineNote="Two jobs, not two skins — weatherboards, corrugate and roof vs indoor rooms."
      />

      <section className="paintboard-weather">
        <h2>Weather window</h2>
        <p className="hint">Exterior work needs dry days — tap a forecast card to note your preferred window.</p>
        <WeatherStrip days={forecast} selectedDate={paintDay} onSelectDate={setPaintDay} />
        {paintDay && (
          <p className="weather-pick">
            Preferred window: <strong>{forecast.find((f) => f.date === paintDay)?.summary}</strong>
          </p>
        )}
      </section>

      <div className="paintboard-deck demo-enter">
        <aside className="paintboard-walls">
          <h2>Surfaces</h2>
          <p className="hint">
            Measure the flat face (or roof footprint). Corrugate and weatherboards add paint area; roof pitch stretches
            the slope.
          </p>
          <div className="wall-board-stack">
            {surfaces.map((s) => {
              const kind = surfaceKindById(s.kind)
              const note = areaNote(s)
              return (
                <article key={s.id} className="wall-board-card">
                  <input
                    className="wall-board-label"
                    value={s.label}
                    onChange={(e) => updateSurface(s.id, { label: e.target.value })}
                    aria-label="Surface label"
                  />
                  <label className="wall-board-kind-label">
                    Type
                    <select
                      className="wall-board-kind"
                      value={s.kind}
                      onChange={(e) => changeKind(s.id, e.target.value as SurfaceKindId)}
                    >
                      {EXTERIOR_SURFACE_KINDS.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="wall-board-dims">
                    <label>
                      {kind?.dimA.replace(' (m)', '') ?? 'W'}
                      <input
                        type="number"
                        min={0.3}
                        max={kind?.maxA ?? 30}
                        step={0.1}
                        value={s.widthM}
                        onChange={(e) => updateSurface(s.id, { widthM: Number(e.target.value) })}
                      />
                    </label>
                    <span>×</span>
                    <label>
                      {kind?.dimB.replace(' (m)', '') ?? 'H'}
                      <input
                        type="number"
                        min={0.15}
                        max={kind?.maxB ?? 8}
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
                  {s.kind === 'roof' && (
                    <div className="pitch-chips" role="group" aria-label="Roof pitch">
                      {ROOF_PITCHES.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className={`chip${(s.pitchId ?? 'typical') === p.id ? ' selected' : ''}`}
                          title={p.blurb}
                          onClick={() => updateSurface(s.id, { pitchId: p.id as RoofPitchId })}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="wall-board-foot">
                    <strong>
                      {measuredAreaM2(s)} m² face
                      <small className="area-paint">
                        {' '}
                        → {paintableAreaM2(s)} m² paint
                        {note ? ` · ${note}` : ''}
                      </small>
                    </strong>
                    <button type="button" disabled={surfaces.length <= 1} onClick={() => removeSurface(s.id)}>
                      Remove
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
          <div className="add-surface-row">
            <button type="button" className="btn ghost" onClick={() => addKind('weatherboard')}>
              + Weatherboards
            </button>
            <button type="button" className="btn ghost" onClick={() => addKind('corrugate')}>
              + Corrugate
            </button>
            <button type="button" className="btn ghost" onClick={() => addKind('roof')}>
              + Roof
            </button>
            <button type="button" className="btn ghost" onClick={() => addKind('fascia')}>
              + Fascia
            </button>
          </div>
        </aside>

        <aside className="paintboard-side">
          <section>
            <h2>Paint</h2>
            <div className="job-chip-stack">
              {EXTERIOR_PAINTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`job-chip${paintTypeId === p.id ? ' on' : ''}`}
                  aria-pressed={paintTypeId === p.id}
                  onClick={() => setPaintTypeId(p.id)}
                >
                  <strong>{p.name}</strong>
                  <span>{p.finishCoats} coats</span>
                </button>
              ))}
            </div>
            {surfaces.some((s) => s.kind === 'roof') && paintTypeId !== 'roof' && (
              <p className="hint">Roof iron usually wants a roof coating rather than wall weathercoat.</p>
            )}
          </section>

          <section>
            <h2>Undercoat / primer</h2>
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
                  <span>{u.id === 'none' ? 'skip' : 'included'}</span>
                </button>
              ))}
            </div>
          </section>

          <div className="paintboard-estimate">
            {estimate ? (
              <>
                <span>Ballpark</span>
                <strong>{formatPaintBracket(estimate)}</strong>
                <small>
                  {estimate.measuredM2} m² measured → {estimate.paintableM2} m² to paint
                  {undercoatId !== 'none' ? ` · ${undercoatById(undercoatId)?.name}` : ''}
                </small>
                <small className="paintboard-split">
                  Labour &amp; materials ${(estimate.labour + estimate.materials).toFixed(0)} · Setup + travel $
                  {(estimate.setupFee + estimate.travelFee).toFixed(0)}
                  {estimate.roofAccessFee > 0 ? ` · roof access $${estimate.roofAccessFee.toFixed(0)}` : ''}
                </small>
              </>
            ) : (
              <p className="hint">Add surface sizes to see a ballpark.</p>
            )}
          </div>
          <p className="hint">
            Impression only — corrugate and roof figures include extra paint area and slower labour. Light prep sits
            inside the range. Not a confirmed quote.
          </p>
          {estimate && (
            <p className="hint">
              System: {paintTypeById(paintTypeId)?.name}
              {undercoatId !== 'none' ? ` + ${undercoatById(undercoatId)?.name}` : ''}.
            </p>
          )}
          {estimate ? <BallparkExportActions estimate={estimate} /> : null}
          <DemoQuoteCta styleName="Paint Board" />
        </aside>
      </div>
    </div>
  )
}

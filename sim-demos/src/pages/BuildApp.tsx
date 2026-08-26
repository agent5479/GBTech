import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoOutsideShell } from '../components/DemoChrome'
import { DEMO_FEATURES } from '../shared/demoFeatures'
import {
  buildMailtoBrief,
  composeWireframe,
  conflictsWithSelection,
  featuresByCategory,
  findClosestDemos,
  toggleFeature,
  type CatalogFeature,
} from '../shared/featureCatalog'

/** Lightweight “Design your app” sketch — wireframe + brief, not a live product builder. */
export default function BuildApp() {
  const [businessName, setBusinessName] = useState('')
  const [selected, setSelected] = useState<string[]>([])

  const groups = useMemo(() => featuresByCategory(), [])
  const wireframe = useMemo(() => composeWireframe(selected), [selected])
  const closest = useMemo(() => findClosestDemos(selected, DEMO_FEATURES, 2), [selected])
  const displayName = businessName.trim() || 'Your business'
  const mailto = buildMailtoBrief(businessName, selected)

  const onToggle = (id: string) => {
    setSelected((prev) => toggleFeature(prev, id))
  }

  return (
    <div className="build-page theme-build">
      <DemoOutsideShell />
      <header className="tradeboard-top build-top">
        <div>
          <p className="demo-badge">Design your app · sketch only</p>
          <h1>Mix features into a rough layout</h1>
          <p className="demo-sub">
            Pick what you need, see an approximate layout, then email Warwick a brief. This is a sales sketch — not a
            finished product builder.
          </p>
        </div>
        <span className="demo-theme-tag">Configurator</span>
      </header>

      <div className="build-deck">
        <aside className="build-controls">
          <label className="build-name-field">
            <span>Business name</span>
            <input
              type="text"
              value={businessName}
              placeholder="e.g. Golden Bay Sails"
              onChange={(e) => setBusinessName(e.target.value)}
              autoComplete="organization"
            />
          </label>

          <div className="build-feature-list">
            {groups.map((g) => (
              <section key={g.category} className="build-feature-group">
                <h2>{g.label}</h2>
                <ul>
                  {g.features.map((f) => (
                    <FeatureRow
                      key={f.id}
                      feature={f}
                      checked={selected.includes(f.id)}
                      rival={conflictsWithSelection(selected, f.id)}
                      onToggle={() => onToggle(f.id)}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </aside>

        <div className="build-preview-col">
          <div className="build-wireframe" aria-live="polite">
            <header className="build-wireframe__chrome">
              <p className="build-wireframe__brand">{displayName}</p>
              <span className="build-wireframe__hint">Approx layout</span>
            </header>

            {!wireframe.length ? (
              <p className="build-wireframe__empty">Pick a few features to sketch a layout</p>
            ) : (
              wireframe.map((block) => (
                <section key={block.region} className={`build-wireframe__block build-wireframe__block--${block.region}`}>
                  <h3>{block.title}</h3>
                  <ul>
                    {block.items.map((item) => (
                      <li key={item.id}>{item.label}</li>
                    ))}
                  </ul>
                </section>
              ))
            )}
          </div>

          {closest.length > 0 ? (
            <p className="build-closest">
              Closest demos:{' '}
              {closest.map((d, i) => (
                <span key={d.path}>
                  {i > 0 ? ', ' : null}
                  <Link to={d.path}>{d.title}</Link>
                </span>
              ))}
            </p>
          ) : null}

          <div className="build-cta">
            {selected.length ? (
              <a className="btn primary" href={mailto}>
                Email this sketch →
              </a>
            ) : (
              <button type="button" className="btn primary" disabled>
                Email this sketch →
              </button>
            )}
            <p className="hint">This is a sketch — Warwick builds the real app.</p>
            {selected.length ? (
              <button type="button" className="btn ghost" onClick={() => setSelected([])}>
                Clear selection
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureRow({
  feature,
  checked,
  rival,
  onToggle,
}: {
  feature: CatalogFeature
  checked: boolean
  rival: CatalogFeature | null
  onToggle: () => void
}) {
  return (
    <li className={`build-feature-row${checked ? ' is-on' : ''}${rival && !checked ? ' has-rival' : ''}`}>
      <label>
        <input type="checkbox" checked={checked} onChange={onToggle} />
        <span className="build-feature-row__text">
          <strong>{feature.label}</strong>
          <span>{feature.clientDescription}</span>
          {rival && !checked ? (
            <em className="build-feature-row__rival">Replaces “{rival.label}” if selected</em>
          ) : null}
        </span>
      </label>
    </li>
  )
}

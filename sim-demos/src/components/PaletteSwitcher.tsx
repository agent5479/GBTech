import { DEMO_PALETTES } from '../shared/demoPalettes'

interface Props {
  value: string
  onChange: (id: string) => void
}

/**
 * Live palette switcher — shows that brand colours are fully customisable.
 * Default keeps the demo’s designed theme; other swatches override --accent / page colours.
 */
export function PaletteSwitcher({ value, onChange }: Props) {
  return (
    <div className="palette-switcher" role="group" aria-label="Colour palette">
      <div className="palette-switcher-copy">
        <strong>Aesthetics fully customisable</strong>
        <span>Try a palette — your live portal uses your brand colours, fonts, and layout.</span>
      </div>
      <div className="palette-swatches">
        {DEMO_PALETTES.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`palette-swatch${value === p.id ? ' on' : ''}`}
            title={p.label}
            aria-label={p.label}
            aria-pressed={value === p.id}
            onClick={() => onChange(p.id)}
          >
            <span className="palette-swatch-a" style={{ background: p.swatch[0] }} />
            <span className="palette-swatch-b" style={{ background: p.swatch[1] }} />
            <em>{p.label}</em>
          </button>
        ))}
      </div>
    </div>
  )
}

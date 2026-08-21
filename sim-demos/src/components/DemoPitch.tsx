import { Link } from 'react-router-dom'

export type PackageTier = 'essential' | 'advanced'

const MARSHALL = '/#packages'
const QUOTE = `${MARSHALL}#packages`

interface PitchBarProps {
  /** Which Marshall package this demo style maps to. */
  packageTier: PackageTier
  /** Path to the sibling UI that shares the same booking engine. */
  compareTo: string
  compareLabel: string
  engineNote?: string
}

/** Persistent pitch strip: package tier + compare sibling UI. */
export function DemoPitchBar({ packageTier, compareTo, compareLabel, engineNote }: PitchBarProps) {
  const tierLabel = packageTier === 'essential' ? 'Essential · $351' : 'Advanced · $702'
  const tierHint =
    packageTier === 'essential'
      ? 'Streamlined calendar booking — closest to this style'
      : 'Accounts, dynamic pricing, maps — closest to this style'
  return (
    <aside className="demo-pitch-bar" aria-label="Package and interface pairing">
      <div className="demo-pitch-tier">
        <span className="demo-pitch-kicker">This style ≈</span>
        <a className="demo-pitch-package" href={`${MARSHALL}#${packageTier}`}>
          {tierLabel}
        </a>
        <span className="demo-pitch-hint">{tierHint}</span>
      </div>
      <div className="demo-pitch-pair">
        {engineNote && <p className="demo-pitch-engine">{engineNote}</p>}
        <Link className="demo-pitch-compare" to={compareTo}>
          Compare with {compareLabel} →
        </Link>
      </div>
    </aside>
  )
}

interface QuoteCtaProps {
  styleName: string
}

/** End-of-demo conversion CTA — links back to Marshall packages. */
export function DemoQuoteCta({ styleName }: QuoteCtaProps) {
  return (
    <div className="demo-quote-cta">
      <p>
        Like the <strong>{styleName}</strong> style?
      </p>
      <a className="btn primary" href={QUOTE}>
        Get a quote → Essential $351 / Advanced $702
      </a>
    </div>
  )
}

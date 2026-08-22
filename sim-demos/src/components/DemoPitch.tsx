import { Link } from 'react-router-dom'
import { useDemoPresentation } from '../context/DemoPresentation'

export type PackageTier = 'essential' | 'advanced'
export type PitchKind = 'package' | 'customOps'

const PACKAGES = '/#packages'
const CUSTOM_MAIL =
  'mailto:warwick.marshall@gmail.com?subject=Custom%20operational%20app%20%E2%80%94%20GBTech%20demo'

interface PitchBarProps {
  /** Booking/estimate demos map to a package; ops demos use customOps. */
  pitchKind?: PitchKind
  /** Required when pitchKind is package (default). */
  packageTier?: PackageTier
  compareTo: string
  compareLabel: string
  engineNote?: string
}

/** Persistent pitch strip: package tier or custom ops + compare sibling UI. */
export function DemoPitchBar({
  pitchKind = 'package',
  packageTier = 'advanced',
  compareTo,
  compareLabel,
  engineNote,
}: PitchBarProps) {
  const { showShowcaseChrome } = useDemoPresentation()
  if (!showShowcaseChrome) return null

  const isOps = pitchKind === 'customOps'
  const tierLabel = packageTier === 'essential' ? 'Essential · $351' : 'Advanced · $702'
  const tierHint =
    packageTier === 'essential'
      ? 'Streamlined calendar booking — closest to this style'
      : 'Accounts, dynamic pricing, maps — closest to this style'

  return (
    <aside className="demo-pitch-bar" aria-label="Offer and interface pairing">
      <div className="demo-pitch-tier">
        <span className="demo-pitch-kicker">This style ≈</span>
        {isOps ? (
          <>
            <a className="demo-pitch-package" href={CUSTOM_MAIL}>
              Custom ops · scoped project
            </a>
            <span className="demo-pitch-hint">Field + office systems you own — not a booking package</span>
          </>
        ) : (
          <>
            <a className="demo-pitch-package" href={`${PACKAGES}#${packageTier}`}>
              {tierLabel}
            </a>
            <span className="demo-pitch-hint">{tierHint}</span>
          </>
        )}
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
  pitchKind?: PitchKind
}

/** End-of-demo conversion CTA. */
export function DemoQuoteCta({ styleName, pitchKind = 'package' }: QuoteCtaProps) {
  const { showShowcaseChrome } = useDemoPresentation()
  if (!showShowcaseChrome) {
    return (
      <p className="demo-quote-minimal">
        <a href="/#packages">Like this style? Get a quote on GBTech →</a>
      </p>
    )
  }

  if (pitchKind === 'customOps') {
    return (
      <div className="demo-quote-cta">
        <p>
          Like the <strong>{styleName}</strong> ops pattern?
        </p>
        <a className="btn primary" href={CUSTOM_MAIL}>
          Discuss a custom ops app →
        </a>
      </div>
    )
  }
  return (
    <div className="demo-quote-cta">
      <p>
        Like the <strong>{styleName}</strong> style?
      </p>
      <a className="btn primary" href={`${PACKAGES}#packages`}>
        Get a quote → Essential $351 / Advanced $702
      </a>
    </div>
  )
}

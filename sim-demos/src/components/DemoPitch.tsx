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

/** Pitch strip removed from showcase chrome — kept for typed props / quote CTA sibling. */
export function DemoPitchBar(_props: PitchBarProps) {
  return null
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

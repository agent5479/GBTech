import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useDemoPresentation } from '../context/DemoPresentation'
import { DemoCardImage } from './DemoHeroImage'
import { GbtechDemoNav } from './GbtechDemoNav'
import { ShowcaseChrome } from './ShowcaseShell'
import type { DemoImageId } from '../shared/demoAssets'

interface OutsideProps {
  backTo?: string
  backLabel?: string
  imageId?: DemoImageId
  heroAlt?: string
  /** Compact hero crop (ops boards). */
  heroCompact?: boolean
  showNav?: boolean
  children?: ReactNode
}

/** Marketing chrome above the tablet: nav, back link, optional hero. Titles stay in-app. */
export function DemoOutsideShell({
  backTo = '/',
  backLabel = '← All demos',
  imageId,
  heroAlt,
  heroCompact,
  showNav = false,
  children,
}: OutsideProps) {
  const { showShowcaseChrome } = useDemoPresentation()

  if (!showShowcaseChrome) {
    return (
      <>
        <div className="demo-outside-bar demo-outside-bar--inline">
          <Link to={backTo} className="demo-back">
            {backLabel}
          </Link>
        </div>
        {children}
      </>
    )
  }

  return (
    <ShowcaseChrome>
      {showNav ? <GbtechDemoNav /> : null}
      <div className="demo-outside-bar">
        <Link to={backTo} className="demo-back">
          {backLabel}
        </Link>
      </div>
      {imageId ? (
        <div className={`demo-hero-photo${heroCompact ? ' demo-hero-photo--compact' : ''}`}>
          <DemoCardImage id={imageId} alt={heroAlt} className="demo-hero-photo__img" />
        </div>
      ) : null}
      {children}
    </ShowcaseChrome>
  )
}

interface Props {
  theme: string
  title: string
  subtitle?: string
  imageId: DemoImageId
  heroAlt?: string
  badge?: string
  backTo?: string
  backLabel?: string
}

export function DemoChrome({
  theme,
  title,
  subtitle,
  imageId,
  heroAlt,
  badge = 'Simulated demo · no real booking',
  backTo = '/',
  backLabel = '← All demos',
}: Props) {
  const { showShowcaseChrome } = useDemoPresentation()

  if (!showShowcaseChrome) {
    return (
      <header className="demo-app-bar">
        <Link to={backTo} className="demo-back">
          {backLabel}
        </Link>
        <div className="demo-app-bar__title">
          <span className="demo-theme-tag">{theme}</span>
          <h1>{title}</h1>
        </div>
      </header>
    )
  }

  return (
    <>
      <DemoOutsideShell backTo={backTo} backLabel={backLabel} imageId={imageId} heroAlt={heroAlt} showNav />
      <header className="demo-chrome demo-chrome--in-app">
        <div>
          <p className="demo-badge">{badge}</p>
          <h1>{title}</h1>
          {subtitle ? <p className="demo-sub">{subtitle}</p> : null}
        </div>
        <span className="demo-theme-tag">{theme}</span>
      </header>
    </>
  )
}

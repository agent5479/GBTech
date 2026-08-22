import { Link } from 'react-router-dom'
import { useDemoPresentation } from '../context/DemoPresentation'
import { DemoCardImage } from './DemoHeroImage'
import { GbtechDemoNav } from './GbtechDemoNav'
import type { DemoImageId } from '../shared/demoAssets'

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
      <GbtechDemoNav />
      <header className="demo-chrome">
        <Link to={backTo} className="demo-back">
          {backLabel}
        </Link>
        <div>
          <p className="demo-badge">{badge}</p>
          <h1>{title}</h1>
          {subtitle && <p className="demo-sub">{subtitle}</p>}
        </div>
        <span className="demo-theme-tag">{theme}</span>
      </header>
      <div className="demo-hero-photo">
        <DemoCardImage id={imageId} alt={heroAlt} className="demo-hero-photo__img" />
      </div>
    </>
  )
}

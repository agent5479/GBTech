import { Link } from 'react-router-dom'
import { DemoImageTiles } from './DemoHeroImage'
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
  return (
    <>
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
      <DemoImageTiles id={imageId} alt={heroAlt} />
    </>
  )
}

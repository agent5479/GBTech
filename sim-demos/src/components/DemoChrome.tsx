import { Link } from 'react-router-dom'
import { DemoImageTiles } from './DemoHeroImage'
import type { DemoImageId } from '../shared/demoAssets'

interface Props {
  theme: string
  title: string
  subtitle?: string
  imageId: DemoImageId
  heroAlt?: string
}

export function DemoChrome({ theme, title, subtitle, imageId, heroAlt }: Props) {
  return (
    <>
      <header className="demo-chrome">
        <Link to="/" className="demo-back">
          ← All demos
        </Link>
        <div>
          <p className="demo-badge">Simulated demo · no real booking</p>
          <h1>{title}</h1>
          {subtitle && <p className="demo-sub">{subtitle}</p>}
        </div>
        <span className="demo-theme-tag">{theme}</span>
      </header>
      <DemoImageTiles id={imageId} alt={heroAlt} />
    </>
  )
}

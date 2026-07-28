import type { CSSProperties } from 'react'
import type { DemoImageId } from '../shared/demoAssets'
import { DEMO_META, demoCardSources, demoCutouts, demoHeroSources } from '../shared/demoAssets'

interface PictureProps {
  webpSrcSet: string
  jpgSrcSet: string
  fallback: string
  sizes: string
  width: number
  height: number
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
}

function ResponsivePicture({
  webpSrcSet,
  jpgSrcSet,
  fallback,
  sizes,
  width,
  height,
  alt,
  className,
  loading = 'lazy',
}: PictureProps) {
  return (
    <picture>
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <source type="image/jpeg" srcSet={jpgSrcSet} sizes={sizes} />
      <img
        className={className}
        src={fallback}
        srcSet={jpgSrcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
      />
    </picture>
  )
}

interface HeroProps {
  id: DemoImageId
  alt?: string
}

/** Full-bleed mood hero under chrome — uses responsive hero cut + transparent overlay. */
export function DemoHeroImage({ id, alt }: HeroProps) {
  const hero = demoHeroSources(id)
  const cut = demoCutouts(id)
  const label = alt ?? DEMO_META[id].alt
  return (
    <div className="demo-hero-image">
      <ResponsivePicture {...hero} alt={label} className="demo-hero-photo" loading="eager" />
      <img className="demo-hero-overlay" src={cut.overlay} alt="" aria-hidden="true" width={360} height={450} />
    </div>
  )
}

interface CardProps {
  id: DemoImageId
  alt?: string
  className?: string
}

export function DemoCardImage({ id, alt, className }: CardProps) {
  const card = demoCardSources(id)
  return (
    <ResponsivePicture
      {...card}
      alt={alt ?? DEMO_META[id].alt}
      className={className ?? 'hub-card-image'}
    />
  )
}

/** CSS variables for page background + band texture from primary cutouts. */
export function demoAtmosphereStyle(id: DemoImageId): CSSProperties {
  const cut = demoCutouts(id)
  return {
    ['--demo-bg-image' as string]: `url(${cut.bg})`,
    ['--demo-band-image' as string]: `url(${cut.band})`,
    ['--demo-detail-image' as string]: `url(${cut.detail})`,
  }
}

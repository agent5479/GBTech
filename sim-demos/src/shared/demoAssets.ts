/** Demo image asset helpers — responsive cards/heroes + cutouts from primary photos. */

export type DemoImageId =
  | 'coastal'
  | 'adventure'
  | 'mohua'
  | 'bayhop'
  | 'bayfix'
  | 'tradeboard'
  | 'canopy'
  | 'orchard'

const CARD_WIDTHS = [480, 800, 1200] as const
const HERO_WIDTHS = [800, 1200, 1600] as const

export function demoAssetBase(id: DemoImageId): string {
  return `${import.meta.env.BASE_URL}images/demos/${id}`
}

/** Marshall / static HTML base (repo-root img/). */
export function staticDemoAssetBase(id: DemoImageId): string {
  return `img/demos/${id}`
}

function srcset(base: string, kind: 'card' | 'hero', widths: readonly number[], ext: 'jpg' | 'webp') {
  return widths.map((w) => `${base}/${kind}-${w}.${ext} ${w}w`).join(', ')
}

export function demoCardSources(id: DemoImageId, base = demoAssetBase(id)) {
  return {
    webpSrcSet: srcset(base, 'card', CARD_WIDTHS, 'webp'),
    jpgSrcSet: srcset(base, 'card', CARD_WIDTHS, 'jpg'),
    fallback: `${base}/card-800.jpg`,
    sizes: '(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 360px',
    width: 800,
    height: 450,
  }
}

export function demoHeroSources(id: DemoImageId, base = demoAssetBase(id)) {
  return {
    webpSrcSet: srcset(base, 'hero', HERO_WIDTHS, 'webp'),
    jpgSrcSet: srcset(base, 'hero', HERO_WIDTHS, 'jpg'),
    fallback: `${base}/hero-1200.jpg`,
    sizes: '100vw',
    width: 1200,
    height: 436,
  }
}

export function demoCutouts(id: DemoImageId, base = demoAssetBase(id)) {
  return {
    bg: `${base}/cutout-bg.webp`,
    bgJpg: `${base}/cutout-bg.jpg`,
    detail: `${base}/cutout-detail.webp`,
    detailJpg: `${base}/cutout-detail.jpg`,
    band: `${base}/cutout-band.webp`,
    bandJpg: `${base}/cutout-band.jpg`,
    overlay: `${base}/cutout-overlay.png`,
  }
}

export const DEMO_META: Record<
  DemoImageId,
  { title: string; alt: string }
> = {
  coastal: { title: 'Coastal Charter', alt: 'Calm skippered yacht on a New Zealand bay' },
  adventure: { title: 'Bay Adventure', alt: 'Active coastal sailing adventure' },
  mohua: { title: 'Mohua Ride', alt: 'Rural private taxi on a Golden Bay country road' },
  bayhop: { title: 'Bay Hop', alt: 'Night rural road trip' },
  bayfix: { title: 'Bay Fix', alt: 'Handyman workshop tools' },
  tradeboard: { title: 'Trade Board', alt: 'Trade van at a residential job site' },
  canopy: { title: 'Canopy Care', alt: 'Fruit tree pruning in an orchard' },
  orchard: { title: 'Orchard Grid', alt: 'Orchard rows of fruit trees' },
}

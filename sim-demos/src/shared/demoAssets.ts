/** Demo image asset helpers — responsive cards + square tiles cut from primaries. */

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
const TILE_WIDTHS = [360, 720] as const
export const DEMO_TILE_COUNT = 4

export function demoAssetBase(id: DemoImageId): string {
  return `${import.meta.env.BASE_URL}images/demos/${id}`
}

/** Marshall / static HTML base (repo-root img/). */
export function staticDemoAssetBase(id: DemoImageId): string {
  return `img/demos/${id}`
}

function srcset(base: string, kind: string, widths: readonly number[], ext: 'jpg' | 'webp') {
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

/** One square tile crop from the primary photo. */
export function demoTileSources(id: DemoImageId, index: number, base = demoAssetBase(id)) {
  const kind = `tile-${index}`
  return {
    webpSrcSet: srcset(base, kind, TILE_WIDTHS, 'webp'),
    jpgSrcSet: srcset(base, kind, TILE_WIDTHS, 'jpg'),
    fallback: `${base}/${kind}-720.jpg`,
    sizes: '(max-width: 640px) 45vw, 180px',
    width: 720,
    height: 720,
  }
}

export function demoTileList(id: DemoImageId, base = demoAssetBase(id)) {
  return Array.from({ length: DEMO_TILE_COUNT }, (_, i) => demoTileSources(id, i, base))
}

export const DEMO_META: Record<DemoImageId, { title: string; alt: string }> = {
  coastal: { title: 'Coastal Charter', alt: 'Calm skippered yacht on a New Zealand bay' },
  adventure: { title: 'Bay Adventure', alt: 'Active coastal sailing adventure' },
  mohua: { title: 'Mohua Ride', alt: 'Rural private taxi on a Golden Bay country road' },
  bayhop: { title: 'Bay Hop', alt: 'Night rural road trip' },
  bayfix: { title: 'Bay Fix', alt: 'Handyman workshop tools' },
  tradeboard: { title: 'Trade Board', alt: 'Trade van at a residential job site' },
  canopy: { title: 'Canopy Care', alt: 'Fruit tree pruning in an orchard' },
  orchard: { title: 'Orchard Grid', alt: 'Orchard rows of fruit trees' },
}

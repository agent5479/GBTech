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
  | 'freshcoat'
  | 'paintboard'
  | 'studioflow'
  | 'classboard'
  | 'shoreride'
  | 'yardboard'
  | 'harbourbook'
  | 'hallboard'
  | 'hiverun'
  | 'apiary'
  | 'carevisit'
  | 'rounds'

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
  // Full primary shrunk (no crop). Height is a CLS hint for common landscape primaries (~3:2).
  return {
    webpSrcSet: srcset(base, 'card', CARD_WIDTHS, 'webp'),
    jpgSrcSet: srcset(base, 'card', CARD_WIDTHS, 'jpg'),
    fallback: `${base}/card-800.jpg`,
    sizes: '(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 360px',
    width: 800,
    height: 533,
  }
}

/** One square tile crop from the primary photo. */
export function demoTileSources(id: DemoImageId, index: number, base = demoAssetBase(id)) {
  const kind = `tile-${index}`
  return {
    webpSrcSet: srcset(base, kind, TILE_WIDTHS, 'webp'),
    jpgSrcSet: srcset(base, kind, TILE_WIDTHS, 'jpg'),
    fallback: `${base}/${kind}-720.jpg`,
    sizes: '(max-width: 640px) 45vw, (max-width: 1100px) 22vw, 250px',
    width: 720,
    height: 720,
  }
}

export function demoTileList(id: DemoImageId, base = demoAssetBase(id)) {
  return Array.from({ length: DEMO_TILE_COUNT }, (_, i) => demoTileSources(id, i, base))
}

/** Fisher–Yates shuffle — new array, original order unchanged. */
export function shuffleTiles<T>(items: readonly T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
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
  freshcoat: { title: 'Fresh Coat', alt: 'Interior wall being painted with a roller' },
  paintboard: { title: 'Paint Board', alt: 'Exterior weatherboards mid-paint job' },
  studioflow: { title: 'Studio Flow', alt: 'Small group fitness class in a bright gym' },
  classboard: { title: 'Class Board', alt: 'Instructor reviewing a class timetable on a board' },
  shoreride: { title: 'Shore Ride', alt: 'Horses on a Golden Bay beach at low tide' },
  yardboard: { title: 'Yard Board', alt: 'Tack and lead ropes in a timber stable yard' },
  harbourbook: { title: 'Harbour Book', alt: 'Community hall hire space ready for booking' },
  hallboard: { title: 'Hall Board', alt: 'Venue staff coordinating room bookings on a board' },
  hiverun: { title: 'Hive Run', alt: 'Beehive clusters in a rural Golden Bay yard' },
  apiary: { title: 'Apiary Board', alt: 'Apiarist planning hive sites and staff runs' },
  carevisit: { title: 'Care Visit', alt: 'Home care visit with notes and care plan' },
  rounds: { title: 'Round Board', alt: 'Care team coordinating a day of client visits' },
}

/** Simulated Golden Bay painter quote engine — m² walls, paint, undercoat, indoor/outdoor. */

export type PaintSetting = 'indoor' | 'outdoor'

export type PaintTypeId = 'standard' | 'premium' | 'exterior' | 'enamel'
export type UndercoatId = 'none' | 'acrylic' | 'stainblock'

export interface WallSurface {
  id: string
  label: string
  widthM: number
  heightM: number
  /** How many identical faces (e.g. two matching bedroom walls). */
  qty: number
}

export interface PaintType {
  id: PaintTypeId
  name: string
  blurb: string
  /** Material cost contribution per m² per finish coat. */
  materialPerM2: number
  finishCoats: number
}

export interface UndercoatOption {
  id: UndercoatId
  name: string
  blurb: string
  materialPerM2: number
}

export interface PaintLine {
  wallId: string
  label: string
  areaM2: number
  labour: number
  materials: number
}

export interface PaintEstimate {
  walls: WallSurface[]
  setting: PaintSetting
  paintTypeId: PaintTypeId
  undercoatId: UndercoatId
  totalAreaM2: number
  labour: number
  materials: number
  setupFee: number
  travelFee: number
  outdoorSurcharge: number
  lines: PaintLine[]
  mid: number
  low: number
  high: number
}

export const PAINT_TYPES: PaintType[] = [
  {
    id: 'standard',
    name: 'Standard acrylic',
    blurb: 'Everyday interior walls and ceilings — solid coverage, washable.',
    materialPerM2: 11,
    finishCoats: 2,
  },
  {
    id: 'premium',
    name: 'Premium low-VOC',
    blurb: 'Higher hide and scrub resistance — living areas and rentals.',
    materialPerM2: 19,
    finishCoats: 2,
  },
  {
    id: 'exterior',
    name: 'Exterior weathercoat',
    blurb: 'UV and rain-ready for weatherboards, fascia, and outdoor joinery.',
    materialPerM2: 16,
    finishCoats: 2,
  },
  {
    id: 'enamel',
    name: 'Hard-wearing enamel',
    blurb: 'Doors, trims, wet areas — tougher film, slower dry.',
    materialPerM2: 24,
    finishCoats: 2,
  },
]

export const UNDERCOATS: UndercoatOption[] = [
  {
    id: 'none',
    name: 'No undercoat',
    blurb: 'Repaint over sound existing paint in good condition.',
    materialPerM2: 0,
  },
  {
    id: 'acrylic',
    name: 'Acrylic sealer',
    blurb: 'New gib, patched plaster, or colour change — seals and evens.',
    materialPerM2: 8,
  },
  {
    id: 'stainblock',
    name: 'Stain blocker',
    blurb: 'Water marks, nicotine, tannin bleed — locks stains before topcoat.',
    materialPerM2: 14,
  },
]

const LABOUR_INDOOR = 18
const LABOUR_OUTDOOR = 26
const SETUP_FEE = 85
const TRAVEL_FEE = 35
const OUTDOOR_SURCHARGE_RATE = 0.12

function roundBracket(n: number) {
  return Math.round(n * 2) / 2
}

function roundMoney(n: number) {
  return Math.round(n * 100) / 100
}

export function paintTypeById(id: PaintTypeId): PaintType | undefined {
  return PAINT_TYPES.find((p) => p.id === id)
}

export function undercoatById(id: UndercoatId): UndercoatOption | undefined {
  return UNDERCOATS.find((u) => u.id === id)
}

export function wallAreaM2(wall: WallSurface): number {
  const w = Math.max(0, wall.widthM)
  const h = Math.max(0, wall.heightM)
  const q = Math.max(1, Math.round(wall.qty) || 1)
  return roundMoney(w * h * q)
}

let wallSeq = 0

export function newWall(partial?: Partial<WallSurface>): WallSurface {
  wallSeq += 1
  return {
    id: `wall-${wallSeq}`,
    label: partial?.label ?? 'Wall',
    widthM: partial?.widthM ?? 3.6,
    heightM: partial?.heightM ?? 2.4,
    qty: partial?.qty ?? 1,
  }
}

/**
 * Ballpark quote from measured walls + paint system.
 * Simulated Golden Bay painter rates — not a fixed invoice.
 */
export function estimatePaintJob(
  walls: WallSurface[],
  setting: PaintSetting,
  paintTypeId: PaintTypeId,
  undercoatId: UndercoatId,
): PaintEstimate | null {
  const paint = paintTypeById(paintTypeId)
  const undercoat = undercoatById(undercoatId)
  if (!paint || !undercoat) return null

  const usable = walls.filter((w) => wallAreaM2(w) > 0)
  if (!usable.length) return null

  const labourRate = setting === 'outdoor' ? LABOUR_OUTDOOR : LABOUR_INDOOR
  const lines: PaintLine[] = usable.map((wall) => {
    const areaM2 = wallAreaM2(wall)
    const labour = roundMoney(areaM2 * labourRate)
    const materials = roundMoney(
      areaM2 * (paint.materialPerM2 * paint.finishCoats + undercoat.materialPerM2),
    )
    return { wallId: wall.id, label: wall.label, areaM2, labour, materials }
  })

  const totalAreaM2 = roundMoney(lines.reduce((s, l) => s + l.areaM2, 0))
  const labour = roundMoney(lines.reduce((s, l) => s + l.labour, 0))
  const materials = roundMoney(lines.reduce((s, l) => s + l.materials, 0))
  const setupFee = SETUP_FEE
  const travelFee = TRAVEL_FEE
  const sub = labour + materials + setupFee + travelFee
  const outdoorSurcharge =
    setting === 'outdoor' ? roundMoney(sub * OUTDOOR_SURCHARGE_RATE) : 0
  const mid = roundMoney(sub + outdoorSurcharge)
  const low = roundBracket(mid * 0.9)
  const high = roundBracket(mid * 1.12)

  return {
    walls: usable,
    setting,
    paintTypeId,
    undercoatId,
    totalAreaM2,
    labour,
    materials,
    setupFee,
    travelFee,
    outdoorSurcharge,
    lines,
    mid,
    low,
    high,
  }
}

export function formatPaintBracket(est: PaintEstimate): string {
  if (est.low === est.high) return `$${est.low.toFixed(2)}`
  return `$${est.low.toFixed(2)}–$${est.high.toFixed(2)}`
}

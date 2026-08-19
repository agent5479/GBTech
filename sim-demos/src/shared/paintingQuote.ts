/** Golden Bay painter ballpark — indoor rooms vs exterior cladding, corrugate, and roof. */

export type PaintSetting = 'indoor' | 'outdoor'

export type PaintTypeId = 'standard' | 'premium' | 'exterior' | 'enamel' | 'roof'
export type UndercoatId = 'none' | 'acrylic' | 'stainblock' | 'metal'
export type SurfaceKindId =
  | 'wall'
  | 'ceiling'
  | 'skirting'
  | 'window'
  | 'detailing'
  | 'weatherboard'
  | 'corrugate'
  | 'roof'
  | 'fascia'
export type RoofPitchId = 'gentle' | 'typical' | 'steep'

export interface PaintSurface {
  id: string
  label: string
  widthM: number
  heightM: number
  qty: number
  kind: SurfaceKindId
  pitchId?: RoofPitchId
}

export interface SurfaceKind {
  id: SurfaceKindId
  name: string
  blurb: string
  setting: PaintSetting
  /** Extra paintable area vs the measured rectangle (laps, corrugation). */
  areaFactor: number
  /** Extra labour vs a flat indoor wall. */
  labourFactor: number
  dimA: string
  dimB: string
  maxA: number
  maxB: number
  defaultA: number
  defaultB: number
}

export interface RoofPitch {
  id: RoofPitchId
  name: string
  blurb: string
  /** Plan footprint → slope area. */
  factor: number
}

export interface PaintType {
  id: PaintTypeId
  name: string
  blurb: string
  materialPerM2: number
  finishCoats: number
  setting: PaintSetting | 'both'
}

export interface UndercoatOption {
  id: UndercoatId
  name: string
  blurb: string
  materialPerM2: number
  setting: PaintSetting | 'both'
}

export interface PaintLine {
  surfaceId: string
  label: string
  kind: SurfaceKindId
  measuredM2: number
  paintableM2: number
  labour: number
  materials: number
}

export interface PaintEstimate {
  surfaces: PaintSurface[]
  setting: PaintSetting
  paintTypeId: PaintTypeId
  undercoatId: UndercoatId
  measuredM2: number
  paintableM2: number
  labour: number
  materials: number
  setupFee: number
  travelFee: number
  outdoorSurcharge: number
  roofAccessFee: number
  lines: PaintLine[]
  mid: number
  low: number
  high: number
}

export const SURFACE_KINDS: SurfaceKind[] = [
  {
    id: 'wall',
    name: 'Wall',
    blurb: 'Indoor wall face — measured width × height.',
    setting: 'indoor',
    areaFactor: 1,
    labourFactor: 1,
    dimA: 'Width (m)',
    dimB: 'Height (m)',
    maxA: 20,
    maxB: 6,
    defaultA: 3.6,
    defaultB: 2.4,
  },
  {
    id: 'ceiling',
    name: 'Ceiling',
    blurb: 'Overhead work — same room footprint, a bit slower.',
    setting: 'indoor',
    areaFactor: 1,
    labourFactor: 1.18,
    dimA: 'Length (m)',
    dimB: 'Width (m)',
    maxA: 20,
    maxB: 20,
    defaultA: 3.5,
    defaultB: 2.75,
  },
  {
    id: 'skirting',
    name: 'Skirting',
    blurb: 'Skirting boards — measure run length × board height.',
    setting: 'indoor',
    areaFactor: 1,
    labourFactor: 2.5,
    dimA: 'Length (m)',
    dimB: 'Height (m)',
    maxA: 80,
    maxB: 0.4,
    defaultA: 12.5,
    defaultB: 0.1,
  },
  {
    id: 'window',
    name: 'Windows',
    blurb: 'Frames, sashes, and reveals — enter opening size; paint area is the frame band.',
    setting: 'indoor',
    areaFactor: 0.4,
    labourFactor: 2.5,
    dimA: 'Width (m)',
    dimB: 'Height (m)',
    maxA: 4,
    maxB: 3,
    defaultA: 1.2,
    defaultB: 1,
  },
  {
    id: 'detailing',
    name: 'Detailing / trim',
    blurb: 'Scotia, architraves, doors, and cut-in trim — length × face width.',
    setting: 'indoor',
    areaFactor: 1,
    labourFactor: 2.3,
    dimA: 'Length (m)',
    dimB: 'Face (m)',
    maxA: 80,
    maxB: 0.5,
    defaultA: 12.5,
    defaultB: 0.06,
  },
  {
    id: 'weatherboard',
    name: 'Weatherboards',
    blurb: 'Timber cladding — extra edge work and paint in the laps.',
    setting: 'outdoor',
    areaFactor: 1.12,
    labourFactor: 1.3,
    dimA: 'Width (m)',
    dimB: 'Height (m)',
    maxA: 30,
    maxB: 8,
    defaultA: 8,
    defaultB: 2.7,
  },
  {
    id: 'corrugate',
    name: 'Corrugated cladding',
    blurb: 'Wall iron — ridges add paint area beyond the flat face.',
    setting: 'outdoor',
    areaFactor: 1.22,
    labourFactor: 1.35,
    dimA: 'Width (m)',
    dimB: 'Height (m)',
    maxA: 30,
    maxB: 8,
    defaultA: 7,
    defaultB: 2.7,
  },
  {
    id: 'roof',
    name: 'Corrugated roof',
    blurb: 'Roof iron — corrugation, pitch, height, and slower going.',
    setting: 'outdoor',
    areaFactor: 1.25,
    labourFactor: 1.75,
    dimA: 'Length (m)',
    dimB: 'Span (m)',
    maxA: 30,
    maxB: 16,
    defaultA: 9,
    defaultB: 6,
  },
  {
    id: 'fascia',
    name: 'Fascia / soffit',
    blurb: 'Flat outdoor trim — eaves, barge, and soffit boards.',
    setting: 'outdoor',
    areaFactor: 1,
    labourFactor: 1.15,
    dimA: 'Length (m)',
    dimB: 'Height (m)',
    maxA: 40,
    maxB: 1.5,
    defaultA: 12,
    defaultB: 0.25,
  },
]

export const INDOOR_SURFACE_KINDS = SURFACE_KINDS.filter((k) => k.setting === 'indoor')
export const EXTERIOR_SURFACE_KINDS = SURFACE_KINDS.filter((k) => k.setting === 'outdoor')

export const ROOF_PITCHES: RoofPitch[] = [
  {
    id: 'gentle',
    name: 'Gentle (~15°)',
    blurb: 'Low pitch or near-flat iron.',
    factor: 1.04,
  },
  {
    id: 'typical',
    name: 'Typical (~30°)',
    blurb: 'Most Golden Bay houses.',
    factor: 1.15,
  },
  {
    id: 'steep',
    name: 'Steep (~45°+)',
    blurb: 'Steep iron — more area and slower work.',
    factor: 1.41,
  },
]

export const PAINT_TYPES: PaintType[] = [
  {
    id: 'standard',
    name: 'Standard acrylic',
    blurb: 'Everyday interior walls and ceilings — solid coverage, washable.',
    materialPerM2: 4,
    finishCoats: 2,
    setting: 'indoor',
  },
  {
    id: 'premium',
    name: 'Premium low-VOC',
    blurb: 'Higher hide and scrub resistance — living areas and rentals.',
    materialPerM2: 7,
    finishCoats: 2,
    setting: 'indoor',
  },
  {
    id: 'exterior',
    name: 'Exterior weathercoat',
    blurb: 'UV and rain-ready for weatherboards, fascia, and outdoor joinery.',
    materialPerM2: 5,
    finishCoats: 2,
    setting: 'outdoor',
  },
  {
    id: 'roof',
    name: 'Roof coating',
    blurb: 'High-build roof paint for corrugate iron — UV, rain, and chalking.',
    materialPerM2: 7,
    finishCoats: 2,
    setting: 'outdoor',
  },
  {
    id: 'enamel',
    name: 'Hard-wearing enamel',
    blurb: 'Doors, trims, wet areas — tougher film, slower dry.',
    materialPerM2: 8,
    finishCoats: 2,
    setting: 'both',
  },
]

export const UNDERCOATS: UndercoatOption[] = [
  {
    id: 'none',
    name: 'No undercoat',
    blurb: 'Repaint over sound existing paint in good condition.',
    materialPerM2: 0,
    setting: 'both',
  },
  {
    id: 'acrylic',
    name: 'Acrylic sealer',
    blurb: 'New gib, patched plaster, or colour change — seals and evens.',
    materialPerM2: 2,
    setting: 'both',
  },
  {
    id: 'stainblock',
    name: 'Stain blocker',
    blurb: 'Water marks, nicotine, tannin bleed — locks stains before topcoat.',
    materialPerM2: 5,
    setting: 'both',
  },
  {
    id: 'metal',
    name: 'Metal primer',
    blurb: 'Bare or rusty corrugate and roof iron — keys the topcoat.',
    materialPerM2: 4,
    setting: 'outdoor',
  },
]

/** Indoor wall labour $/m² — tuned so ~30 m² standard + sealer ≈ $900 all-in. */
const LABOUR_INDOOR = 16
const LABOUR_OUTDOOR = 23
const SETUP_FEE = 85
const TRAVEL_FEE = 35
const OUTDOOR_SURCHARGE_RATE = 0.12
const ROOF_ACCESS_FEE = 220

function roundBracket(n: number) {
  return Math.round(n * 2) / 2
}

function roundMoney(n: number) {
  return Math.round(n * 100) / 100
}

export function surfaceKindById(id: SurfaceKindId): SurfaceKind | undefined {
  return SURFACE_KINDS.find((k) => k.id === id)
}

export function roofPitchById(id: RoofPitchId | undefined): RoofPitch | undefined {
  return ROOF_PITCHES.find((p) => p.id === id)
}

export function paintTypeById(id: PaintTypeId): PaintType | undefined {
  return PAINT_TYPES.find((p) => p.id === id)
}

export function undercoatById(id: UndercoatId): UndercoatOption | undefined {
  return UNDERCOATS.find((u) => u.id === id)
}

export function paintsFor(setting: PaintSetting): PaintType[] {
  return PAINT_TYPES.filter((p) => p.setting === setting || p.setting === 'both')
}

export function undercoatsFor(setting: PaintSetting): UndercoatOption[] {
  return UNDERCOATS.filter((u) => u.setting === setting || u.setting === 'both')
}

export function measuredAreaM2(surface: PaintSurface): number {
  const w = Math.max(0, surface.widthM)
  const h = Math.max(0, surface.heightM)
  const q = Math.max(1, Math.round(surface.qty) || 1)
  return roundMoney(w * h * q)
}

export function pitchFactor(surface: PaintSurface): number {
  if (surface.kind !== 'roof') return 1
  return roofPitchById(surface.pitchId ?? 'typical')?.factor ?? 1.15
}

export function paintableAreaM2(surface: PaintSurface): number {
  const kind = surfaceKindById(surface.kind)
  if (!kind) return 0
  return roundMoney(measuredAreaM2(surface) * kind.areaFactor * pitchFactor(surface))
}

export function areaNote(surface: PaintSurface): string | undefined {
  const kind = surfaceKindById(surface.kind)
  if (!kind) return undefined
  const pitch = surface.kind === 'roof' ? roofPitchById(surface.pitchId ?? 'typical') : undefined
  const bits: string[] = []
  if (kind.areaFactor !== 1) {
    bits.push(
      surface.kind === 'window'
        ? `frames & reveals ×${kind.areaFactor}`
        : surface.kind === 'corrugate' || surface.kind === 'roof'
          ? `corrugation ×${kind.areaFactor}`
          : `laps ×${kind.areaFactor}`,
    )
  }
  if (pitch) bits.push(`${pitch.name.split(' ')[0].toLowerCase()} pitch ×${pitch.factor}`)
  return bits.length ? bits.join(' · ') : undefined
}

let surfaceSeq = 0

export function newSurface(partial?: Partial<PaintSurface>): PaintSurface {
  surfaceSeq += 1
  const kindId = partial?.kind ?? 'wall'
  const meta = surfaceKindById(kindId)
  return {
    id: `surface-${surfaceSeq}`,
    label: partial?.label ?? meta?.name ?? 'Surface',
    widthM: partial?.widthM ?? meta?.defaultA ?? 3.6,
    heightM: partial?.heightM ?? meta?.defaultB ?? 2.4,
    qty: partial?.qty ?? 1,
    kind: kindId,
    pitchId: kindId === 'roof' ? (partial?.pitchId ?? 'typical') : undefined,
  }
}

/**
 * Ballpark from measured surfaces + paint system.
 * Simulated Golden Bay painter rates — not a fixed invoice.
 */
export function estimatePaintJob(
  surfaces: PaintSurface[],
  paintTypeId: PaintTypeId,
  undercoatId: UndercoatId,
  setting: PaintSetting,
): PaintEstimate | null {
  const paint = paintTypeById(paintTypeId)
  const undercoat = undercoatById(undercoatId)
  if (!paint || !undercoat) return null

  const usable = surfaces.filter((s) => paintableAreaM2(s) > 0)
  if (!usable.length) return null

  const baseLabour = setting === 'outdoor' ? LABOUR_OUTDOOR : LABOUR_INDOOR
  const lines: PaintLine[] = usable.map((surface) => {
    const kind = surfaceKindById(surface.kind)
    const measuredM2 = measuredAreaM2(surface)
    const paintableM2 = paintableAreaM2(surface)
    const labour = roundMoney(paintableM2 * baseLabour * (kind?.labourFactor ?? 1))
    const materials = roundMoney(
      paintableM2 * (paint.materialPerM2 * paint.finishCoats + undercoat.materialPerM2),
    )
    return {
      surfaceId: surface.id,
      label: surface.label,
      kind: surface.kind,
      measuredM2,
      paintableM2,
      labour,
      materials,
    }
  })

  const measuredM2 = roundMoney(lines.reduce((s, l) => s + l.measuredM2, 0))
  const paintableM2 = roundMoney(lines.reduce((s, l) => s + l.paintableM2, 0))
  const labour = roundMoney(lines.reduce((s, l) => s + l.labour, 0))
  const materials = roundMoney(lines.reduce((s, l) => s + l.materials, 0))
  const setupFee = SETUP_FEE
  const travelFee = TRAVEL_FEE
  const roofAccessFee = usable.some((s) => s.kind === 'roof') ? ROOF_ACCESS_FEE : 0
  const sub = labour + materials + setupFee + travelFee + roofAccessFee
  const outdoorSurcharge =
    setting === 'outdoor' ? roundMoney(sub * OUTDOOR_SURCHARGE_RATE) : 0
  const mid = roundMoney(sub + outdoorSurcharge)
  const low = roundBracket(mid * 0.9)
  const high = roundBracket(mid * 1.12)

  return {
    surfaces: usable,
    setting,
    paintTypeId,
    undercoatId,
    measuredM2,
    paintableM2,
    labour,
    materials,
    setupFee,
    travelFee,
    outdoorSurcharge,
    roofAccessFee,
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

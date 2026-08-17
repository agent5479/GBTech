/** Simulated Golden Bay painter quote engine — indoor rooms vs exterior cladding/roof. */

export type PaintSetting = 'indoor' | 'outdoor'

export type IndoorKind = 'wall' | 'ceiling' | 'skirting' | 'window' | 'detailing'
export type ExteriorKind = 'weatherboard' | 'corrugate' | 'roof' | 'fascia'
export type SurfaceKind = IndoorKind | ExteriorKind
export type RoofPitch = 'gentle' | 'typical' | 'steep'

export type PaintTypeId = 'standard' | 'premium' | 'exterior' | 'enamel' | 'roofcoat'
export type UndercoatId = 'none' | 'acrylic' | 'stainblock' | 'metalprimer'

export interface PaintSurface {
  id: string
  label: string
  kind: SurfaceKind
  /** First measure (width, length, or roof length). */
  widthM: number
  /** Second measure (height, width, face, or roof span). */
  heightM: number
  qty: number
  pitch?: RoofPitch
}

/** @deprecated Use PaintSurface — kept so older names still type-check. */
export type WallSurface = PaintSurface

export interface PaintType {
  id: PaintTypeId
  name: string
  blurb: string
  materialPerM2: number
  finishCoats: number
}

export interface UndercoatOption {
  id: UndercoatId
  name: string
  blurb: string
  materialPerM2: number
}

export interface KindMeta {
  id: SurfaceKind
  name: string
  dimA: string
  dimB: string
  addLabel: string
}

export interface PaintLine {
  wallId: string
  label: string
  areaM2: number
  measuredM2: number
  labour: number
  materials: number
}

export interface PaintEstimate {
  walls: PaintSurface[]
  setting: PaintSetting
  paintTypeId: PaintTypeId
  undercoatId: UndercoatId
  totalAreaM2: number
  measuredAreaM2: number
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

export const INDOOR_KINDS: KindMeta[] = [
  { id: 'wall', name: 'Wall', dimA: 'Width (m)', dimB: 'Height (m)', addLabel: '+ Wall' },
  { id: 'ceiling', name: 'Ceiling', dimA: 'Length (m)', dimB: 'Width (m)', addLabel: '+ Ceiling' },
  { id: 'skirting', name: 'Skirting', dimA: 'Length (m)', dimB: 'Height (m)', addLabel: '+ Skirting' },
  { id: 'window', name: 'Windows', dimA: 'Width (m)', dimB: 'Height (m)', addLabel: '+ Windows' },
  { id: 'detailing', name: 'Detailing / trim', dimA: 'Length (m)', dimB: 'Face (m)', addLabel: '+ Detailing' },
]

export const EXTERIOR_KINDS: KindMeta[] = [
  { id: 'weatherboard', name: 'Weatherboards', dimA: 'Width', dimB: 'Height', addLabel: '+ Weatherboards' },
  { id: 'corrugate', name: 'Corrugated cladding', dimA: 'Width', dimB: 'Height', addLabel: '+ Corrugate' },
  { id: 'roof', name: 'Corrugated roof', dimA: 'Length', dimB: 'Span', addLabel: '+ Roof' },
  { id: 'fascia', name: 'Fascia / soffit', dimA: 'Length', dimB: 'Face', addLabel: '+ Fascia' },
]

export const PITCH_OPTIONS: { id: RoofPitch; name: string }[] = [
  { id: 'gentle', name: 'Gentle (~15°)' },
  { id: 'typical', name: 'Typical (~30°)' },
  { id: 'steep', name: 'Steep (~45°+)' },
]

const PROFILE: Partial<Record<SurfaceKind, number>> = {
  weatherboard: 1.15,
  corrugate: 1.22,
  fascia: 1.08,
}

const PITCH_SLOPE: Record<RoofPitch, number> = {
  gentle: 1.035,
  typical: 1.155,
  steep: 1.414,
}

/** Window openings: frames paint less than the hole; also deducted from walls in running area. */
const WINDOW_PAINT_FACTOR = 0.35

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
    id: 'enamel',
    name: 'Hard-wearing enamel',
    blurb: 'Doors, trims, wet areas — tougher film, slower dry.',
    materialPerM2: 24,
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
    id: 'roofcoat',
    name: 'Roof coating',
    blurb: 'Roof iron usually wants a roof coating rather than wall weathercoat.',
    materialPerM2: 18,
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
  {
    id: 'metalprimer',
    name: 'Metal primer',
    blurb: 'Corrugate and roof iron — zinc or etch primer before the finish.',
    materialPerM2: 12,
  },
]

export const INDOOR_PAINT_TYPES = PAINT_TYPES.filter((p) =>
  ['standard', 'premium', 'enamel'].includes(p.id),
)
export const EXTERIOR_PAINT_TYPES = PAINT_TYPES.filter((p) =>
  ['exterior', 'roofcoat', 'enamel'].includes(p.id),
)
export const INDOOR_UNDERCOATS = UNDERCOATS.filter((u) => u.id !== 'metalprimer')
export const EXTERIOR_UNDERCOATS = UNDERCOATS

const LABOUR_INDOOR = 18
const LABOUR_OUTDOOR = 26
const LABOUR_ROOF = 34
const SETUP_FEE = 85
const TRAVEL_FEE = 35
const OUTDOOR_SURCHARGE_RATE = 0.12

function roundBracket(n: number) {
  return Math.round(n * 2) / 2
}

function roundMoney(n: number) {
  return Math.round(n * 100) / 100
}

export function kindMeta(kind: SurfaceKind): KindMeta {
  return (
    INDOOR_KINDS.find((k) => k.id === kind) ??
    EXTERIOR_KINDS.find((k) => k.id === kind) ??
    INDOOR_KINDS[0]
  )
}

export function paintTypeById(id: PaintTypeId): PaintType | undefined {
  return PAINT_TYPES.find((p) => p.id === id)
}

export function undercoatById(id: UndercoatId): UndercoatOption | undefined {
  return UNDERCOATS.find((u) => u.id === id)
}

export function measuredAreaM2(surface: PaintSurface): number {
  const a = Math.max(0, surface.widthM)
  const b = Math.max(0, surface.heightM)
  const q = Math.max(1, Math.round(surface.qty) || 1)
  return roundMoney(a * b * q)
}

/** Flat measure — alias used by older call sites. */
export function wallAreaM2(surface: PaintSurface): number {
  return measuredAreaM2(surface)
}

export function paintedAreaM2(surface: PaintSurface): number {
  const measured = measuredAreaM2(surface)
  if (surface.kind === 'window') return roundMoney(measured * WINDOW_PAINT_FACTOR)
  if (surface.kind === 'roof') {
    const pitch = surface.pitch ?? 'typical'
    return roundMoney(measured * PITCH_SLOPE[pitch])
  }
  const profile = PROFILE[surface.kind] ?? 1
  return roundMoney(measured * profile)
}

let surfaceSeq = 0

function nextId() {
  surfaceSeq += 1
  return `surf-${surfaceSeq}`
}

const DEFAULTS: Record<SurfaceKind, { label: string; widthM: number; heightM: number; qty: number; pitch?: RoofPitch }> =
  {
    wall: { label: 'Wall', widthM: 3.6, heightM: 2.4, qty: 1 },
    ceiling: { label: 'Ceiling', widthM: 3.5, heightM: 2.75, qty: 1 },
    skirting: { label: 'Skirting', widthM: 12.5, heightM: 0.1, qty: 1 },
    window: { label: 'Windows', widthM: 1.2, heightM: 1, qty: 1 },
    detailing: { label: 'Scotia / trim', widthM: 12.5, heightM: 0.06, qty: 1 },
    weatherboard: { label: 'Weatherboards', widthM: 8, heightM: 2.7, qty: 1 },
    corrugate: { label: 'Corrugated cladding', widthM: 6, heightM: 2.7, qty: 1 },
    roof: { label: 'Corrugate roof', widthM: 9, heightM: 6, qty: 1, pitch: 'typical' },
    fascia: { label: 'Fascia / soffit', widthM: 10, heightM: 0.25, qty: 1 },
  }

export function newIndoorSurface(kind: IndoorKind, partial?: Partial<PaintSurface>): PaintSurface {
  const d = DEFAULTS[kind]
  return {
    id: partial?.id ?? nextId(),
    kind,
    label: partial?.label ?? d.label,
    widthM: partial?.widthM ?? d.widthM,
    heightM: partial?.heightM ?? d.heightM,
    qty: partial?.qty ?? d.qty,
  }
}

export function newExteriorSurface(kind: ExteriorKind, partial?: Partial<PaintSurface>): PaintSurface {
  const d = DEFAULTS[kind]
  return {
    id: partial?.id ?? nextId(),
    kind,
    label: partial?.label ?? d.label,
    widthM: partial?.widthM ?? d.widthM,
    heightM: partial?.heightM ?? d.heightM,
    qty: partial?.qty ?? d.qty,
    pitch: kind === 'roof' ? (partial?.pitch ?? d.pitch ?? 'typical') : undefined,
  }
}

export function newWall(partial?: Partial<PaintSurface>): PaintSurface {
  return newIndoorSurface('wall', partial)
}

export function defaultIndoorSurfaces(): PaintSurface[] {
  return [
    newIndoorSurface('wall', { label: 'Lounge — long walls', widthM: 3.5, heightM: 2.4, qty: 2 }),
    newIndoorSurface('wall', { label: 'Lounge — end walls', widthM: 2.75, heightM: 2.4, qty: 2 }),
    newIndoorSurface('ceiling', { label: 'Lounge — ceiling', widthM: 3.5, heightM: 2.75, qty: 1 }),
    newIndoorSurface('skirting', { label: 'Lounge — skirting', widthM: 12.5, heightM: 0.1, qty: 1 }),
    newIndoorSurface('window', { label: 'Lounge — windows', widthM: 1.2, heightM: 1, qty: 3 }),
    newIndoorSurface('detailing', { label: 'Lounge — scotia / trim', widthM: 12.5, heightM: 0.06, qty: 1 }),
  ]
}

export function defaultExteriorSurfaces(): PaintSurface[] {
  return [
    newExteriorSurface('weatherboard', { label: 'Weatherboards — street', widthM: 8, heightM: 2.7, qty: 1 }),
    newExteriorSurface('weatherboard', { label: 'Weatherboards — side', widthM: 5.5, heightM: 2.7, qty: 1 }),
    newExteriorSurface('roof', { label: 'Corrugate roof', widthM: 9, heightM: 6, qty: 1, pitch: 'typical' }),
  ]
}

/**
 * Ballpark quote from measured surfaces + paint system.
 * Simulated Golden Bay painter rates — not a fixed invoice.
 */
export function estimatePaintJob(
  walls: PaintSurface[],
  setting: PaintSetting,
  paintTypeId: PaintTypeId,
  undercoatId: UndercoatId,
): PaintEstimate | null {
  const paint = paintTypeById(paintTypeId)
  const undercoat = undercoatById(undercoatId)
  if (!paint || !undercoat) return null

  const allowedKinds = new Set(
    (setting === 'indoor' ? INDOOR_KINDS : EXTERIOR_KINDS).map((k) => k.id),
  )
  const usable = walls.filter((w) => allowedKinds.has(w.kind) && measuredAreaM2(w) > 0)
  if (!usable.length) return null

  const windowOpenings = roundMoney(
    usable.filter((s) => s.kind === 'window').reduce((s, w) => s + measuredAreaM2(w), 0),
  )

  const lines: PaintLine[] = usable.map((surface) => {
    let areaM2 = paintedAreaM2(surface)
    if (surface.kind === 'wall' && windowOpenings > 0) {
      const wallShare = measuredAreaM2(surface)
      const allWalls = usable
        .filter((s) => s.kind === 'wall')
        .reduce((s, w) => s + measuredAreaM2(w), 0)
      const deduct = allWalls > 0 ? windowOpenings * (wallShare / allWalls) : 0
      areaM2 = roundMoney(Math.max(0.1, areaM2 - deduct))
    }
    const labourRate =
      surface.kind === 'roof' ? LABOUR_ROOF : setting === 'outdoor' ? LABOUR_OUTDOOR : LABOUR_INDOOR
    const labour = roundMoney(areaM2 * labourRate)
    const materials = roundMoney(
      areaM2 * (paint.materialPerM2 * paint.finishCoats + undercoat.materialPerM2),
    )
    return {
      wallId: surface.id,
      label: surface.label,
      areaM2,
      measuredM2: measuredAreaM2(surface),
      labour,
      materials,
    }
  })

  const totalAreaM2 = roundMoney(lines.reduce((s, l) => s + l.areaM2, 0))
  const measuredArea = roundMoney(lines.reduce((s, l) => s + l.measuredM2, 0))
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
    measuredAreaM2: measuredArea,
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

export function formatAreaLine(est: PaintEstimate): string {
  if (est.totalAreaM2 === est.measuredAreaM2) return `${est.totalAreaM2} m²`
  return `${est.totalAreaM2} m² (${est.measuredAreaM2} m² measured)`
}

export function estimateClipboardText(est: PaintEstimate): string {
  const paint = paintTypeById(est.paintTypeId)?.name ?? est.paintTypeId
  const under = undercoatById(est.undercoatId)?.name ?? ''
  const lines = est.lines.map((l) => `• ${l.label}: ${l.areaM2} m²`).join('\n')
  return [
    `Ballpark ${formatPaintBracket(est)}`,
    `Painted ${formatAreaLine(est)}`,
    `System: ${paint}${est.undercoatId !== 'none' ? ` + ${under}` : ''}`,
    lines,
    'Impression only — simulated Golden Bay painter rates, not a confirmed quote.',
  ].join('\n')
}

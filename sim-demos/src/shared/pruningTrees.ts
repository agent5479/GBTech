export interface PruningTreeType {
  id: string
  name: string
  blurb: string
  unitLabel: 'tree' | 'm'
  pricePerUnit: number
}

export interface PruningAddOn {
  id: string
  name: string
  price: number
}

export interface PruningEstimate {
  lines: { id: string; name: string; qty: number; unitLabel: string; lineTotal: number }[]
  callOut: number
  addOnsTotal: number
  mid: number
  low: number
  high: number
  totalQty: number
}

export const PRUNING_TREES: PruningTreeType[] = [
  {
    id: 'apple',
    name: 'Apple',
    blurb: 'Seasonal prune — fruiting wood and shape.',
    unitLabel: 'tree',
    pricePerUnit: 55,
  },
  {
    id: 'citrus',
    name: 'Citrus',
    blurb: 'Lemon, orange, mandarin — light canopy work.',
    unitLabel: 'tree',
    pricePerUnit: 50,
  },
  {
    id: 'stone',
    name: 'Stone fruit',
    blurb: 'Plum, peach, apricot — winter prune.',
    unitLabel: 'tree',
    pricePerUnit: 58,
  },
  {
    id: 'native',
    name: 'Native specimen',
    blurb: 'Kōwhai, cabbage tree, small native canopy.',
    unitLabel: 'tree',
    pricePerUnit: 70,
  },
  {
    id: 'hedge',
    name: 'Hedge / row',
    blurb: 'Trim by the metre along a hedge line.',
    unitLabel: 'm',
    pricePerUnit: 18,
  },
  {
    id: 'shade',
    name: 'Large shade tree',
    blurb: 'Crown lift / deadwood (ground-based).',
    unitLabel: 'tree',
    pricePerUnit: 145,
  },
  {
    id: 'rose',
    name: 'Rose / climber',
    blurb: 'Roses, wisteria, espalier tidy-up.',
    unitLabel: 'tree',
    pricePerUnit: 35,
  },
]

export const PRUNING_ADDONS: PruningAddOn[] = [
  { id: 'ladder', name: 'Extension ladder access', price: 25 },
  { id: 'chipper', name: 'On-site chipper', price: 60 },
]

export const PRUNING_FRUIT_ADDS: { id: string; label: string }[] = [
  { id: 'apple', label: '+ Apple' },
  { id: 'citrus', label: '+ Citrus' },
  { id: 'stone', label: '+ Stone fruit' },
]

const CALL_OUT = 40

function roundBracket(n: number) {
  return Math.round(n * 2) / 2
}

export function treeById(id: string): PruningTreeType | undefined {
  return PRUNING_TREES.find((t) => t.id === id)
}

/** qtyByType: map of tree type id → quantity (0 = not selected). */
export function estimatePruning(
  qtyByType: Record<string, number>,
  addOnIds: string[] = []
): PruningEstimate | null {
  const lines = PRUNING_TREES.map((t) => {
    const qty = Math.max(0, Math.floor(qtyByType[t.id] ?? 0))
    if (!qty) return null
    return {
      id: t.id,
      name: t.name,
      qty,
      unitLabel: t.unitLabel,
      lineTotal: Math.round(qty * t.pricePerUnit * 100) / 100,
    }
  }).filter(Boolean) as PruningEstimate['lines']

  const totalQty = lines.reduce((s, l) => s + l.qty, 0)
  if (!totalQty) return null

  const treesTotal = lines.reduce((s, l) => s + l.lineTotal, 0)
  const addOnsTotal = PRUNING_ADDONS.filter((a) => addOnIds.includes(a.id)).reduce(
    (s, a) => s + a.price,
    0
  )
  const mid = Math.round((treesTotal + CALL_OUT + addOnsTotal) * 100) / 100
  const low = roundBracket(mid * 0.9)
  const high = roundBracket(mid * 1.12)

  return {
    lines,
    callOut: CALL_OUT,
    addOnsTotal,
    mid,
    low,
    high,
    totalQty,
  }
}

export function formatPruningBracket(est: PruningEstimate): string {
  if (est.low === est.high) return `$${est.low.toFixed(2)}`
  return `$${est.low.toFixed(2)}–$${est.high.toFixed(2)}`
}

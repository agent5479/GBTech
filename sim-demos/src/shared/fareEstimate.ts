export type VehicleTier = 'standard' | 'van'

export interface FareBreakdown {
  km: number
  passengers: number
  base: number
  perKm: number
  distanceCharge: number
  peakSurcharge: number
  passengerSurcharge: number
  vehicleMultiplier: number
  /** Midpoint estimate before bracket spread. */
  mid: number
  /** Estimated cost bracket (simulated range). */
  low: number
  high: number
  /** @deprecated Prefer low/high bracket — kept as midpoint for older call sites. */
  total: number
}

const RATES = {
  standard: { base: 8, perKm: 2.4, multiplier: 1, maxPassengers: 4, extraPerPax: 3 },
  van: { base: 12, perKm: 3.1, multiplier: 1.15, maxPassengers: 7, extraPerPax: 2.5 },
}

function roundMoney(n: number) {
  return Math.round(n * 100) / 100
}

/** Round bracket edges to nearest 50c for a clean estimate range. */
function roundBracket(n: number) {
  return Math.round(n * 2) / 2
}

export function maxPassengersFor(tier: VehicleTier): number {
  return RATES[tier].maxPassengers
}

export function estimateFare(
  km: number,
  tier: VehicleTier,
  peak: boolean,
  passengers = 1
): FareBreakdown {
  const r = RATES[tier]
  const pax = Math.max(1, Math.min(passengers, r.maxPassengers))
  const distanceCharge = roundMoney(km * r.perKm)
  const peakSurcharge = peak ? roundMoney((r.base + distanceCharge) * 0.2) : 0
  // First passenger included; each extra adds a small surcharge.
  const passengerSurcharge = roundMoney(Math.max(0, pax - 1) * r.extraPerPax)
  const sub = (r.base + distanceCharge + peakSurcharge + passengerSurcharge) * r.multiplier
  const mid = roundMoney(sub)
  // Simulated estimate bracket — traffic / wait variance (~±8–12%).
  const low = roundBracket(mid * 0.9)
  const high = roundBracket(mid * 1.12)

  return {
    km,
    passengers: pax,
    base: r.base,
    perKm: r.perKm,
    distanceCharge,
    peakSurcharge,
    passengerSurcharge,
    vehicleMultiplier: r.multiplier,
    mid,
    low,
    high,
    total: mid,
  }
}

export function formatFareBracket(fare: FareBreakdown): string {
  if (fare.low === fare.high) return `$${fare.low.toFixed(2)}`
  return `$${fare.low.toFixed(2)}–$${fare.high.toFixed(2)}`
}

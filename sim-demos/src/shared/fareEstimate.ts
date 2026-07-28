export type VehicleTier = 'standard' | 'van'

export interface FareBreakdown {
  km: number
  base: number
  perKm: number
  distanceCharge: number
  peakSurcharge: number
  vehicleMultiplier: number
  total: number
}

const RATES = {
  standard: { base: 8, perKm: 2.4, multiplier: 1 },
  van: { base: 12, perKm: 3.1, multiplier: 1.15 },
}

export function estimateFare(
  km: number,
  tier: VehicleTier,
  peak: boolean
): FareBreakdown {
  const r = RATES[tier]
  const distanceCharge = Math.round(km * r.perKm * 100) / 100
  const peakSurcharge = peak ? Math.round((r.base + distanceCharge) * 0.2 * 100) / 100 : 0
  const sub = (r.base + distanceCharge + peakSurcharge) * r.multiplier
  const total = Math.round(sub * 100) / 100
  return {
    km,
    base: r.base,
    perKm: r.perKm,
    distanceCharge,
    peakSurcharge,
    vehicleMultiplier: r.multiplier,
    total,
  }
}

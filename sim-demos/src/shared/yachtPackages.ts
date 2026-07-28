export interface YachtPackage {
  id: string
  name: string
  duration: string
  priceLabel: string
  blurb: string
}

export const YACHT_PACKAGES: YachtPackage[] = [
  {
    id: 'half-day',
    name: 'Half-day Bay Sail',
    duration: '3–4 hours',
    priceLabel: 'from $280',
    blurb: 'Skippered sail across Golden Bay — wildlife, calm water, and a picnic-friendly pace.',
  },
  {
    id: 'sunset',
    name: 'Sunset Skippered Cruise',
    duration: '2.5–3 hours',
    priceLabel: 'from $320',
    blurb: 'Late-afternoon departure toward Separation Point — golden light and quieter water.',
  },
]

export interface HandymanJob {
  id: string
  name: string
  blurb: string
  durationHint: string
  basePrice: number
}

export interface HandymanEstimate {
  jobIds: string[]
  jobsTotal: number
  travelFee: number
  multiJobDiscount: number
  mid: number
  low: number
  high: number
}

export const HANDYMAN_JOBS: HandymanJob[] = [
  {
    id: 'plumbing',
    name: 'Plumbing fix',
    blurb: 'Leaks, taps, toilet cisterns, basic pipework.',
    durationHint: '1–2 hrs',
    basePrice: 95,
  },
  {
    id: 'electrical',
    name: 'Electrical',
    blurb: 'Switches, lights, smoke alarms (non-certified tasks).',
    durationHint: '1–3 hrs',
    basePrice: 110,
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    blurb: 'Shelves, doors, deck boards, small repairs.',
    durationHint: '2–4 hrs',
    basePrice: 120,
  },
  {
    id: 'painting',
    name: 'Painting touch-up',
    blurb: 'Interior touch-ups, fence sections, weatherboards.',
    durationHint: '2–5 hrs',
    basePrice: 140,
  },
  {
    id: 'fencing',
    name: 'Fencing',
    blurb: 'Post resets, rail fixes, gate adjustments.',
    durationHint: '2–4 hrs',
    basePrice: 130,
  },
  {
    id: 'gutters',
    name: 'Gutter clean',
    blurb: 'Clear, flush, and spot-check downpipes.',
    durationHint: '1–2 hrs',
    basePrice: 85,
  },
]

const TRAVEL_FEE = 25

function roundBracket(n: number) {
  return Math.round(n * 2) / 2
}

export function jobById(id: string): HandymanJob | undefined {
  return HANDYMAN_JOBS.find((j) => j.id === id)
}

/** Estimate from multi-select jobs: sum bases + travel − small multi-job discount. */
export function estimateHandymanJobs(jobIds: string[]): HandymanEstimate | null {
  const unique = [...new Set(jobIds)]
  const jobs = unique.map(jobById).filter(Boolean) as HandymanJob[]
  if (!jobs.length) return null

  const jobsTotal = jobs.reduce((sum, j) => sum + j.basePrice, 0)
  const travelFee = TRAVEL_FEE
  const multiJobDiscount = jobs.length >= 2 ? Math.round(jobsTotal * 0.08 * 100) / 100 : 0
  const mid = Math.round((jobsTotal + travelFee - multiJobDiscount) * 100) / 100
  const low = roundBracket(mid * 0.9)
  const high = roundBracket(mid * 1.12)

  return {
    jobIds: unique,
    jobsTotal,
    travelFee,
    multiJobDiscount,
    mid,
    low,
    high,
  }
}

export function formatHandymanBracket(est: HandymanEstimate): string {
  if (est.low === est.high) return `$${est.low.toFixed(2)}`
  return `$${est.low.toFixed(2)}–$${est.high.toFixed(2)}`
}

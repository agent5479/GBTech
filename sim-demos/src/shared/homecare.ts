/** Home-care ops — field visit log + management rounds. */

export type CareTaskGroup = 'Meds' | 'Personal' | 'Home' | 'Notes'

export interface CareClient {
  id: string
  name: string
  suburb: string
  planNote: string
  medsDue: string[]
  lat: number
  lng: number
}

export interface CareTask {
  id: string
  name: string
  blurb: string
  minutes: number
  group: CareTaskGroup
}

export interface Carer {
  id: string
  name: string
}

export interface RoundSlot {
  id: string
  clientId: string
  time: string
  carerId: string
  tasks: string[]
  handoff: string
  covered: boolean
}

export const CARE_CLIENTS: CareClient[] = [
  {
    id: 'eleanor',
    name: 'Eleanor P.',
    suburb: 'Tākaka',
    planNote: 'Morning meds · mobility aid',
    medsDue: ['08:30 breakfast set', 'Blood pressure log'],
    lat: -40.855,
    lng: 172.808,
  },
  {
    id: 'harold',
    name: 'Harold M.',
    suburb: 'Pōhara',
    planNote: 'Meal prep · company visit',
    medsDue: ['Lunchtime tablets'],
    lat: -40.837,
    lng: 172.889,
  },
  {
    id: 'ruth',
    name: 'Ruth K.',
    suburb: 'Collingwood',
    planNote: 'Personal care · laundry',
    medsDue: [],
    lat: -40.682,
    lng: 172.683,
  },
  {
    id: 'ben',
    name: 'Ben W.',
    suburb: 'Tākaka',
    planNote: 'Special-needs routine · notes to family',
    medsDue: ['Afternoon prompt'],
    lat: -40.85,
    lng: 172.81,
  },
]

export const CARE_TASKS: CareTask[] = [
  { id: 'meds', name: 'Medication support', blurb: 'Prompt and record.', minutes: 15, group: 'Meds' },
  { id: 'bp', name: 'Vitals / BP log', blurb: 'Chart if required.', minutes: 10, group: 'Meds' },
  { id: 'personal', name: 'Personal care', blurb: 'Hygiene support per plan.', minutes: 45, group: 'Personal' },
  { id: 'mobility', name: 'Mobility / walk', blurb: 'Safe transfer or short walk.', minutes: 30, group: 'Personal' },
  { id: 'meal', name: 'Meal prep', blurb: 'Simple meal and tidy.', minutes: 40, group: 'Home' },
  { id: 'laundry', name: 'Laundry / tidy', blurb: 'Light household as planned.', minutes: 25, group: 'Home' },
  { id: 'notes', name: 'Family hand-off', blurb: 'Write what happened this visit.', minutes: 10, group: 'Notes' },
]

export const CARERS: Carer[] = [
  { id: 'ana', name: 'Ana' },
  { id: 'craig', name: 'Craig' },
  { id: 'zoe', name: 'Zoe' },
]

export const ROUND_HOURS = ['08:30', '10:00', '13:00', '15:30'] as const

let rounds: RoundSlot[] = [
  {
    id: 'r1',
    clientId: 'eleanor',
    time: '08:30',
    carerId: 'ana',
    tasks: ['meds', 'mobility'],
    handoff: 'Slept well · cane by door',
    covered: true,
  },
  {
    id: 'r2',
    clientId: 'harold',
    time: '10:00',
    carerId: 'craig',
    tasks: ['meal', 'notes'],
    handoff: '',
    covered: true,
  },
  {
    id: 'r3',
    clientId: 'ruth',
    time: '13:00',
    carerId: 'zoe',
    tasks: ['personal', 'meal'],
    handoff: 'Prefer afternoon visits',
    covered: false,
  },
  {
    id: 'r4',
    clientId: 'ben',
    time: '15:30',
    carerId: 'ana',
    tasks: ['personal', 'notes'],
    handoff: '',
    covered: true,
  },
]

export function clientById(id: string): CareClient | undefined {
  return CARE_CLIENTS.find((c) => c.id === id)
}

export function careTaskById(id: string): CareTask | undefined {
  return CARE_TASKS.find((t) => t.id === id)
}

export function carerById(id: string): Carer | undefined {
  return CARERS.find((c) => c.id === id)
}

export function getRounds(): RoundSlot[] {
  return rounds.map((r) => ({ ...r, tasks: [...r.tasks] }))
}

export function setRoundCarer(id: string, carerId: string) {
  rounds = rounds.map((r) => (r.id === id ? { ...r, carerId } : r))
}

export function toggleRoundCovered(id: string) {
  rounds = rounds.map((r) => (r.id === id ? { ...r, covered: !r.covered } : r))
}

export function setRoundHandoff(id: string, handoff: string) {
  rounds = rounds.map((r) => (r.id === id ? { ...r, handoff } : r))
}

export function visitMinutes(taskIds: string[]): number {
  return taskIds.reduce((sum, id) => sum + (careTaskById(id)?.minutes ?? 0), 0)
}

export function tasksByGroup(): Record<CareTaskGroup, CareTask[]> {
  const grouped = { Meds: [], Personal: [], Home: [], Notes: [] } as Record<CareTaskGroup, CareTask[]>
  for (const t of CARE_TASKS) grouped[t.group].push(t)
  return grouped
}

export const CARE_MAP_CENTER: [number, number] = [-40.8, 172.8]

/** Home-care ops — field carer visits + management rounds (not public guest booking). */

export interface CareClient {
  id: string
  name: string
  suburb: string
  planNote: string
}

export interface CareTask {
  id: string
  name: string
  blurb: string
  minutes: number
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
  { id: 'eleanor', name: 'Eleanor P.', suburb: 'Tākaka', planNote: 'Morning meds · mobility aid' },
  { id: 'harold', name: 'Harold M.', suburb: 'Pōhara', planNote: 'Meal prep · company visit' },
  { id: 'ruth', name: 'Ruth K.', suburb: 'Collingwood', planNote: 'Personal care · laundry' },
  { id: 'ben', name: 'Ben W.', suburb: 'Tākaka', planNote: 'Special-needs routine · notes to family' },
]

export const CARE_TASKS: CareTask[] = [
  { id: 'meds', name: 'Medication support', blurb: 'Prompt and record.', minutes: 15 },
  { id: 'meal', name: 'Meal prep', blurb: 'Simple meal and tidy.', minutes: 40 },
  { id: 'personal', name: 'Personal care', blurb: 'Hygiene support per plan.', minutes: 45 },
  { id: 'mobility', name: 'Mobility / walk', blurb: 'Safe transfer or short walk.', minutes: 30 },
  { id: 'notes', name: 'Family hand-off note', blurb: 'Write what happened this visit.', minutes: 10 },
]

export const CARERS: Carer[] = [
  { id: 'ana', name: 'Ana' },
  { id: 'craig', name: 'Craig' },
  { id: 'zoe', name: 'Zoe' },
]

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

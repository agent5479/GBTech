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
  role: string
  skills: string[]
  maxVisitsPerDay: number
}

export interface RoundSlot {
  id: string
  clientId: string
  time: string
  weekStart: string
  carerId: string
  reliefCarerId?: string
  tasks: string[]
  handoff: string
  covered: boolean
}

export const CARER_SKILLS = ['meds', 'hoist', 'dementia', 'special-needs'] as const

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
  { id: 'ana', name: 'Ana', role: 'Lead carer', skills: ['meds', 'hoist', 'dementia'], maxVisitsPerDay: 4 },
  { id: 'craig', name: 'Craig', role: 'Relief', skills: ['meds', 'special-needs'], maxVisitsPerDay: 3 },
  { id: 'zoe', name: 'Zoe', role: 'Trainee', skills: ['meds'], maxVisitsPerDay: 3 },
]

export const ROUND_HOURS = ['08:30', '10:00', '13:00', '15:30'] as const

function defaultWeekStart(): string {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().slice(0, 10)
}

function shiftWeekIso(weekStart: string, delta: number): string {
  const d = new Date(`${weekStart}T12:00:00`)
  d.setDate(d.getDate() + delta * 7)
  return d.toISOString().slice(0, 10)
}

const BASE_WEEK = defaultWeekStart()

let rounds: RoundSlot[] = [
  {
    id: 'r1',
    clientId: 'eleanor',
    time: '08:30',
    weekStart: BASE_WEEK,
    carerId: 'ana',
    tasks: ['meds', 'mobility'],
    handoff: 'Slept well · cane by door',
    covered: true,
  },
  {
    id: 'r2',
    clientId: 'harold',
    time: '10:00',
    weekStart: BASE_WEEK,
    carerId: 'craig',
    tasks: ['meal', 'notes'],
    handoff: '',
    covered: true,
  },
  {
    id: 'r3',
    clientId: 'ruth',
    time: '13:00',
    weekStart: BASE_WEEK,
    carerId: 'zoe',
    reliefCarerId: 'ana',
    tasks: ['personal', 'meal'],
    handoff: 'Prefer afternoon visits',
    covered: false,
  },
  {
    id: 'r4',
    clientId: 'ben',
    time: '15:30',
    weekStart: BASE_WEEK,
    carerId: 'ana',
    tasks: ['personal', 'notes'],
    handoff: '',
    covered: true,
  },
  {
    id: 'r5',
    clientId: 'eleanor',
    time: '08:30',
    weekStart: shiftWeekIso(BASE_WEEK, 1),
    carerId: 'craig',
    tasks: ['meds', 'bp'],
    handoff: '',
    covered: true,
  },
  {
    id: 'r6',
    clientId: 'ben',
    time: '13:00',
    weekStart: shiftWeekIso(BASE_WEEK, 1),
    carerId: 'zoe',
    tasks: ['personal'],
    handoff: '',
    covered: false,
  },
]

let carerRoles: Record<string, string> = Object.fromEntries(CARERS.map((c) => [c.id, c.role]))
let carerSkills: Record<string, string[]> = Object.fromEntries(CARERS.map((c) => [c.id, [...c.skills]]))

export function clientById(id: string): CareClient | undefined {
  return CARE_CLIENTS.find((c) => c.id === id)
}

export function careTaskById(id: string): CareTask | undefined {
  return CARE_TASKS.find((t) => t.id === id)
}

export function carerById(id: string): Carer | undefined {
  const base = CARERS.find((c) => c.id === id)
  if (!base) return undefined
  return { ...base, role: carerRoles[id] ?? base.role, skills: carerSkills[id] ?? base.skills }
}

export function getAllCarers(): Carer[] {
  return CARERS.map((c) => carerById(c.id)!)
}

export function getRounds(): RoundSlot[] {
  return rounds.map((r) => ({ ...r, tasks: [...r.tasks] }))
}

export function getRoundsForWeek(weekStart: string): RoundSlot[] {
  return getRounds().filter((r) => r.weekStart === weekStart)
}

export function getCarerRoundsToday(carerId: string, weekStart: string): RoundSlot[] {
  return getRoundsForWeek(weekStart).filter(
    (r) => r.carerId === carerId || r.reliefCarerId === carerId,
  )
}

export function setRoundCarer(id: string, carerId: string) {
  rounds = rounds.map((r) => (r.id === id ? { ...r, carerId } : r))
}

export function setRoundRelief(id: string, reliefCarerId: string | undefined) {
  rounds = rounds.map((r) => (r.id === id ? { ...r, reliefCarerId: reliefCarerId || undefined } : r))
}

export function toggleRoundCovered(id: string) {
  rounds = rounds.map((r) => (r.id === id ? { ...r, covered: !r.covered } : r))
}

export function setRoundHandoff(id: string, handoff: string) {
  rounds = rounds.map((r) => (r.id === id ? { ...r, handoff } : r))
}

export function setCarerRole(carerId: string, role: string) {
  carerRoles = { ...carerRoles, [carerId]: role }
}

export function toggleCarerSkill(carerId: string, skill: string) {
  const current = carerSkills[carerId] ?? []
  carerSkills = {
    ...carerSkills,
    [carerId]: current.includes(skill) ? current.filter((s) => s !== skill) : [...current, skill],
  }
}

export function carerWeekLoad(carerId: string, weekStart: string): number {
  return getRoundsForWeek(weekStart).filter(
    (r) => r.carerId === carerId || r.reliefCarerId === carerId,
  ).length
}

export function suggestCarerForClient(clientId: string, weekStart: string): string | undefined {
  const client = clientById(clientId)
  if (!client) return undefined
  const needsMeds = client.medsDue.length > 0
  const candidates = getAllCarers()
    .filter((c) => !needsMeds || c.skills.includes('meds'))
    .filter((c) => carerWeekLoad(c.id, weekStart) < c.maxVisitsPerDay)
  return candidates[0]?.id
}

export function autoFillCoverageGaps(weekStart: string): number {
  let filled = 0
  rounds = rounds.map((r) => {
    if (r.weekStart !== weekStart || r.covered) return r
    const relief = suggestCarerForClient(r.clientId, weekStart)
    if (relief && relief !== r.carerId) {
      filled++
      return { ...r, reliefCarerId: relief, covered: true }
    }
    return r
  })
  return filled
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

export const DEMO_FIELD_CARER_ID = 'ana'

export function clientNeedsForCarer(clientId: string): string[] {
  const c = clientById(clientId)
  if (!c) return []
  const needs: string[] = []
  if (c.medsDue.length) needs.push('meds')
  if (c.planNote.toLowerCase().includes('special')) needs.push('special-needs')
  return needs
}

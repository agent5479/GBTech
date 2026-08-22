/** Apiary ops — field log + management roster (no public client booking). */

export type HiveTaskCategory =
  | 'Inspection'
  | 'Feeding'
  | 'Treatment'
  | 'Harvest'
  | 'Maintenance'
  | 'Queen'

export type HiveFlag = 'ok' | 'watch' | 'quarantine'
export type HiveAccess = 'all-weather' | 'dry-only'

export interface HiveYard {
  id: string
  name: string
  gpsLabel: string
  lat: number
  lng: number
  hiveCount: number
  accessNote: string
  access: HiveAccess
  siteType: 'summer' | 'winter' | 'year-round'
  landowner: string
  contactBefore: boolean
  flag: HiveFlag
}

export interface HiveTask {
  id: string
  name: string
  category: HiveTaskCategory
  common: boolean
}

export interface ApiaryStaff {
  id: string
  name: string
  role: string
  skills: string[]
}

export interface YardAssignment {
  yardId: string
  staffId: string
  assistantStaffId?: string
  dayLabel: string
  weekStart: string
  focus: string
  reminder: boolean
}

export const STAFF_SKILLS = ['treatment-certified', 'forklift', 'landowner-call', 'extractor'] as const

export const HIVE_YARDS: HiveYard[] = [
  {
    id: 'collingwood',
    name: 'Collingwood ridge',
    gpsLabel: '−40.68, 172.68',
    lat: -40.682,
    lng: 172.683,
    hiveCount: 18,
    accessNote: 'Farm gate · leave closed',
    access: 'all-weather',
    siteType: 'year-round',
    landowner: 'North Ridge Farm',
    contactBefore: true,
    flag: 'ok',
  },
  {
    id: 'pakawau',
    name: 'Pakawau flats',
    gpsLabel: '−40.59, 172.69',
    lat: -40.59,
    lng: 172.69,
    hiveCount: 12,
    accessNote: 'Soft track after rain',
    access: 'dry-only',
    siteType: 'summer',
    landowner: 'Flats Trust',
    contactBefore: false,
    flag: 'watch',
  },
  {
    id: 'takaka',
    name: 'Tākaka valley',
    gpsLabel: '−40.85, 172.81',
    lat: -40.855,
    lng: 172.808,
    hiveCount: 24,
    accessNote: 'Park at shed · walk in',
    access: 'all-weather',
    siteType: 'year-round',
    landowner: 'Valley Holdings',
    contactBefore: false,
    flag: 'ok',
  },
  {
    id: 'anatoki',
    name: 'Anatoki bush edge',
    gpsLabel: '−40.90, 172.75',
    lat: -40.9,
    lng: 172.75,
    hiveCount: 9,
    accessNote: '4WD preferred',
    access: 'dry-only',
    siteType: 'summer',
    landowner: 'Bush Edge',
    contactBefore: true,
    flag: 'quarantine',
  },
]

export const HIVE_TASKS: HiveTask[] = [
  { id: 'inspect', name: 'General inspection', category: 'Inspection', common: true },
  { id: 'queen', name: 'Queen sign', category: 'Inspection', common: true },
  { id: 'stores', name: 'Food stores check', category: 'Inspection', common: true },
  { id: 'entrance', name: 'Entrance activity', category: 'Inspection', common: false },
  { id: 'feed11', name: 'Sugar syrup 1:1', category: 'Feeding', common: true },
  { id: 'feed21', name: 'Sugar syrup 2:1', category: 'Feeding', common: false },
  { id: 'pollen', name: 'Pollen patty', category: 'Feeding', common: false },
  { id: 'varroa', name: 'Varroa check', category: 'Treatment', common: true },
  { id: 'treat', name: 'Varroa treat', category: 'Treatment', common: true },
  { id: 'harvest', name: 'Pull supers', category: 'Harvest', common: true },
  { id: 'extract', name: 'Extract honey', category: 'Harvest', common: false },
  { id: 'weed', name: 'Site tidy / weeds', category: 'Maintenance', common: false },
  { id: 'box', name: 'Box repair', category: 'Maintenance', common: false },
  { id: 'split', name: 'Split / nuc', category: 'Queen', common: false },
  { id: 'requeen', name: 'Requeen', category: 'Queen', common: false },
]

export const APIARY_STAFF: ApiaryStaff[] = [
  { id: 'lars', name: 'Lars', role: 'Lead apiarist', skills: ['treatment-certified', 'landowner-call', 'extractor'] },
  { id: 'nina', name: 'Nina', role: 'Field hand', skills: ['treatment-certified', 'forklift'] },
  { id: 'tom', name: 'Tom', role: 'Seasonal', skills: ['landowner-call'] },
]

export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const

function defaultWeekStart(): string {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().slice(0, 10)
}

const BASE_WEEK = defaultWeekStart()

let assignments: YardAssignment[] = [
  { yardId: 'collingwood', staffId: 'lars', assistantStaffId: 'nina', dayLabel: 'Mon', weekStart: BASE_WEEK, focus: 'Inspect + treat', reminder: true },
  { yardId: 'pakawau', staffId: 'nina', dayLabel: 'Mon', weekStart: BASE_WEEK, focus: 'Feed', reminder: false },
  { yardId: 'takaka', staffId: 'lars', dayLabel: 'Wed', weekStart: BASE_WEEK, focus: 'Harvest', reminder: true },
  { yardId: 'anatoki', staffId: 'tom', dayLabel: 'Thu', weekStart: BASE_WEEK, focus: 'Inspect', reminder: true },
  { yardId: 'collingwood', staffId: 'tom', dayLabel: 'Tue', weekStart: shiftWeekIso(BASE_WEEK, 1), focus: 'Feed check', reminder: false },
  { yardId: 'takaka', staffId: 'nina', assistantStaffId: 'tom', dayLabel: 'Fri', weekStart: shiftWeekIso(BASE_WEEK, 1), focus: 'Extract', reminder: true },
]

function shiftWeekIso(weekStart: string, delta: number): string {
  const d = new Date(`${weekStart}T12:00:00`)
  d.setDate(d.getDate() + delta * 7)
  return d.toISOString().slice(0, 10)
}

let staffRoles: Record<string, string> = {
  lars: 'Lead apiarist',
  nina: 'Field hand',
  tom: 'Seasonal',
}

let staffSkills: Record<string, string[]> = Object.fromEntries(
  APIARY_STAFF.map((s) => [s.id, [...s.skills]]),
)

export function yardById(id: string): HiveYard | undefined {
  return HIVE_YARDS.find((y) => y.id === id)
}

export function taskById(id: string): HiveTask | undefined {
  return HIVE_TASKS.find((t) => t.id === id)
}

export function staffById(id: string): ApiaryStaff | undefined {
  const base = APIARY_STAFF.find((s) => s.id === id)
  if (!base) return undefined
  return { ...base, role: staffRoles[id] ?? base.role, skills: staffSkills[id] ?? base.skills }
}

export function getAllStaff(): ApiaryStaff[] {
  return APIARY_STAFF.map((s) => staffById(s.id)!)
}

export function getAssignments(): YardAssignment[] {
  return assignments.map((a) => ({ ...a }))
}

export function getAssignmentsForWeek(weekStart: string): YardAssignment[] {
  return getAssignments().filter((a) => a.weekStart === weekStart)
}

export function getMyAssignmentsToday(staffId: string, weekStart: string, dayLabel: string): YardAssignment[] {
  return getAssignmentsForWeek(weekStart).filter(
    (a) => a.dayLabel === dayLabel && (a.staffId === staffId || a.assistantStaffId === staffId),
  )
}

export function setAssignmentStaff(yardId: string, dayLabel: string, weekStart: string, staffId: string) {
  assignments = assignments.map((a) =>
    a.yardId === yardId && a.dayLabel === dayLabel && a.weekStart === weekStart ? { ...a, staffId } : a,
  )
}

export function setAssignmentAssistant(
  yardId: string,
  dayLabel: string,
  weekStart: string,
  assistantStaffId: string | undefined,
) {
  assignments = assignments.map((a) =>
    a.yardId === yardId && a.dayLabel === dayLabel && a.weekStart === weekStart
      ? { ...a, assistantStaffId: assistantStaffId || undefined }
      : a,
  )
}

export function setStaffRole(staffId: string, role: string) {
  staffRoles = { ...staffRoles, [staffId]: role }
}

export function toggleStaffSkill(staffId: string, skill: string) {
  const current = staffSkills[staffId] ?? []
  staffSkills = {
    ...staffSkills,
    [staffId]: current.includes(skill) ? current.filter((s) => s !== skill) : [...current, skill],
  }
}

export function staffWeekLoad(staffId: string, weekStart: string): number {
  return getAssignmentsForWeek(weekStart).filter(
    (a) => a.staffId === staffId || a.assistantStaffId === staffId,
  ).length
}

export function toggleReminder(yardId: string, dayLabel: string, weekStart: string) {
  assignments = assignments.map((a) =>
    a.yardId === yardId && a.dayLabel === dayLabel && a.weekStart === weekStart
      ? { ...a, reminder: !a.reminder }
      : a,
  )
}

export function totalHives(): number {
  return HIVE_YARDS.reduce((s, y) => s + y.hiveCount, 0)
}

export function hiveChipIds(hiveCount: number): number[] {
  const n = Math.min(Math.max(hiveCount, 0), 6)
  return Array.from({ length: n }, (_, i) => i + 1)
}

export function quarantineYards(): HiveYard[] {
  return HIVE_YARDS.filter((y) => y.flag === 'quarantine')
}

export function dryOnlyYardsWithReminder(): HiveYard[] {
  const due = new Set(getAssignments().filter((a) => a.reminder).map((a) => a.yardId))
  return HIVE_YARDS.filter((y) => y.access === 'dry-only' && due.has(y.id))
}

export function apiaryOpsHint(): string {
  const q = quarantineYards()
  const dry = dryOnlyYardsWithReminder()
  const parts: string[] = []
  if (q.length) {
    parts.push(
      `${q.length} quarantine yard${q.length === 1 ? '' : 's'}: ${q.map((y) => y.name).join(', ')}`,
    )
  }
  if (dry.length) {
    parts.push(`Dry-only with reminder due: ${dry.map((y) => y.name).join(', ')}`)
  }
  if (!parts.length) return 'No dry-only reminders overdue · no quarantine yards flagged.'
  return parts.join(' · ')
}

export function tasksByCategory(filter: 'common' | 'all'): Record<string, HiveTask[]> {
  const list = filter === 'common' ? HIVE_TASKS.filter((t) => t.common) : HIVE_TASKS
  const grouped: Record<string, HiveTask[]> = {}
  for (const t of list) {
    grouped[t.category] ??= []
    grouped[t.category].push(t)
  }
  return grouped
}

export const HIVE_MAP_CENTER: [number, number] = [-40.78, 172.76]

export const LIVE_BEEMARSHALL_URL = 'https://agent5479.github.io/LarsBees/beemarshall-full.html'

export const DEMO_FIELD_STAFF_ID = 'lars'

export function todayDayLabel(): string {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
  return labels[new Date().getDay()]
}

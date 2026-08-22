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
}

export interface YardAssignment {
  yardId: string
  staffId: string
  dayLabel: string
  focus: string
  reminder: boolean
}

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
  { id: 'lars', name: 'Lars', role: 'Lead apiarist' },
  { id: 'nina', name: 'Nina', role: 'Field hand' },
  { id: 'tom', name: 'Tom', role: 'Seasonal' },
]

export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const

let assignments: YardAssignment[] = [
  { yardId: 'collingwood', staffId: 'lars', dayLabel: 'Mon', focus: 'Inspect + treat', reminder: true },
  { yardId: 'pakawau', staffId: 'nina', dayLabel: 'Mon', focus: 'Feed', reminder: false },
  { yardId: 'takaka', staffId: 'lars', dayLabel: 'Wed', focus: 'Harvest', reminder: true },
  { yardId: 'anatoki', staffId: 'tom', dayLabel: 'Thu', focus: 'Inspect', reminder: true },
]

export function yardById(id: string): HiveYard | undefined {
  return HIVE_YARDS.find((y) => y.id === id)
}

export function taskById(id: string): HiveTask | undefined {
  return HIVE_TASKS.find((t) => t.id === id)
}

export function staffById(id: string): ApiaryStaff | undefined {
  return APIARY_STAFF.find((s) => s.id === id)
}

export function getAssignments(): YardAssignment[] {
  return assignments.map((a) => ({ ...a }))
}

export function setAssignmentStaff(yardId: string, dayLabel: string, staffId: string) {
  assignments = assignments.map((a) =>
    a.yardId === yardId && a.dayLabel === dayLabel ? { ...a, staffId } : a,
  )
}

export function toggleReminder(yardId: string, dayLabel: string) {
  assignments = assignments.map((a) =>
    a.yardId === yardId && a.dayLabel === dayLabel ? { ...a, reminder: !a.reminder } : a,
  )
}

export function totalHives(): number {
  return HIVE_YARDS.reduce((s, y) => s + y.hiveCount, 0)
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

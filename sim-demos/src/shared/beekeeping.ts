/** Apiary ops — field hive work + management roster (no public client booking). */

export interface HiveYard {
  id: string
  name: string
  gpsLabel: string
  hiveCount: number
  accessNote: string
}

export interface HiveTask {
  id: string
  name: string
  blurb: string
  seasonHint: string
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
    hiveCount: 18,
    accessNote: 'Farm gate · leave closed',
  },
  {
    id: 'pakawau',
    name: 'Pakawau flats',
    gpsLabel: '−40.59, 172.69',
    hiveCount: 12,
    accessNote: 'Soft track after rain',
  },
  {
    id: 'takaka',
    name: 'Tākaka valley',
    gpsLabel: '−40.85, 172.81',
    hiveCount: 24,
    accessNote: 'Park at shed · walk in',
  },
  {
    id: 'anatoki',
    name: 'Anatoki bush edge',
    gpsLabel: '−40.90, 172.75',
    hiveCount: 9,
    accessNote: '4WD preferred',
  },
]

export const HIVE_TASKS: HiveTask[] = [
  { id: 'inspect', name: 'Full inspect', blurb: 'Brood, stores, queen sign.', seasonHint: 'Spring–autumn' },
  { id: 'treat', name: 'Varroa treat', blurb: 'Strip check / treatment window.', seasonHint: 'Seasonal' },
  { id: 'harvest', name: 'Harvest supers', blurb: 'Pull capped honey supers.', seasonHint: 'Summer' },
  { id: 'feed', name: 'Feed syrup', blurb: 'Top-up weak colonies.', seasonHint: 'Autumn–winter' },
  { id: 'split', name: 'Split / nuc', blurb: 'Make increase or replace.', seasonHint: 'Spring' },
]

export const APIARY_STAFF: ApiaryStaff[] = [
  { id: 'lars', name: 'Lars', role: 'Lead apiarist' },
  { id: 'nina', name: 'Nina', role: 'Field hand' },
  { id: 'tom', name: 'Tom', role: 'Seasonal' },
]

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

export const LIVE_BEEMARSHALL_URL = 'https://agent5479.github.io/LarsBees/beemarshall-full.html'

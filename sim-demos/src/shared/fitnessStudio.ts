/** Simulated fitness studio — prepaid packs, class caps, exercises, calendar/Firebase labels. */

export type PlanId = 'casual' | 'pack10' | 'pack20' | 'threeWeek'

export interface FitnessPlan {
  id: PlanId
  name: string
  blurb: string
  ratePerClass: number
  credits: number
  prepaidTotal: number
}

export interface Exercise {
  id: string
  name: string
}

export interface ClassType {
  id: string
  name: string
  blurb: string
  cap: number
  exerciseIds: string[]
}

export interface ClassOccurrence {
  id: string
  classTypeId: string
  dayLabel: string
  time: string
  bookedCount: number
  roster: string[]
  calendarEventId: string
}

export const FITNESS_PLANS: FitnessPlan[] = [
  {
    id: 'casual',
    name: 'Casual',
    blurb: 'Drop in — pay in advance for one class.',
    ratePerClass: 17,
    credits: 1,
    prepaidTotal: 17,
  },
  {
    id: 'pack10',
    name: '10-class pack',
    blurb: '$15 a class when you book 10 in advance.',
    ratePerClass: 15,
    credits: 10,
    prepaidTotal: 150,
  },
  {
    id: 'pack20',
    name: '20-class pack',
    blurb: '$12.50 a class when you book 20 in advance.',
    ratePerClass: 12.5,
    credits: 20,
    prepaidTotal: 250,
  },
  {
    id: 'threeWeek',
    name: '3 classes a week',
    blurb: '$10 a class — prepaid week of three sessions ($30). Monthly view $120 / 12 classes.',
    ratePerClass: 10,
    credits: 3,
    prepaidTotal: 30,
  },
]

const DEFAULT_EXERCISES: Exercise[] = [
  { id: 'squat', name: 'Squat' },
  { id: 'deadlift', name: 'Deadlift' },
  { id: 'press', name: 'Overhead press' },
  { id: 'row', name: 'Bent-over row' },
  { id: 'burpee', name: 'Burpee' },
  { id: 'kbswing', name: 'Kettlebell swing' },
  { id: 'boxjump', name: 'Box jump' },
  { id: 'bike', name: 'Assault bike' },
  { id: 'hipopener', name: 'Hip opener' },
  { id: 'tspine', name: 'Thoracic mobility' },
  { id: 'plank', name: 'Plank' },
  { id: 'flow', name: 'Sun flow' },
]

const DEFAULT_CLASSES: ClassType[] = [
  {
    id: 'strength',
    name: 'Strength',
    blurb: 'Barbell and accessory work — usual crowd, cap 27.',
    cap: 27,
    exerciseIds: ['squat', 'deadlift', 'press', 'row'],
  },
  {
    id: 'hiit',
    name: 'HIIT',
    blurb: 'Shorter class, smaller room — cap 16.',
    cap: 16,
    exerciseIds: ['burpee', 'kbswing', 'boxjump', 'bike'],
  },
  {
    id: 'mobility',
    name: 'Mobility',
    blurb: 'Recovery and range — cap 12.',
    cap: 12,
    exerciseIds: ['hipopener', 'tspine', 'plank'],
  },
  {
    id: 'yoga',
    name: 'Yoga flow',
    blurb: 'Evening floor class — cap 20.',
    cap: 20,
    exerciseIds: ['flow', 'plank', 'hipopener'],
  },
]

const DEFAULT_OCCURRENCES: ClassOccurrence[] = [
  {
    id: 'occ-str-am',
    classTypeId: 'strength',
    dayLabel: 'Thu 20 Aug',
    time: '06:30',
    bookedCount: 22,
    roster: ['Aroha K.', 'Ben T.', 'Cara M.', 'Dan P.', 'Eli R.'],
    calendarEventId: 'cal-str-0630',
  },
  {
    id: 'occ-hiit-noon',
    classTypeId: 'hiit',
    dayLabel: 'Thu 20 Aug',
    time: '12:10',
    bookedCount: 16,
    roster: ['Fran S.', 'Gus W.', 'Hana L.', 'Ivy N.'],
    calendarEventId: 'cal-hiit-1210',
  },
  {
    id: 'occ-mob-pm',
    classTypeId: 'mobility',
    dayLabel: 'Thu 20 Aug',
    time: '17:30',
    bookedCount: 8,
    roster: ['Jo B.', 'Kai H.'],
    calendarEventId: 'cal-mob-1730',
  },
  {
    id: 'occ-yoga-eve',
    classTypeId: 'yoga',
    dayLabel: 'Thu 20 Aug',
    time: '18:45',
    bookedCount: 14,
    roster: ['Lea C.', 'Mo T.', 'Nia V.'],
    calendarEventId: 'cal-yoga-1845',
  },
  {
    id: 'occ-str-fri',
    classTypeId: 'strength',
    dayLabel: 'Fri 21 Aug',
    time: '06:30',
    bookedCount: 11,
    roster: ['Owen D.', 'Pip S.'],
    calendarEventId: 'cal-str-fri-0630',
  },
  {
    id: 'occ-hiit-sat',
    classTypeId: 'hiit',
    dayLabel: 'Sat 22 Aug',
    time: '09:00',
    bookedCount: 9,
    roster: ['Quinn A.', 'Rae J.'],
    calendarEventId: 'cal-hiit-sat-0900',
  },
]

export interface DemoMember {
  name: string
  planId: PlanId
  creditsLeft: number
}

/** In-memory store — simulates Firebase + Calendar for this SPA session. */
const store = {
  exercises: [...DEFAULT_EXERCISES],
  classes: DEFAULT_CLASSES.map((c) => ({ ...c, exerciseIds: [...c.exerciseIds] })),
  occurrences: DEFAULT_OCCURRENCES.map((o) => ({ ...o, roster: [...o.roster] })),
  member: { name: 'Alex (demo member)', planId: 'pack10' as PlanId, creditsLeft: 7 },
  lastCalendarWrite: '',
  lastFirebaseWrite: '',
}

export function planById(id: PlanId): FitnessPlan | undefined {
  return FITNESS_PLANS.find((p) => p.id === id)
}

export function formatPrepaid(plan: FitnessPlan): string {
  if (plan.id === 'threeWeek') return `$${plan.prepaidTotal.toFixed(2)} this week`
  if (plan.credits === 1) return `$${plan.prepaidTotal.toFixed(2)} now`
  return `$${plan.prepaidTotal.toFixed(2)} prepaid`
}

export function getExercises(): Exercise[] {
  return store.exercises
}

export function getClassTypes(): ClassType[] {
  return store.classes
}

export function getOccurrences(): ClassOccurrence[] {
  return store.occurrences
}

export function getMember(): DemoMember {
  return store.member
}

export function classTypeById(id: string): ClassType | undefined {
  return store.classes.find((c) => c.id === id)
}

export function occurrenceById(id: string): ClassOccurrence | undefined {
  return store.occurrences.find((o) => o.id === id)
}

export function spotsLeft(occ: ClassOccurrence): number {
  const cap = classTypeById(occ.classTypeId)?.cap ?? occ.bookedCount
  return Math.max(0, cap - occ.bookedCount)
}

export function toggleExercise(classTypeId: string, exerciseId: string): void {
  const cls = classTypeById(classTypeId)
  if (!cls) return
  cls.exerciseIds = cls.exerciseIds.includes(exerciseId)
    ? cls.exerciseIds.filter((id) => id !== exerciseId)
    : [...cls.exerciseIds, exerciseId]
}

export function addExercise(name: string): Exercise | null {
  const trimmed = name.trim()
  if (!trimmed) return null
  const id = `ex-${trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${store.exercises.length + 1}`
  const item = { id, name: trimmed }
  store.exercises = [...store.exercises, item]
  return item
}

export function setClassCap(classTypeId: string, cap: number): void {
  const cls = classTypeById(classTypeId)
  if (!cls) return
  cls.cap = Math.min(27, Math.max(4, Math.round(cap)))
}

export function bookOccurrence(occurrenceId: string, planId: PlanId, attendeeName = 'You (demo)'): string | null {
  const occ = occurrenceById(occurrenceId)
  const plan = planById(planId)
  if (!occ || !plan) return 'Missing class or plan.'
  if (spotsLeft(occ) <= 0) return 'This class is full — calendar cap reached.'
  occ.bookedCount += 1
  occ.roster = [...occ.roster, attendeeName]
  store.member = {
    name: store.member.name,
    planId,
    creditsLeft: plan.credits - 1,
  }
  store.lastCalendarWrite = occ.calendarEventId
  store.lastFirebaseWrite = `${plan.id}:${store.member.creditsLeft} credits`
  return null
}

export function syncLabels(): { calendar: string; firebase: string } {
  return {
    calendar: store.lastCalendarWrite
      ? `Google Calendar (demo) · event ${store.lastCalendarWrite}`
      : 'Google Calendar (demo) · waiting for a booking',
    firebase: store.lastFirebaseWrite
      ? `Firebase (demo) · ${store.lastFirebaseWrite}`
      : 'Firebase (demo) · member packs idle',
  }
}

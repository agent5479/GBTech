/** Harbour Hall venue — client booking + staff board shared data. */

export interface HallRoom {
  id: string
  name: string
  blurb: string
  capacity: number
  hourlyRate: number
}

export interface HallExtra {
  id: string
  name: string
  price: number
}

export interface HallStaff {
  id: string
  name: string
}

export type HallHoldStatus = 'hold' | 'confirmed' | 'blocked'

export interface HallHold {
  id: string
  roomId: string
  /** ISO date YYYY-MM-DD */
  date: string
  dayLabel: string
  time: string
  partyName: string
  status: HallHoldStatus
  assigneeId?: string
}

export const HALL_BOARD_HOURS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
]

export const HALL_ROOMS: HallRoom[] = [
  {
    id: 'workshop',
    name: 'Creative Workshop',
    blurb: 'Benches, sinks, and wet-area benches for makers and tutors.',
    capacity: 16,
    hourlyRate: 10,
  },
  {
    id: 'kitchen',
    name: 'Prep Kitchen',
    blurb: 'Commercial-style prep benches for classes and catering.',
    capacity: 10,
    hourlyRate: 12,
  },
  {
    id: 'seminar',
    name: 'Seminar Room',
    blurb: 'Tables, projector mount, and stackable seating.',
    capacity: 24,
    hourlyRate: 8,
  },
]

export const HALL_EXTRAS: HallExtra[] = [
  { id: 'av', name: 'Portable AV kit', price: 20 },
  { id: 'tables', name: 'Extra trestle tables', price: 15 },
  { id: 'tea', name: 'Tea & coffee station', price: 25 },
]

export const HALL_STAFF: HallStaff[] = [
  { id: 'mira', name: 'Mira (front desk)' },
  { id: 'jordan', name: 'Jordan (facilities)' },
  { id: 'sam', name: 'Sam (AV)' },
]

function addDaysIso(from: string, n: number): string {
  const d = new Date(`${from}T12:00:00`)
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function shiftDate(isoDate: string, deltaDays: number): string {
  return addDaysIso(isoDate, deltaDays)
}

export function formatHallDayLabel(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`)
  return d.toLocaleDateString('en-NZ', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function formatHallDayLong(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`)
  return d.toLocaleDateString('en-NZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function seedHold(
  id: string,
  roomId: string,
  dayOffset: number,
  time: string,
  partyName: string,
  status: HallHoldStatus,
  assigneeId?: string,
): HallHold {
  const date = addDaysIso(todayIso(), dayOffset)
  return {
    id,
    roomId,
    date,
    dayLabel: formatHallDayLabel(date),
    time,
    partyName,
    status,
    assigneeId,
  }
}

let holds: HallHold[] = [
  seedHold('h1', 'workshop', 0, '09:00', 'Bay Makers', 'confirmed', 'jordan'),
  seedHold('h2', 'seminar', 0, '13:00', 'Council workshop', 'hold', 'mira'),
  seedHold('h3', 'kitchen', 0, '10:00', '—', 'blocked'),
  seedHold('h4', 'workshop', 0, '15:00', 'After-school art', 'hold', 'sam'),
  seedHold('h5', 'seminar', 1, '09:00', 'Rotary lunch', 'confirmed', 'mira'),
  seedHold('h6', 'kitchen', 1, '11:00', 'Catering prep — festival', 'confirmed', 'jordan'),
  seedHold('h7', 'workshop', 1, '14:00', 'Pottery club', 'hold', 'sam'),
  seedHold('h8', 'seminar', 2, '10:00', '—', 'blocked'),
  seedHold('h9', 'seminar', 2, '15:00', 'Planning board', 'hold', 'mira'),
  seedHold('h10', 'kitchen', 2, '09:00', 'Food safety course', 'confirmed', 'jordan'),
  seedHold('h11', 'workshop', 3, '08:00', 'Photo studio hire', 'confirmed', 'sam'),
  seedHold('h12', 'workshop', 3, '13:00', 'Youth makers', 'hold', 'jordan'),
  seedHold('h13', 'seminar', 4, '11:00', 'Iwi hui', 'confirmed', 'mira'),
  seedHold('h14', 'kitchen', 4, '14:00', '—', 'blocked'),
  seedHold('h15', 'seminar', 5, '09:00', 'Weekend workshop', 'hold', 'sam'),
  seedHold('h16', 'workshop', 5, '16:00', 'Private hire', 'confirmed', 'jordan'),
  seedHold('h17', 'kitchen', 6, '10:00', 'Brunch club', 'confirmed', 'mira'),
  seedHold('h18', 'seminar', 7, '13:00', 'Staff training', 'hold', 'jordan'),
  seedHold('h19', 'workshop', 8, '09:00', 'Art retreat day 1', 'confirmed', 'sam'),
  seedHold('h20', 'workshop', 9, '09:00', 'Art retreat day 2', 'confirmed', 'sam'),
  seedHold('h21', 'kitchen', 10, '12:00', 'Pop-up kitchen', 'hold', 'mira'),
  seedHold('h22', 'seminar', 12, '15:00', 'AGM dry-run', 'hold', 'jordan'),
  seedHold('h23', 'seminar', 14, '10:00', 'Council hearing', 'confirmed', 'mira'),
]

export function roomById(id: string): HallRoom | undefined {
  return HALL_ROOMS.find((r) => r.id === id)
}

export function staffById(id: string): HallStaff | undefined {
  return HALL_STAFF.find((s) => s.id === id)
}

export function getHolds(): HallHold[] {
  return holds.map((h) => ({ ...h }))
}

export function getHoldsForDate(date: string): HallHold[] {
  return holds.filter((h) => h.date === date).map((h) => ({ ...h }))
}

export interface HallDayOccupancy {
  date: string
  label: string
  booked: number
  total: number
  pct: number
}

export function getHallWeekStrip(anchorDate: string, days = 14): HallDayOccupancy[] {
  const total = HALL_ROOMS.length * HALL_BOARD_HOURS.length
  const out: HallDayOccupancy[] = []
  for (let i = 0; i < days; i++) {
    const date = addDaysIso(anchorDate, i)
    const booked = holds.filter((h) => h.date === date).length
    out.push({
      date,
      label: formatHallDayLabel(date),
      booked,
      total,
      pct: Math.round((booked / Math.max(1, total)) * 100),
    })
  }
  return out
}

export function setHoldStatus(id: string, status: HallHoldStatus) {
  holds = holds.map((h) => (h.id === id ? { ...h, status } : h))
}

export function setHoldAssignee(id: string, assigneeId: string) {
  holds = holds.map((h) => (h.id === id ? { ...h, assigneeId: assigneeId || undefined } : h))
}

export function placeHold(roomId: string, date: string, time: string, partyName = 'New enquiry'): HallHold {
  const existing = holds.find((h) => h.roomId === roomId && h.date === date && h.time === time)
  if (existing) return { ...existing }
  const hold: HallHold = {
    id: `h-${Date.now()}`,
    roomId,
    date,
    dayLabel: formatHallDayLabel(date),
    time,
    partyName,
    status: 'hold',
  }
  holds = [...holds, hold]
  return { ...hold }
}

export interface FindNextHallOpts {
  afterDate: string
  afterTime?: string
  status?: HallHoldStatus
  roomId?: string
  query?: string
}

export function findNextHallHold(opts: FindNextHallOpts): HallHold | null {
  const q = opts.query?.trim().toLowerCase()
  const ranked = holds
    .filter((h) => {
      if (opts.status && h.status !== opts.status) return false
      if (opts.roomId && h.roomId !== opts.roomId) return false
      if (q) {
        const room = roomById(h.roomId)?.name.toLowerCase() ?? ''
        const staff = h.assigneeId ? (staffById(h.assigneeId)?.name.toLowerCase() ?? '') : ''
        const hay = `${h.partyName} ${room} ${staff} ${h.status}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (h.date > opts.afterDate) return true
      if (h.date === opts.afterDate) {
        return (opts.afterTime ? h.time > opts.afterTime : true)
      }
      return false
    })
    .sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)))
  return ranked[0] ? { ...ranked[0] } : null
}

export function estimateHallBooking(
  roomId: string,
  hours: number,
  extraIds: string[],
): { roomCost: number; extrasCost: number; mid: number; low: number; high: number } | null {
  const room = roomById(roomId)
  if (!room || hours < 1) return null
  const roomCost = room.hourlyRate * hours
  const extrasCost = HALL_EXTRAS.filter((e) => extraIds.includes(e.id)).reduce((s, e) => s + e.price, 0)
  const mid = roomCost + extrasCost
  return {
    roomCost,
    extrasCost,
    mid,
    low: Math.round(mid * 0.95 * 2) / 2,
    high: Math.round(mid * 1.1 * 2) / 2,
  }
}

export function formatHallBracket(est: { low: number; high: number }): string {
  if (est.low === est.high) return `$${est.low.toFixed(2)}`
  return `$${est.low.toFixed(2)}–$${est.high.toFixed(2)}`
}

export const LIVE_BOOK_URL = '/demo/rentals/book/'
export const LIVE_STAFF_URL = '/staff-demo/'

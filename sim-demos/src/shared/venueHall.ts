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

export interface HallHold {
  id: string
  roomId: string
  dayLabel: string
  time: string
  partyName: string
  status: 'hold' | 'confirmed' | 'blocked'
  assigneeId?: string
}

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

let holds: HallHold[] = [
  {
    id: 'h1',
    roomId: 'workshop',
    dayLabel: 'Tue',
    time: '09:00',
    partyName: 'Bay Makers',
    status: 'confirmed',
    assigneeId: 'jordan',
  },
  {
    id: 'h2',
    roomId: 'seminar',
    dayLabel: 'Tue',
    time: '13:00',
    partyName: 'Council workshop',
    status: 'hold',
    assigneeId: 'mira',
  },
  {
    id: 'h3',
    roomId: 'kitchen',
    dayLabel: 'Wed',
    time: '10:00',
    partyName: '—',
    status: 'blocked',
  },
]

export function roomById(id: string): HallRoom | undefined {
  return HALL_ROOMS.find((r) => r.id === id)
}

export function getHolds(): HallHold[] {
  return holds.map((h) => ({ ...h }))
}

export function setHoldStatus(id: string, status: HallHold['status']) {
  holds = holds.map((h) => (h.id === id ? { ...h, status } : h))
}

export function setHoldAssignee(id: string, assigneeId: string) {
  holds = holds.map((h) => (h.id === id ? { ...h, assigneeId } : h))
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

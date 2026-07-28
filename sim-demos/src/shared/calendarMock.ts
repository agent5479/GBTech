export type SlotStatus = 'open' | 'booked' | 'weather' | 'maintenance'

export interface DaySlot {
  time: string
  status: SlotStatus
  note?: string
}

export interface CalendarDay {
  date: string // YYYY-MM-DD
  label: string
  slots: DaySlot[]
}

const TIMES = ['08:00', '10:00', '12:00', '14:00', '16:00']

function addDays(from: Date, n: number): Date {
  const d = new Date(from)
  d.setDate(d.getDate() + n)
  return d
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function weekday(d: Date): string {
  return d.toLocaleDateString('en-NZ', { weekday: 'short', day: 'numeric', month: 'short' })
}

/** Deterministic mock blocks so demos look realistic without a backend. */
export function buildYachtCalendar(daysAhead = 10): CalendarDay[] {
  const start = new Date()
  start.setHours(12, 0, 0, 0)
  const days: CalendarDay[] = []

  for (let i = 1; i <= daysAhead; i++) {
    const d = addDays(start, i)
    const date = iso(d)
    const slots: DaySlot[] = TIMES.map((time, idx) => {
      // Patterned blocks
      if (i === 2 && (idx === 1 || idx === 2)) {
        return { time, status: 'booked', note: 'Private charter — already booked' }
      }
      if (i === 4 && idx >= 2) {
        return { time, status: 'weather', note: 'Skipper hold — strong northerly forecast' }
      }
      if (i === 6 && idx === 0) {
        return { time, status: 'maintenance', note: 'Vessel haul-out / safety check' }
      }
      if (i === 8 && (idx === 3 || idx === 4)) {
        return { time, status: 'booked', note: 'Sunset cruise reserved' }
      }
      return { time, status: 'open' }
    })
    days.push({ date, label: weekday(d), slots })
  }
  return days
}

export function slotLabel(status: SlotStatus): string {
  switch (status) {
    case 'open':
      return 'Available'
    case 'booked':
      return 'Booked'
    case 'weather':
      return 'Weather hold'
    case 'maintenance':
      return 'Maintenance'
  }
}

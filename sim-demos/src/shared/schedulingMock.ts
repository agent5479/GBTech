/** Week navigation helpers for ops admin boards. */

export interface WeekAnchor {
  /** ISO date string for Monday of the week */
  weekStart: string
  label: string
}

function addDays(from: Date, n: number): Date {
  const d = new Date(from)
  d.setDate(d.getDate() + n)
  return d
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function mondayOf(d: Date): Date {
  const copy = new Date(d)
  copy.setHours(12, 0, 0, 0)
  const day = copy.getDay()
  const diff = day === 0 ? -6 : 1 - day
  copy.setDate(copy.getDate() + diff)
  return copy
}

export function weekLabel(weekStart: string): string {
  const start = new Date(`${weekStart}T12:00:00`)
  const end = addDays(start, 4)
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })
  return `Week of ${fmt(start)} – ${fmt(end)}`
}

export function currentWeekStart(): string {
  return iso(mondayOf(new Date()))
}

export function shiftWeek(weekStart: string, deltaWeeks: number): string {
  const d = new Date(`${weekStart}T12:00:00`)
  return iso(addDays(d, deltaWeeks * 7))
}

export function buildWeekAnchors(count = 6, fromWeekStart?: string): WeekAnchor[] {
  const start = fromWeekStart ? new Date(`${fromWeekStart}T12:00:00`) : mondayOf(new Date())
  const anchors: WeekAnchor[] = []
  for (let i = 0; i < count; i++) {
    const ws = iso(addDays(start, i * 7))
    anchors.push({ weekStart: ws, label: weekLabel(ws) })
  }
  return anchors
}

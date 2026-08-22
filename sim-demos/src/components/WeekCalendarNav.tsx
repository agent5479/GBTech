import { shiftWeek, weekLabel } from '../shared/schedulingMock'

interface Props {
  weekStart: string
  onChange: (weekStart: string) => void
}

export function WeekCalendarNav({ weekStart, onChange }: Props) {
  return (
    <nav className="week-cal-nav" aria-label="Week navigation">
      <button type="button" className="btn ghost week-cal-nav__btn" onClick={() => onChange(shiftWeek(weekStart, -1))}>
        ← Prev
      </button>
      <p className="week-cal-nav__label">{weekLabel(weekStart)}</p>
      <button type="button" className="btn ghost week-cal-nav__btn" onClick={() => onChange(shiftWeek(weekStart, 1))}>
        Next →
      </button>
    </nav>
  )
}

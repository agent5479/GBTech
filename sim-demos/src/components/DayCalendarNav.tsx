import { shiftDate, formatHallDayLong, todayIso } from '../shared/venueHall'

interface Props {
  date: string
  onChange: (date: string) => void
}

/** Prev / next day + date picker + jump to today. */
export function DayCalendarNav({ date, onChange }: Props) {
  const isToday = date === todayIso()
  return (
    <nav className="week-cal-nav day-cal-nav" aria-label="Day navigation">
      <button type="button" className="btn ghost week-cal-nav__btn" onClick={() => onChange(shiftDate(date, -1))}>
        ← Prev day
      </button>
      <div className="day-cal-nav__centre">
        <p className="week-cal-nav__label">{formatHallDayLong(date)}</p>
        <label className="day-cal-nav__picker">
          <span className="visually-hidden">Jump to date</span>
          <input type="date" value={date} onChange={(e) => e.target.value && onChange(e.target.value)} />
        </label>
        {!isToday ? (
          <button type="button" className="btn ghost week-cal-nav__btn" onClick={() => onChange(todayIso())}>
            Today
          </button>
        ) : null}
      </div>
      <button type="button" className="btn ghost week-cal-nav__btn" onClick={() => onChange(shiftDate(date, 1))}>
        Next day →
      </button>
    </nav>
  )
}

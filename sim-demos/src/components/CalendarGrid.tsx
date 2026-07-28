import type { CalendarDay, DaySlot } from '../shared/calendarMock'
import { slotLabel } from '../shared/calendarMock'

interface Props {
  days: CalendarDay[]
  selectedDate?: string
  selectedTime?: string
  onSelect: (date: string, slot: DaySlot) => void
}

export function CalendarGrid({ days, selectedDate, selectedTime, onSelect }: Props) {
  return (
    <div className="cal-grid">
      {days.map((day) => (
        <div key={day.date} className={`cal-day${selectedDate === day.date ? ' is-selected-day' : ''}`}>
          <div className="cal-day-label">{day.label}</div>
          <div className="cal-slots">
            {day.slots.map((slot) => {
              const blocked = slot.status !== 'open'
              const selected = selectedDate === day.date && selectedTime === slot.time
              return (
                <button
                  key={slot.time}
                  type="button"
                  className={`cal-slot status-${slot.status}${selected ? ' is-selected' : ''}`}
                  disabled={blocked}
                  title={slot.note ?? slotLabel(slot.status)}
                  onClick={() => onSelect(day.date, slot)}
                >
                  <span className="cal-slot-time">{slot.time}</span>
                  <span className="cal-slot-status">{slotLabel(slot.status)}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

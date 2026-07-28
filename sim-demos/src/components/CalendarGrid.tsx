import type { CalendarDay, DaySlot } from '../shared/calendarMock'
import { slotLabel } from '../shared/calendarMock'
import type { DayForecast } from '../shared/weatherMock'

interface Props {
  days: CalendarDay[]
  selectedDate?: string
  selectedTime?: string
  /** Optional forecast — shows a compact weather cue on each day. */
  forecast?: DayForecast[]
  onSelect: (date: string, slot: DaySlot) => void
}

function weatherCue(f?: DayForecast): { mark: string; title: string } | null {
  if (!f) return null
  const title = `${f.summary} · ${f.windKt} kt ${f.windDir}`
  if (f.rainChance >= 40) return { mark: 'Rain', title }
  if (f.windKt >= 18) return { mark: 'Wind', title }
  if (f.windKt <= 10 && f.rainChance <= 15) return { mark: 'Fair', title }
  return { mark: 'Mixed', title }
}

export function CalendarGrid({ days, selectedDate, selectedTime, forecast, onSelect }: Props) {
  const byDate = new Map((forecast ?? []).map((f) => [f.date, f]))
  return (
    <div className="cal-grid">
      {days.map((day) => {
        const wx = byDate.get(day.date)
        return (
          <div key={day.date} className={`cal-day${selectedDate === day.date ? ' is-selected-day' : ''}`}>
            <div className="cal-day-label">
              <span>{day.label}</span>
              {wx && (
                <span className="cal-day-wx" title={weatherCue(wx)?.title}>
                  <strong>{weatherCue(wx)?.mark}</strong>
                  <small>
                    {wx.windKt}kt · {wx.rainChance}%
                  </small>
                </span>
              )}
            </div>
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
        )
      })}
    </div>
  )
}

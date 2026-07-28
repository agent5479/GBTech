import type { DayForecast } from '../shared/weatherMock'

interface Props {
  days: DayForecast[]
  selectedDate?: string
}

export function WeatherStrip({ days, selectedDate }: Props) {
  return (
    <div className="weather-strip">
      <p className="weather-note">Demo forecast — simulated (not live weather data)</p>
      <div className="weather-cards">
        {days.map((d) => (
          <div
            key={d.date}
            className={`weather-card${selectedDate === d.date ? ' is-active' : ''}`}
          >
            <strong>{d.label}</strong>
            <span className="weather-wind">
              {d.windKt} kt {d.windDir}
            </span>
            <span>Swell {d.swellM} m</span>
            <span>Rain {d.rainChance}%</span>
            <em>{d.summary}</em>
          </div>
        ))}
      </div>
    </div>
  )
}

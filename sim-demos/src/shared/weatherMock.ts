export interface DayForecast {
  date: string
  label: string
  windKt: number
  windDir: string
  swellM: number
  rainChance: number
  summary: string
}

export function buildDemoForecast(daysAhead = 7): DayForecast[] {
  const seed = [
    { windKt: 8, windDir: 'SW', swellM: 0.6, rainChance: 10, summary: 'Light breeze — ideal for a calm bay sail' },
    { windKt: 14, windDir: 'NW', swellM: 1.0, rainChance: 20, summary: 'Fresh nor-wester — good sailing, reef early' },
    { windKt: 18, windDir: 'N', swellM: 1.4, rainChance: 35, summary: 'Building northerly — some trips on hold' },
    { windKt: 22, windDir: 'N', swellM: 1.8, rainChance: 45, summary: 'Strong northerly — skipper weather hold likely' },
    { windKt: 12, windDir: 'SE', swellM: 0.9, rainChance: 15, summary: 'Settling — pleasant afternoon sailing' },
    { windKt: 10, windDir: 'S', swellM: 0.7, rainChance: 5, summary: 'Clear and mild across Golden Bay' },
    { windKt: 16, windDir: 'W', swellM: 1.2, rainChance: 25, summary: 'Gusty afternoon — sunset sails may shift' },
  ]

  const start = new Date()
  start.setHours(12, 0, 0, 0)
  return seed.slice(0, daysAhead).map((s, i) => {
    const d = new Date(start)
    d.setDate(d.getDate() + i + 1)
    return {
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-NZ', { weekday: 'short', day: 'numeric', month: 'short' }),
      ...s,
    }
  })
}

export function forecastForDate(date: string): DayForecast | undefined {
  return buildDemoForecast(10).find((f) => f.date === date)
}

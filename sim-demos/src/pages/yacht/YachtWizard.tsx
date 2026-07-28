import { useMemo, useState } from 'react'
import { DemoChrome } from '../../components/DemoChrome'
import { CalendarGrid } from '../../components/CalendarGrid'
import { WeatherStrip } from '../../components/WeatherStrip'
import { MapRoute } from '../../components/MapRoute'
import { useDemoPalette } from '../../hooks/useDemoPalette'
import { buildYachtCalendar } from '../../shared/calendarMock'
import { buildDemoForecast, forecastForDate } from '../../shared/weatherMock'
import { SAILING_ROUTES } from '../../shared/sailingRoutes'
import { YACHT_PACKAGES } from '../../shared/yachtPackages'
import { demoAtmosphereStyle } from '../../components/DemoHeroImage'

/** Coastal Charter — classic multi-step wizard (package → calendar → weather → route → confirm). */
export function YachtWizard() {
  const { paletteId, setPaletteId, style: paletteStyle } = useDemoPalette('yacht-coastal')
  const style = { ...demoAtmosphereStyle('coastal'), ...paletteStyle }
  const days = useMemo(() => buildYachtCalendar(10), [])
  const forecast = useMemo(() => buildDemoForecast(7), [])
  const [step, setStep] = useState(1)
  const [pkgId, setPkgId] = useState(YACHT_PACKAGES[0].id)
  const [date, setDate] = useState<string>()
  const [time, setTime] = useState<string>()
  const [routeId, setRouteId] = useState(SAILING_ROUTES[0].id)
  const [party, setParty] = useState(4)
  const [notes, setNotes] = useState('')
  const [done, setDone] = useState(false)

  const route = SAILING_ROUTES.find((r) => r.id === routeId)!
  const pkg = YACHT_PACKAGES.find((p) => p.id === pkgId)!
  const dayWeather = date ? forecastForDate(date) : undefined

  if (done) {
    return (
      <div className="yacht-page theme-coastal has-demo-atmosphere" style={style}>
        <DemoChrome
          theme="Coastal Charter"
          title="Demo booking confirmed"
          subtitle="Nothing was sent — this is a simulation only."
          paletteId={paletteId}
          onPaletteChange={setPaletteId}
          imageId="coastal"
        />
        <div className="yacht-panel success-panel">
          <h2>You&apos;re on the list (demo)</h2>
          <p>
            <strong>{pkg.name}</strong> on <strong>{date}</strong> at <strong>{time}</strong>
          </p>
          <p>
            Route: {route.name} · Party of {party}
          </p>
          {notes && <p>Notes: {notes}</p>}
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setDone(false)
              setStep(1)
            }}
          >
            Book another (demo)
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="yacht-page theme-coastal has-demo-atmosphere" style={style}>
      <DemoChrome
        theme="Coastal Charter"
        title="Coastal Charter"
        subtitle="Skippered Golden Bay sails — calm water, refined pacing. Classic step-by-step booking. Aesthetics fully customisable."
        paletteId={paletteId}
        onPaletteChange={setPaletteId}
        imageId="coastal"
      />

      <ol className="wizard-steps" aria-label="Booking steps">
        {[1, 2, 3, 4, 5].map((n) => (
          <li key={n} className={step === n ? 'active' : step > n ? 'done' : ''}>
            {n}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <section className="yacht-panel">
          <h2>1. Choose your experience</h2>
          <div className="pkg-grid">
            {YACHT_PACKAGES.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`pkg-card${pkgId === p.id ? ' selected' : ''}`}
                onClick={() => setPkgId(p.id)}
              >
                <strong>{p.name}</strong>
                <span>{p.duration}</span>
                <span className="pkg-price">{p.priceLabel}</span>
                <p>{p.blurb}</p>
              </button>
            ))}
          </div>
          <button type="button" className="btn primary" onClick={() => setStep(2)}>
            Continue
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="yacht-panel">
          <h2>2. Pick a date &amp; time</h2>
          <p className="hint">Grey / tinted slots are blocked — booked, weather hold, or maintenance.</p>
          <CalendarGrid
            days={days}
            selectedDate={date}
            selectedTime={time}
            onSelect={(d, slot) => {
              setDate(d)
              setTime(slot.time)
            }}
          />
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(1)}>
              Back
            </button>
            <button type="button" className="btn primary" disabled={!date || !time} onClick={() => setStep(3)}>
              Continue
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="yacht-panel">
          <h2>3. Weather for your sail</h2>
          <WeatherStrip days={forecast} selectedDate={date} />
          {dayWeather && (
            <p className="weather-pick">
              Selected day: <strong>{dayWeather.summary}</strong> · {dayWeather.windKt} kt {dayWeather.windDir}
            </p>
          )}
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(2)}>
              Back
            </button>
            <button type="button" className="btn primary" onClick={() => setStep(4)}>
              Continue
            </button>
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="yacht-panel">
          <h2>4. Choose a sailing path</h2>
          <div className="route-chips">
            {SAILING_ROUTES.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`chip${routeId === r.id ? ' selected' : ''}`}
                onClick={() => setRouteId(r.id)}
              >
                {r.name} · {r.durationHint}
              </button>
            ))}
          </div>
          <p className="hint">{route.blurb}</p>
          <MapRoute
            path={route.path}
            center={route.center}
            zoom={route.zoom}
            pathColor="#C9A227"
            label="Water-only sail path · estuary & open bay"
          />
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(3)}>
              Back
            </button>
            <button type="button" className="btn primary" onClick={() => setStep(5)}>
              Continue
            </button>
          </div>
        </section>
      )}

      {step === 5 && (
        <section className="yacht-panel">
          <h2>5. Party &amp; confirm</h2>
          <label className="field">
            Party size
            <input type="number" min={1} max={10} value={party} onChange={(e) => setParty(Number(e.target.value))} />
          </label>
          <label className="field">
            Notes for the skipper
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Dietary needs, celebration, etc." />
          </label>
          <div className="summary">
            <p>
              <strong>{pkg.name}</strong> · {date} {time}
            </p>
            <p>
              {route.name} · {party} guests · {pkg.priceLabel}
            </p>
          </div>
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(4)}>
              Back
            </button>
            <button type="button" className="btn primary" onClick={() => setDone(true)}>
              Confirm demo booking
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

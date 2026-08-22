import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapRoute } from '../../components/MapRoute'
import { DemoCardImage } from '../../components/DemoHeroImage'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import { buildYachtCalendar } from '../../shared/calendarMock'
import { forecastForDate } from '../../shared/weatherMock'
import { SAILING_ROUTES } from '../../shared/sailingRoutes'
import { YACHT_PACKAGES } from '../../shared/yachtPackages'

const CREW_ROLES = [
  { id: 'skipper', name: 'Skipper seat' },
  { id: 'helm', name: 'Helm trainee' },
  { id: 'photo', name: 'Photographer' },
  { id: 'deck', name: 'Deckhand' },
] as const

const WIND_GATE_KT = 18
const SWELL_GATE_M = 1.5

/**
 * Bay Adventure — map-first "mission deck" UI.
 * Sequence: route on map → day rail → time → wind/swell gate → crew roles → launch.
 */
export default function BayAdventure() {
  const days = useMemo(() => buildYachtCalendar(8), [])
  const [routeId, setRouteId] = useState(SAILING_ROUTES[1].id)
  const [date, setDate] = useState<string>()
  const [time, setTime] = useState<string>()
  const [crew, setCrew] = useState(6)
  const [roles, setRoles] = useState<string[]>(['skipper'])
  const [launched, setLaunched] = useState(false)

  const route = SAILING_ROUTES.find((r) => r.id === routeId)!
  const selectedDay = days.find((d) => d.date === date)
  const weather = date ? forecastForDate(date) : undefined
  const weatherGated = Boolean(
    weather && (weather.windKt >= WIND_GATE_KT || weather.swellM >= SWELL_GATE_M),
  )
  const roleNames = CREW_ROLES.filter((r) => roles.includes(r.id)).map((r) => r.name)
  const canLaunch = Boolean(date && time && roles.length > 0 && !weatherGated)

  const toggleRole = (id: string) => {
    setRoles((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  if (launched) {
    return (
      <div className="adventure-page theme-adventure">
        <div className="adventure-launch-ok demo-enter-success">
          <p className="demo-badge">Simulated · not a real booking</p>
          <h1>Mission locked in</h1>
          <p>{route.name}</p>
          <p>
            {date} @ {time} · crew {crew}
          </p>
          <p>{roleNames.join(' · ')}</p>
          <DemoQuoteCta styleName="Bay Adventure" />
          <button type="button" className="btn ghost" onClick={() => setLaunched(false)}>
            Plan another mission
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
        <DemoPitchBar
          packageTier="advanced"
          compareTo="/yacht/coastal"
          compareLabel="Skippered bay sail"
          engineNote="Two jobs, not two skins — map-first adventure day vs skippered bay sail."
        />
      </div>
    )
  }

  return (
    <div className="adventure-page theme-adventure">
      <header className="adventure-top">
        <Link to="/" className="demo-back">
          ← All demos
        </Link>
        <div>
          <p className="demo-badge">Bay Adventure · mission deck</p>
          <h1>Mission deck day</h1>
          <p className="demo-sub">
            Route first on the map, then day and time. Wind/swell can gate launch; crew roles sit on the mission, not a
            package radio.
          </p>
        </div>
        <span className="demo-theme-tag">Different UI · not a recolour</span>
      </header>
      <div className="demo-hero-photo">
        <DemoCardImage id="adventure" className="demo-hero-photo__img" />
      </div>
      <DemoPitchBar
        packageTier="advanced"
        compareTo="/yacht/coastal"
        compareLabel="Skippered bay sail"
        engineNote="Two jobs, not two skins — map-first adventure day vs skippered bay sail."
      />

      <div className="adventure-deck demo-enter">
        <aside className="adventure-map-pane">
          <div className="route-toggle">
            {SAILING_ROUTES.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`mission-tab${routeId === r.id ? ' on' : ''}`}
                onClick={() => setRouteId(r.id)}
              >
                <strong>{r.name}</strong>
                <span>{r.durationHint}</span>
              </button>
            ))}
          </div>
          <MapRoute
            path={route.path}
            center={route.center}
            zoom={route.zoom}
            pathColor="#E85A4F"
            className="demo-map adventure-map"
            label="Water-only sail path · estuary & open bay"
          />
          <p className="adventure-blurb">{route.blurb}</p>
        </aside>

        <aside className="adventure-controls">
          <div
            className="mission-recap demo-live-tick"
            key={`${routeId}-${date ?? ''}-${time ?? ''}-${crew}-${roles.join(',')}`}
            aria-live="polite"
          >
            <span className="mission-recap-kicker">Mission locked so far</span>
            <ul>
              <li>
                <em>Route</em> {route.name}
              </li>
              <li>
                <em>When</em> {date && time ? `${date} @ ${time}` : '—'}
              </li>
              <li>
                <em>Gate</em>{' '}
                {weatherGated ? 'Wind/swell hold' : weather ? 'Clear to launch' : 'Pick a day'}
              </li>
              <li>
                <em>Crew</em> {crew}
                {roleNames.length ? ` · ${roleNames.join(', ')}` : ' · pick a role'}
              </li>
            </ul>
          </div>

          <section>
            <h2>When</h2>
            <div className="day-rail" role="listbox" aria-label="Available days">
              {days.map((d) => {
                const openCount = d.slots.filter((s) => s.status === 'open').length
                const blocked = openCount === 0
                return (
                  <button
                    key={d.date}
                    type="button"
                    role="option"
                    aria-selected={date === d.date}
                    disabled={blocked}
                    className={`day-pill${date === d.date ? ' on' : ''}${blocked ? ' blocked' : ''}`}
                    title={blocked ? 'No open slots' : `${openCount} open`}
                    onClick={() => {
                      setDate(d.date)
                      setTime(undefined)
                    }}
                  >
                    <span>{d.label}</span>
                    <small>{blocked ? 'Full' : `${openCount} open`}</small>
                  </button>
                )
              })}
            </div>

            {selectedDay && (
              <div className="time-rail">
                {selectedDay.slots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={slot.status !== 'open'}
                    className={`time-chip status-${slot.status}${time === slot.time ? ' on' : ''}`}
                    title={slot.note}
                    onClick={() => setTime(slot.time)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}

            {weather && (
              <div className={`adventure-wx${weatherGated ? ' gated' : ''}`}>
                <strong>
                  {weather.windKt} kt {weather.windDir}
                </strong>
                <span>
                  Swell {weather.swellM}m · Rain {weather.rainChance}%
                </span>
                <em>{weather.summary}</em>
                {weatherGated && (
                  <p className="weather-gate" role="status">
                    Wind/swell gate — this day is on hold ({WIND_GATE_KT} kt+ or {SWELL_GATE_M} m+ swell). Pick another
                    date to launch.
                  </p>
                )}
              </div>
            )}
          </section>

          <section className="crew-section">
            <h2>Crew roles</h2>
            <p className="hint">At least one seat. Headcount is separate from who is on the boat.</p>
            <div className="job-chip-stack" role="group" aria-label="Crew roles">
              {CREW_ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`chip${roles.includes(r.id) ? ' selected' : ''}`}
                  aria-pressed={roles.includes(r.id)}
                  onClick={() => toggleRole(r.id)}
                >
                  {r.name}
                </button>
              ))}
            </div>
            {roles.length === 0 && <p className="hint">Select at least one role to launch.</p>}
            <div className="crew-stepper" aria-label="Headcount">
              <button type="button" aria-label="Fewer" onClick={() => setCrew((c) => Math.max(1, c - 1))}>
                −
              </button>
              <strong>{crew}</strong>
              <button type="button" aria-label="More" onClick={() => setCrew((c) => Math.min(12, c + 1))}>
                +
              </button>
            </div>
          </section>

          <p className="hint adventure-pkg-note">
            Typical packages (optional note, not a control): {YACHT_PACKAGES.map((p) => p.name).join(' · ')}
          </p>

          <button type="button" className="btn primary launch-btn" disabled={!canLaunch} onClick={() => setLaunched(true)}>
            Launch mission (demo)
          </button>
        </aside>
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapRoute } from '../../components/MapRoute'
import { buildYachtCalendar } from '../../shared/calendarMock'
import { forecastForDate } from '../../shared/weatherMock'
import { SAILING_ROUTES } from '../../shared/sailingRoutes'
import { YACHT_PACKAGES } from '../../shared/yachtPackages'

/**
 * Bay Adventure — map-first "mission deck" UI.
 * Sequence: route on map → day rail → time → experience → crew → launch.
 * Split layout on tablet (map | controls), not a 5-step wizard.
 */
export default function BayAdventure() {
  const days = useMemo(() => buildYachtCalendar(8), [])
  const [routeId, setRouteId] = useState(SAILING_ROUTES[1].id)
  const [date, setDate] = useState<string>()
  const [time, setTime] = useState<string>()
  const [pkgId, setPkgId] = useState(YACHT_PACKAGES[1].id)
  const [crew, setCrew] = useState(6)
  const [launched, setLaunched] = useState(false)

  const route = SAILING_ROUTES.find((r) => r.id === routeId)!
  const pkg = YACHT_PACKAGES.find((p) => p.id === pkgId)!
  const selectedDay = days.find((d) => d.date === date)
  const weather = date ? forecastForDate(date) : undefined
  const canLaunch = Boolean(date && time)

  if (launched) {
    return (
      <div className="adventure-page theme-adventure">
        <div className="adventure-launch-ok">
          <p className="demo-badge">Simulated · not a real booking</p>
          <h1>Mission locked in</h1>
          <p>
            {route.name} · {pkg.name}
          </p>
          <p>
            {date} @ {time} · crew {crew}
          </p>
          <button type="button" className="btn primary" onClick={() => setLaunched(false)}>
            Plan another mission
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
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
          <p className="demo-badge">Bay Adventure · map-first booking</p>
          <h1>Pick your mission</h1>
        </div>
        <span className="demo-theme-tag">Different UI · not a recolour</span>
      </header>

      <div className="adventure-deck">
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
              <div className="adventure-wx">
                <strong>
                  {weather.windKt} kt {weather.windDir}
                </strong>
                <span>
                  Swell {weather.swellM}m · Rain {weather.rainChance}%
                </span>
                <em>{weather.summary}</em>
              </div>
            )}
          </section>

          <section>
            <h2>Experience</h2>
            <div className="exp-stack">
              {YACHT_PACKAGES.map((p) => (
                <label key={p.id} className={`exp-row${pkgId === p.id ? ' on' : ''}`}>
                  <input type="radio" name="exp" checked={pkgId === p.id} onChange={() => setPkgId(p.id)} />
                  <span>
                    <strong>{p.name}</strong>
                    <small>
                      {p.duration} · {p.priceLabel}
                    </small>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="crew-section">
            <h2>Crew</h2>
            <div className="crew-stepper">
              <button type="button" aria-label="Fewer" onClick={() => setCrew((c) => Math.max(1, c - 1))}>
                −
              </button>
              <strong>{crew}</strong>
              <button type="button" aria-label="More" onClick={() => setCrew((c) => Math.min(12, c + 1))}>
                +
              </button>
            </div>
          </section>

          <button type="button" className="btn primary launch-btn" disabled={!canLaunch} onClick={() => setLaunched(true)}>
            Launch mission (demo)
          </button>
        </aside>
      </div>
    </div>
  )
}

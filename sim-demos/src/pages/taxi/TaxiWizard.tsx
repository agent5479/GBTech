import { useEffect, useMemo, useState } from 'react'
import { DemoChrome } from '../../components/DemoChrome'
import { PhoneShell } from '../../components/PhoneShell'
import { MapRoute } from '../../components/MapRoute'
import { useDemoPalette } from '../../hooks/useDemoPalette'
import { FareBreakdownView } from '../../components/FareBreakdown'
import { demoAtmosphereStyle } from '../../components/DemoHeroImage'
import { GB_PLACES, placeById } from '../../shared/gbPlaces'
import {
  estimateFare,
  formatFareBracket,
  maxPassengersFor,
  type VehicleTier,
} from '../../shared/fareEstimate'
import { roadDistanceKm, roadPathBetween } from '../../shared/taxiRoutes'
import type { LatLng } from '../../shared/sailingRoutes'

/** Mohua Ride — phone-shell ride-hail flow. */
export function TaxiWizard() {
  const { paletteId, setPaletteId, style: paletteStyle } = useDemoPalette('taxi-mohua')
  const style = { ...demoAtmosphereStyle('mohua'), ...paletteStyle }
  const [pickup, setPickup] = useState('takaka')
  const [dropoff, setDropoff] = useState('pohara')
  const [tier, setTier] = useState<VehicleTier>('standard')
  const [passengers, setPassengers] = useState(1)
  const [when, setWhen] = useState<'now' | 'later'>('now')
  const [laterTime, setLaterTime] = useState('17:30')
  const [done, setDone] = useState(false)

  const maxPax = maxPassengersFor(tier)
  const paxOptions = 7

  const setPassengerCount = (n: number) => {
    setPassengers(n)
    if (n > 4) setTier('van')
  }

  useEffect(() => {
    setPassengers((p) => Math.min(p, maxPax))
  }, [maxPax])

  const from = placeById(pickup)!
  const to = placeById(dropoff)!
  const same = pickup === dropoff
  const km = same ? 0 : (roadDistanceKm(pickup, dropoff) ?? 0)
  const peak = when === 'later' || new Date().getHours() >= 17
  const fare = useMemo(
    () => estimateFare(km || 1, tier, peak && !same, passengers),
    [km, tier, peak, same, passengers]
  )

  const path: LatLng[] = useMemo(
    () =>
      same
        ? [[from.lat, from.lng]]
        : roadPathBetween(pickup, dropoff, [from.lat, from.lng], [to.lat, to.lng]),
    [same, pickup, dropoff, from, to]
  )

  const center: LatLng = [(from.lat + to.lat) / 2, (from.lng + to.lng) / 2]

  if (done) {
    return (
      <div className="taxi-page theme-mohua has-demo-atmosphere" style={style}>
        <DemoChrome
          theme="Mohua Ride"
          title="Demo ride requested"
          subtitle="Nothing was dispatched — simulation only."
          paletteId={paletteId}
          onPaletteChange={setPaletteId}
          imageId="mohua"
        />
        <PhoneShell brand="Mohua Ride">
          <div className="taxi-success">
            <h2>Driver matching… (demo)</h2>
            <p>
              {from.name} → {to.name}
            </p>
            <p>
              {passengers} passenger{passengers === 1 ? '' : 's'} · {tier === 'van' ? 'Van' : 'Standard'}
            </p>
            <p className="estimate">{formatFareBracket(fare)} est.</p>
            <button type="button" className="btn primary" onClick={() => setDone(false)}>
              New demo ride
            </button>
          </div>
        </PhoneShell>
      </div>
    )
  }

  return (
    <div className="taxi-page theme-mohua has-demo-atmosphere" style={style}>
      <DemoChrome
        theme="Mohua Ride"
        title="Mohua Ride"
        subtitle="Phone-first private taxi — road route + passenger-based fare bracket (simulated). Aesthetics fully customisable."
        paletteId={paletteId}
        onPaletteChange={setPaletteId}
        imageId="mohua"
      />
      <PhoneShell brand="Mohua Ride">
        <div className="taxi-flow">
          <label className="field">
            Pickup
            <select value={pickup} onChange={(e) => setPickup(e.target.value)}>
              {GB_PLACES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Drop-off
            <select value={dropoff} onChange={(e) => setDropoff(e.target.value)}>
              {GB_PLACES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          {same && <p className="warn">Choose different pickup and drop-off.</p>}

          <div className="pax-block">
            <span className="pax-label">Passengers</span>
            <div className="pax-row" role="group" aria-label="Passenger count">
              {Array.from({ length: paxOptions }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`pax-chip${passengers === n ? ' on' : ''}`}
                  onClick={() => setPassengerCount(n)}
                >
                  {n}
                </button>
              ))}
            </div>
            {passengers > 4 && <p className="fare-bracket-note">5+ passengers uses Van.</p>}
          </div>

          <div className="tier-row">
            <button type="button" className={`tier${tier === 'standard' ? ' on' : ''}`} onClick={() => setTier('standard')}>
              Standard
              <small>Up to 4</small>
            </button>
            <button type="button" className={`tier${tier === 'van' ? ' on' : ''}`} onClick={() => setTier('van')}>
              Van
              <small>Up to 7</small>
            </button>
          </div>

          <div className="when-row">
            <button type="button" className={`tier${when === 'now' ? ' on' : ''}`} onClick={() => setWhen('now')}>
              Now
            </button>
            <button type="button" className={`tier${when === 'later' ? ' on' : ''}`} onClick={() => setWhen('later')}>
              Later
            </button>
            {when === 'later' && (
              <input type="time" value={laterTime} onChange={(e) => setLaterTime(e.target.value)} />
            )}
          </div>

          <MapRoute
            path={path}
            center={center}
            zoom={11}
            pathColor="#D3993C"
            className="demo-map mini"
            label="Road route · OpenStreetMap / OSRM"
          />

          {!same && <FareBreakdownView fare={fare} peak={peak} />}

          <button type="button" className="btn primary sticky-cta" disabled={same} onClick={() => setDone(true)}>
            Request demo ride · {same ? '—' : formatFareBracket(fare)}
          </button>
        </div>
      </PhoneShell>
    </div>
  )
}

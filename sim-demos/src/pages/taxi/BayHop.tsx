import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapRoute } from '../../components/MapRoute'
import { GB_PLACES, placeById } from '../../shared/gbPlaces'
import {
  estimateFare,
  formatFareBracket,
  maxPassengersFor,
  type VehicleTier,
} from '../../shared/fareEstimate'
import { roadDistanceKm, roadPathBetween } from '../../shared/taxiRoutes'
import type { LatLng } from '../../shared/sailingRoutes'
import { PaletteSwitcher } from '../../components/PaletteSwitcher'
import { DemoHeroImage, demoAtmosphereStyle } from '../../components/DemoHeroImage'
import { useDemoPalette } from '../../hooks/useDemoPalette'

const SLOTS = ['ASAP', '16:00', '17:00', '18:00', '19:30', '21:00']
const BAY_CENTER: LatLng = [-40.82, 172.82]

/**
 * Bay Hop — tablet trip board (not a phone shell).
 * Sequence: tap From → tap To on place grid → vehicle cards → passengers → time rail → confirm.
 */
export default function BayHop() {
  const { paletteId, setPaletteId, style: paletteStyle } = useDemoPalette('taxi-bayhop')
  const style = { ...demoAtmosphereStyle('bayhop'), ...paletteStyle }
  const [phase, setPhase] = useState<'from' | 'to' | 'book'>('from')
  const [pickup, setPickup] = useState<string>()
  const [dropoff, setDropoff] = useState<string>()
  const [tier, setTier] = useState<VehicleTier>('standard')
  const [passengers, setPassengers] = useState(2)
  const [slot, setSlot] = useState('ASAP')
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

  const from = pickup ? placeById(pickup) : undefined
  const to = dropoff ? placeById(dropoff) : undefined
  const ready = Boolean(from && to && from.id !== to.id)
  const km = ready ? (roadDistanceKm(from!.id, to!.id) ?? 0) : 0
  const peak = slot !== 'ASAP'
  const fare = useMemo(
    () => (ready ? estimateFare(km, tier, peak, passengers) : null),
    [ready, km, tier, peak, passengers]
  )

  const path: LatLng[] = useMemo(() => {
    if (!from || !to || from.id === to.id) return [BAY_CENTER]
    return roadPathBetween(from.id, to.id, [from.lat, from.lng], [to.lat, to.lng])
  }, [from, to])

  const center: LatLng = from && to ? [(from.lat + to.lat) / 2, (from.lng + to.lng) / 2] : BAY_CENTER

  if (done && from && to && fare) {
    return (
      <div className="bayhop-page theme-bayhop has-demo-atmosphere" style={style}>
        <PaletteSwitcher value={paletteId} onChange={setPaletteId} />
        <div className="bayhop-done">
          <p className="demo-badge">Simulated · not dispatched</p>
          <h1>Hop confirmed</h1>
          <p>
            {from.name} → {to.name}
          </p>
          <p className="bayhop-big">{formatFareBracket(fare)}</p>
          <p>
            {passengers} passenger{passengers === 1 ? '' : 's'} · {tier === 'van' ? 'Van' : 'Standard'} · {slot}
          </p>
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setDone(false)
              setPhase('from')
              setPickup(undefined)
              setDropoff(undefined)
            }}
          >
            Plan another hop
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bayhop-page theme-bayhop has-demo-atmosphere" style={style}>
      <header className="bayhop-bar">
        <Link to="/" className="demo-back">
          ← All demos
        </Link>
        <div>
          <p className="demo-badge">Bay Hop · trip board</p>
          <h1>Where to?</h1>
        </div>
        <ol className="bayhop-phases">
          <li className={phase === 'from' ? 'on' : pickup ? 'done' : ''}>1 From</li>
          <li className={phase === 'to' ? 'on' : dropoff ? 'done' : ''}>2 To</li>
          <li className={phase === 'book' ? 'on' : ''}>3 Book</li>
        </ol>
      </header>
      <DemoHeroImage id="bayhop" />
      <PaletteSwitcher value={paletteId} onChange={setPaletteId} />

      <div className="bayhop-board">
        <section className="bayhop-places">
          <h2>
            {phase === 'from' && 'Tap pickup'}
            {phase === 'to' && 'Tap drop-off'}
            {phase === 'book' && 'Trip ready'}
          </h2>
          <div className="place-grid">
            {GB_PLACES.map((p) => {
              const isFrom = pickup === p.id
              const isTo = dropoff === p.id
              const locked = phase === 'book'
              const blocked = phase === 'to' && p.id === pickup
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={locked || blocked}
                  className={`place-tile${isFrom ? ' is-from' : ''}${isTo ? ' is-to' : ''}${locked ? ' locked' : ''}`}
                  onClick={() => {
                    if (phase === 'from') {
                      setPickup(p.id)
                      setDropoff(undefined)
                      setPhase('to')
                    } else if (phase === 'to') {
                      if (p.id === pickup) return
                      setDropoff(p.id)
                      setPhase('book')
                    }
                  }}
                >
                  <span className="place-tag">{isFrom ? 'FROM' : isTo ? 'TO' : ''}</span>
                  {p.name}
                </button>
              )
            })}
          </div>
          {phase !== 'from' && (
            <button
              type="button"
              className="btn ghost bayhop-reset"
              onClick={() => {
                setPhase('from')
                setPickup(undefined)
                setDropoff(undefined)
              }}
            >
              Reset trip
            </button>
          )}
        </section>

        <section className="bayhop-side">
          <MapRoute
            path={path}
            center={center}
            zoom={ready ? 11 : 10}
            pathColor="#C8F542"
            className="demo-map bayhop-map"
            label={ready ? 'Road route · OpenStreetMap / OSRM' : 'Select From and To'}
          />

          {ready && fare && (
            <>
              <div className="bayhop-estimate">
                <div>
                  <span>Road distance</span>
                  <strong>{km} km</strong>
                </div>
                <div>
                  <span>Est. cost</span>
                  <strong className="bayhop-big">{formatFareBracket(fare)}</strong>
                </div>
              </div>

              <div className="vehicle-cards">
                <button type="button" className={`v-card${tier === 'standard' ? ' on' : ''}`} onClick={() => setTier('standard')}>
                  <strong>Standard</strong>
                  <span>Up to 4</span>
                </button>
                <button type="button" className={`v-card${tier === 'van' ? ' on' : ''}`} onClick={() => setTier('van')}>
                  <strong>Van</strong>
                  <span>Up to 7</span>
                </button>
              </div>

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

              <div className="slot-rail">
                {SLOTS.map((s) => (
                  <button key={s} type="button" className={`slot${slot === s ? ' on' : ''}`} onClick={() => setSlot(s)}>
                    {s}
                    {s !== 'ASAP' && <small>peak</small>}
                  </button>
                ))}
              </div>

              <p className="bayhop-breakdown">
                Mid ${fare.mid.toFixed(2)}
                {fare.passengerSurcharge > 0 ? ` · +$${fare.passengerSurcharge.toFixed(2)} for extra pax` : ''}
                {fare.peakSurcharge > 0 ? ` · peak $${fare.peakSurcharge.toFixed(2)}` : ''}
                {' · '}
                bracket {formatFareBracket(fare)}
              </p>

              <button type="button" className="btn primary launch-btn" disabled={phase !== 'book'} onClick={() => setDone(true)}>
                Confirm hop · {formatFareBracket(fare)}
              </button>
            </>
          )}

          {!ready && <p className="bayhop-hint">Select From, then To on the place board — road path and fare appear here.</p>}
        </section>
      </div>
    </div>
  )
}

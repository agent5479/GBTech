import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapRoute } from '../../components/MapRoute'
import { GB_PLACES, distanceKm, placeById } from '../../shared/gbPlaces'
import { estimateFare, type VehicleTier } from '../../shared/fareEstimate'
import type { LatLng } from '../../shared/sailingRoutes'

const SLOTS = ['ASAP', '16:00', '17:00', '18:00', '19:30', '21:00']

/**
 * Bay Hop — tablet trip board (not a phone shell).
 * Sequence: tap From → tap To on place grid → vehicle cards → time rail → confirm.
 * Landscape: map + estimate column; place grid as primary interaction.
 */
export default function BayHop() {
  const [phase, setPhase] = useState<'from' | 'to' | 'book'>('from')
  const [pickup, setPickup] = useState<string>()
  const [dropoff, setDropoff] = useState<string>()
  const [tier, setTier] = useState<VehicleTier>('standard')
  const [slot, setSlot] = useState('ASAP')
  const [done, setDone] = useState(false)

  const from = pickup ? placeById(pickup) : undefined
  const to = dropoff ? placeById(dropoff) : undefined
  const ready = Boolean(from && to && from.id !== to.id)
  const km = ready ? distanceKm(from!, to!) : 0
  const peak = slot !== 'ASAP'
  const fare = useMemo(
    () => (ready ? estimateFare(km, tier, peak) : null),
    [ready, km, tier, peak]
  )

  const path: LatLng[] = useMemo(() => {
    if (!from || !to) return [[-40.82, 172.82], [-40.82, 172.82]]
    const mid: LatLng = [(from.lat + to.lat) / 2 - 0.015, (from.lng + to.lng) / 2 + 0.02]
    return [
      [from.lat, from.lng],
      mid,
      [to.lat, to.lng],
    ]
  }, [from, to])

  const center: LatLng = from && to ? [(from.lat + to.lat) / 2, (from.lng + to.lng) / 2] : [-40.82, 172.82]

  if (done && from && to && fare) {
    return (
      <div className="bayhop-page theme-bayhop">
        <div className="bayhop-done">
          <p className="demo-badge">Simulated · not dispatched</p>
          <h1>Hop confirmed</h1>
          <p>
            {from.name} → {to.name}
          </p>
          <p className="bayhop-big">${fare.total.toFixed(2)}</p>
          <p>
            {tier === 'van' ? 'Van' : 'Standard'} · {slot}
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
    <div className="bayhop-page theme-bayhop">
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
          <MapRoute path={path} center={center} zoom={11} pathColor="#C8F542" className="demo-map bayhop-map" />

          {ready && fare && (
            <>
              <div className="bayhop-estimate">
                <div>
                  <span>Distance</span>
                  <strong>{km} km</strong>
                </div>
                <div>
                  <span>Est. fare</span>
                  <strong className="bayhop-big">${fare.total.toFixed(2)}</strong>
                </div>
              </div>

              <div className="vehicle-cards">
                <button type="button" className={`v-card${tier === 'standard' ? ' on' : ''}`} onClick={() => setTier('standard')}>
                  <strong>Standard</strong>
                  <span>Up to 4</span>
                </button>
                <button type="button" className={`v-card${tier === 'van' ? ' on' : ''}`} onClick={() => setTier('van')}>
                  <strong>Van</strong>
                  <span>Up to 7 · +15%</span>
                </button>
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
                Base ${fare.base.toFixed(2)} + distance ${fare.distanceCharge.toFixed(2)}
                {fare.peakSurcharge > 0 ? ` + peak $${fare.peakSurcharge.toFixed(2)}` : ''}
              </p>

              <button type="button" className="btn primary launch-btn" disabled={phase !== 'book'} onClick={() => setDone(true)}>
                Confirm hop (demo)
              </button>
            </>
          )}

          {!ready && <p className="bayhop-hint">Select From, then To on the place board — map and fare appear here.</p>}
        </section>
      </div>
    </div>
  )
}

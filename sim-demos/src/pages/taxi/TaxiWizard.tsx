import { useMemo, useState } from 'react'
import { DemoChrome } from '../../components/DemoChrome'
import { PhoneShell } from '../../components/PhoneShell'
import { MapRoute } from '../../components/MapRoute'
import { FareBreakdownView } from '../../components/FareBreakdown'
import { GB_PLACES, distanceKm, placeById } from '../../shared/gbPlaces'
import { estimateFare, type VehicleTier } from '../../shared/fareEstimate'
import type { LatLng } from '../../shared/sailingRoutes'

interface Props {
  themeClass: 'theme-mohua' | 'theme-bayhop'
  brandName: string
  tagline: string
}

export function TaxiWizard({ themeClass, brandName, tagline }: Props) {
  const [pickup, setPickup] = useState('takaka')
  const [dropoff, setDropoff] = useState('pohara')
  const [tier, setTier] = useState<VehicleTier>('standard')
  const [when, setWhen] = useState<'now' | 'later'>('now')
  const [laterTime, setLaterTime] = useState('17:30')
  const [done, setDone] = useState(false)

  const from = placeById(pickup)!
  const to = placeById(dropoff)!
  const same = pickup === dropoff
  const km = same ? 0 : distanceKm(from, to)
  const peak = when === 'later' || (typeof window !== 'undefined' && new Date().getHours() >= 17)
  const fare = useMemo(() => estimateFare(km || 1, tier, peak && !same), [km, tier, peak, same])

  const path: LatLng[] = useMemo(() => {
    const mid: LatLng = [(from.lat + to.lat) / 2 + 0.01, (from.lng + to.lng) / 2 - 0.01]
    return [
      [from.lat, from.lng],
      mid,
      [to.lat, to.lng],
    ]
  }, [from, to])

  const pathColor = themeClass === 'theme-mohua' ? '#D3993C' : '#C8F542'
  const center: LatLng = [(from.lat + to.lat) / 2, (from.lng + to.lng) / 2]

  if (done) {
    return (
      <div className={`taxi-page ${themeClass}`}>
        <DemoChrome theme={brandName} title="Demo ride requested" subtitle="Nothing was dispatched — simulation only." />
        <PhoneShell brand={brandName}>
          <div className="taxi-success">
            <h2>Driver matching… (demo)</h2>
            <p>
              {from.name} → {to.name}
            </p>
            <p className="estimate">${fare.total.toFixed(2)} est.</p>
            <button type="button" className="btn primary" onClick={() => setDone(false)}>
              New demo ride
            </button>
          </div>
        </PhoneShell>
      </div>
    )
  }

  return (
    <div className={`taxi-page ${themeClass}`}>
      <DemoChrome theme={brandName} title={brandName} subtitle={tagline} />
      <PhoneShell brand={brandName}>
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

          <div className="tier-row">
            <button type="button" className={`tier${tier === 'standard' ? ' on' : ''}`} onClick={() => setTier('standard')}>
              Standard
            </button>
            <button type="button" className={`tier${tier === 'van' ? ' on' : ''}`} onClick={() => setTier('van')}>
              Van
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

          <MapRoute path={path} center={center} zoom={11} pathColor={pathColor} className="demo-map mini" />

          {!same && <FareBreakdownView fare={fare} peak={peak} />}

          <button type="button" className="btn primary sticky-cta" disabled={same} onClick={() => setDone(true)}>
            Request demo ride · ${same ? '—' : fare.total.toFixed(2)}
          </button>
        </div>
      </PhoneShell>
    </div>
  )
}

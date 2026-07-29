import type { FareBreakdown } from '../shared/fareEstimate'
import { formatFareBracket } from '../shared/fareEstimate'

interface Props {
  fare: FareBreakdown
  peak: boolean
}

export function FareBreakdownView({ fare, peak }: Props) {
  return (
    <div className="fare-box demo-live-tick" key={`${fare.km}-${fare.passengers}-${fare.low}-${fare.high}`}>
      <div className="fare-row">
        <span>Distance</span>
        <strong>{fare.km} km</strong>
      </div>
      <div className="fare-row">
        <span>Passengers</span>
        <strong>{fare.passengers}</strong>
      </div>
      <div className="fare-row">
        <span>Base fare</span>
        <span>${fare.base.toFixed(2)}</span>
      </div>
      <div className="fare-row">
        <span>
          Distance ({fare.km} × ${fare.perKm.toFixed(2)})
        </span>
        <span>${fare.distanceCharge.toFixed(2)}</span>
      </div>
      {fare.passengerSurcharge > 0 && (
        <div className="fare-row">
          <span>Extra passengers</span>
          <span>${fare.passengerSurcharge.toFixed(2)}</span>
        </div>
      )}
      {peak && (
        <div className="fare-row">
          <span>Peak surcharge (20%)</span>
          <span>${fare.peakSurcharge.toFixed(2)}</span>
        </div>
      )}
      {fare.vehicleMultiplier > 1 && (
        <div className="fare-row">
          <span>Van multiplier</span>
          <span>×{fare.vehicleMultiplier}</span>
        </div>
      )}
      <div className="fare-row fare-total">
        <span>Estimated cost</span>
        <strong>{formatFareBracket(fare)}</strong>
      </div>
      <p className="fare-bracket-note">Estimate bracket — final fare may vary with traffic and wait time.</p>
    </div>
  )
}

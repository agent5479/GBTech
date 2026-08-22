import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoChrome } from '../../components/DemoChrome'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import {
  RIDE_TYPES,
  STAYS,
  freeHorses,
  horseById,
  minutesOf,
  rideById,
  scriptAvailability,
  scriptBook,
  stayById,
  syncLabels,
  type RideId,
  type RideWindow,
  type StayId,
  type WindowStatus,
} from '../../shared/horseYard'

/**
 * Shore Ride — guest wizard.
 * Ride type → tide/sun window (calendar conflict check) → horse + optional stay → confirm.
 */
export default function ShoreRide() {
  const [, setTick] = useState(0)
  const refresh = () => setTick((n) => n + 1)

  const [step, setStep] = useState(2)
  const [rideId, setRideId] = useState<RideId>('beach')
  const [windowDate, setWindowDate] = useState<string>()
  const [horseId, setHorseId] = useState<string>()
  const [stayId, setStayId] = useState<StayId | 'none'>('none')
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ride = rideById(rideId)
  const windows = useMemo(() => scriptAvailability(rideId), [rideId, done])
  const chosen = windows.find((w) => w.date === windowDate)
  const startMin = chosen ? minutesOf(chosen.start) : 0
  const endMin = chosen ? minutesOf(chosen.end) : 0
  const horses = chosen ? freeHorses(ride, chosen.date, startMin, endMin) : []
  const horse = horseId ? horseById(horseId) : undefined
  const stay = stayId !== 'none' ? stayById(stayId) : undefined
  const sync = syncLabels()

  if (done && chosen && horse) {
    return (
      <div className="riding-page theme-shoreride">
        <DemoChrome
          theme="Shore Ride"
          title="Ride locked in (demo)"
          subtitle="Nothing was charged or written to a live calendar."
          imageId="shoreride"
        />
        <div className="yacht-panel success-panel demo-enter-success">
          <h2>You&apos;re on the list</h2>
          <p>
            <strong>
              {ride.name} · {chosen.dayLabel} {chosen.startClock}–{chosen.endClock}
            </strong>
          </p>
          <p>
            {horse.name} · ${ride.price}
            {stay ? ` · ${stay.name} +$${stay.price}` : ''}
          </p>
          <p className="sync-chip">{sync.script}</p>
          <p className="sync-chip">{sync.calendar}</p>
          <p className="hint">
            Apps Script re-checked the linked calendar for overlaps (farrier, private groups, rest days) before
            this demo event was written.
          </p>
          <DemoQuoteCta styleName="Shore Ride" />
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              setDone(false)
              setStep(2)
              setError(null)
              setHorseId(undefined)
              setWindowDate(undefined)
            }}
          >
            Book another ride (demo)
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
        <DemoPitchBar
          packageTier="essential"
          compareTo="/riding/yardboard"
          compareLabel="Yard Board"
          engineNote="Same tide, sun, horse roster, and calendar check — guest wizard vs yard board."
        />
      </div>
    )
  }

  return (
    <div className="riding-page theme-shoreride">
      <DemoChrome
        theme="Shore Ride"
        title="Tide-gated beach ride"
        subtitle="Pick a ride, then the tide, sunrise, and linked calendar decide which windows are actually free."
        imageId="shoreride"
      />
      <DemoPitchBar
        packageTier="essential"
        compareTo="/riding/yardboard"
        compareLabel="Yard Board"
        engineNote="Same tide, sun, horse roster, and calendar check — guest wizard vs yard board."
      />

      <TideSunStrip
        rideName={ride.name}
        usesTides={ride.usesTides}
        windows={windows}
        chosen={chosen}
        onOpenWindows={() => setStep(2)}
      />

      <ol className="wizard-steps" aria-label="Booking steps">
        {[1, 2, 3, 4].map((n) => (
          <li key={n} className={step === n ? 'active' : step > n ? 'done' : ''}>
            {n}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <section className="yacht-panel demo-enter">
          <h2>1. Ride type</h2>
          <p className="hint">Beach and sunset need a usable tide. Arena and vaulting only check weather and the calendar.</p>
          <div className="pkg-grid">
            {RIDE_TYPES.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`pkg-card${rideId === r.id ? ' selected' : ''}`}
                onClick={() => {
                  setRideId(r.id)
                  setWindowDate(undefined)
                  setHorseId(undefined)
                }}
              >
                <strong>{r.name}</strong>
                <span className="pkg-price">${r.price} · {r.durationHours}h</span>
                <p>{r.blurb}</p>
              </button>
            ))}
          </div>
          <div className="btn-row">
            <button type="button" className="btn primary" onClick={() => setStep(2)}>
              Next: Windows
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="yacht-panel demo-enter ride-windows-primary">
          <h2>2. Tide, sun, and calendar</h2>
          <p className="hint">
            Simulated Apps Script asks the linked calendar for conflicts, then layers tide and daylight. Full,
            clashing, or unsuitable windows cannot be booked.
          </p>
          <div className="class-occ-list ride-window-list">
            {windows.map((w) => (
              <WindowCard
                key={w.date}
                window={w}
                selected={windowDate === w.date}
                onSelect={() => setWindowDate(w.date)}
              />
            ))}
          </div>
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(1)}>
              Back
            </button>
            <button type="button" className="btn primary" disabled={!chosen || chosen.status === 'unsuitable' || chosen.status === 'conflict'} onClick={() => setStep(3)}>
              Next: Horse
            </button>
          </div>
        </section>
      )}

      {step === 3 && chosen && (
        <section className="yacht-panel demo-enter">
          <h2>3. Horse and overnight</h2>
          <p className="hint">
            Rest days and max rides come off the roster. Optional stay (farmstay, camp, or bring-your-horse) is the
            overstay add-on.
          </p>
          <div className="class-occ-list">
            {horses.length === 0 && <p className="hint">No horse is free in this window — pick another day.</p>}
            {horses.map((h) => (
              <button
                key={h.id}
                type="button"
                className={`class-occ-card${horseId === h.id ? ' selected' : ''}`}
                onClick={() => setHorseId(h.id)}
              >
                <strong>{h.name}</strong>
                <span>{h.level}</span>
                <span className="spots-line">Free this window</span>
              </button>
            ))}
          </div>
          <h3 className="subhead">Stay on after the ride?</h3>
          <div className="pkg-grid">
            <button
              type="button"
              className={`pkg-card${stayId === 'none' ? ' selected' : ''}`}
              onClick={() => setStayId('none')}
            >
              <strong>Ride only</strong>
              <span className="pkg-price">No overnight</span>
              <p>Leave after the session.</p>
            </button>
            {STAYS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`pkg-card${stayId === s.id ? ' selected' : ''}`}
                onClick={() => setStayId(s.id)}
              >
                <strong>{s.name}</strong>
                <span className="pkg-price">${s.price} / night</span>
                <p>{s.blurb}</p>
              </button>
            ))}
          </div>
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(2)}>
              Back
            </button>
            <button type="button" className="btn primary" disabled={!horseId} onClick={() => setStep(4)}>
              Next: Confirm
            </button>
          </div>
        </section>
      )}

      {step === 4 && chosen && horse && (
        <section className="yacht-panel demo-enter">
          <h2>4. Confirm</h2>
          <div className="summary">
            <p>
              <strong>
                {ride.name} · {chosen.dayLabel} {chosen.startClock}–{chosen.endClock}
              </strong>
            </p>
            <p>
              {horse.name} · ${ride.price}
              {stay ? ` · ${stay.name} +$${stay.price}` : ''}
            </p>
            <p>Calendar check: {chosen.reasons.slice(0, 3).join(' · ')}</p>
            {error && <p className="hint">{error}</p>}
          </div>
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(3)}>
              Back
            </button>
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                const msg = scriptBook({
                  rideId,
                  date: chosen.date,
                  startMin,
                  endMin,
                  horseId: horse.id,
                  stayId: stay?.id,
                  guestName: 'You (demo)',
                })
                if (msg) {
                  setError(msg)
                  refresh()
                  return
                }
                setError(null)
                refresh()
                setDone(true)
              }}
            >
              Book via Apps Script (demo)
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

const STATUS_ORDER: WindowStatus[] = ['ok', 'caution', 'conflict', 'unsuitable']

function TideSunStrip({
  rideName,
  usesTides,
  windows,
  chosen,
  onOpenWindows,
}: {
  rideName: string
  usesTides: boolean
  windows: RideWindow[]
  chosen?: RideWindow
  onOpenWindows: () => void
}) {
  const counts = STATUS_ORDER.map((status) => ({
    status,
    n: windows.filter((w) => w.status === status).length,
  })).filter((c) => c.n > 0)

  return (
    <button type="button" className="tide-sun-strip" onClick={onOpenWindows}>
      <div>
        <p className="tide-sun-strip__label">Tide &amp; sun strip</p>
        <p>
          <strong>{rideName}</strong>
          {usesTides ? ' · tide-gated' : ' · sun and weather only'}
          {chosen ? ` · ${chosen.dayLabel} ${chosen.startClock}–${chosen.endClock}` : ''}
        </p>
      </div>
      {usesTides && (
        <ul className="tide-sun-strip__counts" aria-label="Window statuses">
          {counts.map((c) => (
            <li key={c.status} className={`is-${c.status}`}>
              {c.n} {c.status}
            </li>
          ))}
        </ul>
      )}
    </button>
  )
}

function WindowCard({
  window,
  selected,
  onSelect,
}: {
  window: RideWindow
  selected: boolean
  onSelect: () => void
}) {
  const blocked = window.status === 'unsuitable' || window.status === 'conflict'
  return (
    <button
      type="button"
      disabled={blocked}
      className={`class-occ-card ride-window-card is-${window.status}${selected ? ' selected' : ''}${blocked ? ' is-full' : ''}`}
      onClick={onSelect}
    >
      <strong>
        {window.dayLabel} · {window.startClock}
      </strong>
      <span>{window.summary}</span>
      <span className="spots-line">{window.reasons.slice(0, 2).join(' · ')}</span>
    </button>
  )
}

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { buildYachtCalendar } from '../../shared/calendarMock'
import {
  PRUNING_ADDONS,
  PRUNING_TREES,
  estimatePruning,
  formatPruningBracket,
} from '../../shared/pruningTrees'
import { DemoImageTiles } from '../../components/DemoHeroImage'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'

/**
 * Orchard Grid — species tile grid with per-tile counters (not a catalog list).
 * Side panel: schedule + estimate.
 */
export default function OrchardGrid() {
  const days = useMemo(() => buildYachtCalendar(8), [])
  const [qty, setQty] = useState<Record<string, number>>({ hedge: 12, native: 1 })
  const [addOns, setAddOns] = useState<string[]>(['chipper'])
  const [date, setDate] = useState<string>()
  const [time, setTime] = useState<string>()
  const [done, setDone] = useState(false)

  const estimate = useMemo(() => estimatePruning(qty, addOns), [qty, addOns])
  const selectedDay = days.find((d) => d.date === date)
  const canConfirm = Boolean(estimate && date && time)

  const bump = (id: string, delta: number) => {
    setQty((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }))
  }

  const toggleAddOn = (id: string) => {
    setAddOns((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  if (done && estimate) {
    return (
      <div className="orchard-page theme-orchard">
        <div className="adventure-launch-ok">
          <p className="demo-badge">Simulated · not a real booking</p>
          <h1>Orchard visit set</h1>
          <ul className="prune-lines">
            {estimate.lines.map((l) => (
              <li key={l.id}>
                {l.qty} × {l.name}
              </li>
            ))}
          </ul>
          <p>
            {date} @ {time}
          </p>
          <p className="estimate-bracket">{formatPruningBracket(estimate)}</p>
          <DemoQuoteCta styleName="Orchard Grid" />
          <button type="button" className="btn ghost" onClick={() => setDone(false)}>
            Plan another visit
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
        <DemoPitchBar
          packageTier="advanced"
          compareTo="/pruning/canopy"
          compareLabel="Canopy Care"
          engineNote="Same tree catalog and pricing — tile counters vs catalog list."
        />
      </div>
    )
  }

  return (
    <div className="orchard-page theme-orchard">
      <header className="orchard-top">
        <Link to="/" className="demo-back">
          ← All demos
        </Link>
        <div>
          <p className="demo-badge">Orchard Grid · tile counters</p>
          <h1>Count the canopy</h1>
        </div>
        <span className="demo-theme-tag">Different UI · not a catalog</span>
      </header>
      <DemoImageTiles id="orchard" />
      <DemoPitchBar
        packageTier="advanced"
        compareTo="/pruning/canopy"
        compareLabel="Canopy Care"
        engineNote="Same tree catalog and pricing — tile counters vs catalog list."
      />

      <div className="orchard-deck">
        <section className="orchard-grid-pane">
          <h2>Species tiles</h2>
          <div className="orchard-tiles">
            {PRUNING_TREES.map((t) => {
              const count = qty[t.id] ?? 0
              return (
                <div key={t.id} className={`orchard-tile${count > 0 ? ' on' : ''}`}>
                  {count > 0 && (
                    <span className="orchard-badge" aria-hidden="true">
                      {count}
                    </span>
                  )}
                  <strong>{t.name}</strong>
                  <small>
                    ${t.pricePerUnit}/{t.unitLabel}
                  </small>
                  <div className="orchard-tile-actions">
                    <button type="button" aria-label={`Fewer ${t.name}`} onClick={() => bump(t.id, -1)}>
                      −
                    </button>
                    <button type="button" aria-label={`More ${t.name}`} onClick={() => bump(t.id, 1)}>
                      +
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <aside className="orchard-side">
          <section>
            <h2>Add-ons</h2>
            <div className="addon-row">
              {PRUNING_ADDONS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={`addon-chip btn-like${addOns.includes(a.id) ? ' on' : ''}`}
                  aria-pressed={addOns.includes(a.id)}
                  onClick={() => toggleAddOn(a.id)}
                >
                  {a.name} · ${a.price}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2>When</h2>
            <div className="day-rail">
              {days.map((d) => {
                const openCount = d.slots.filter((s) => s.status === 'open').length
                const blocked = openCount === 0
                return (
                  <button
                    key={d.date}
                    type="button"
                    disabled={blocked}
                    className={`day-pill${date === d.date ? ' on' : ''}${blocked ? ' blocked' : ''}`}
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
                    onClick={() => setTime(slot.time)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </section>

          <div className="orchard-estimate">
            {estimate ? (
              <>
                <span>Est. cost</span>
                <strong>{formatPruningBracket(estimate)}</strong>
                <small>
                  {estimate.totalQty} unit{estimate.totalQty === 1 ? '' : 's'} · call-out ${estimate.callOut}
                </small>
                <ul className="prune-lines compact">
                  {estimate.lines.map((l) => (
                    <li key={l.id}>
                      {l.name} × {l.qty}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="hint">Tap + on tiles to add trees or hedge metres.</p>
            )}
          </div>

          <button type="button" className="btn primary launch-btn" disabled={!canConfirm} onClick={() => setDone(true)}>
            Confirm orchard visit (demo)
          </button>
        </aside>
      </div>
    </div>
  )
}

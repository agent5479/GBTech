import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { buildYachtCalendar } from '../../shared/calendarMock'
import {
  PRUNING_ADDONS,
  PRUNING_FRUIT_ADDS,
  PRUNING_TREES,
  estimatePruning,
  formatPruningBracket,
} from '../../shared/pruningTrees'
import { DemoOutsideShell } from '../../components/DemoChrome'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'

const BLOCK_ZONES = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4', 'D1', 'D2', 'D3', 'D4'] as const

const TREE_ZONES: Record<string, string> = {
  apple: 'A1',
  citrus: 'A2',
  stone: 'B1',
  native: 'C3',
  hedge: 'D1',
  shade: 'C4',
  rose: 'B4',
}

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
  const [zoneFilter, setZoneFilter] = useState<string>()
  const [done, setDone] = useState(false)

  const visibleTrees = useMemo(
    () => (zoneFilter ? PRUNING_TREES.filter((t) => TREE_ZONES[t.id] === zoneFilter) : PRUNING_TREES),
    [zoneFilter],
  )

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
        <div className="adventure-launch-ok demo-enter-success">
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
          compareLabel="Garden prune catalog"
          engineNote="Two jobs, not two skins — orchard count grid vs garden prune catalog."
        />
      </div>
    )
  }

  return (
    <div className="orchard-page theme-orchard">
      <DemoOutsideShell imageId="orchard" />
      <DemoPitchBar
        packageTier="advanced"
        compareTo="/pruning/canopy"
        compareLabel="Garden prune catalog"
        engineNote="Two jobs, not two skins — orchard count grid vs garden prune catalog."
      />
      <header className="orchard-top">
        <div>
          <p className="demo-badge">Orchard Grid · tile counters</p>
          <h1>Orchard count grid</h1>
        </div>
        <span className="demo-theme-tag">Different UI · not a catalog</span>
      </header>

      <div className="orchard-deck demo-enter">
        <section className="orchard-grid-pane">
          <h2>Species tiles</h2>
          <div className="zone-picker-row">
            <p className="hall-book-kicker">Block zone</p>
            <div className="route-chips">
              <button
                type="button"
                className={`chip${!zoneFilter ? ' selected' : ''}`}
                onClick={() => setZoneFilter(undefined)}
              >
                All
              </button>
              {BLOCK_ZONES.map((z) => (
                <button
                  key={z}
                  type="button"
                  className={`chip${zoneFilter === z ? ' selected' : ''}`}
                  onClick={() => setZoneFilter(z)}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>
          <div className="add-kind-row">
            {PRUNING_FRUIT_ADDS.map((q) => (
              <button
                key={q.id}
                type="button"
                className="chip"
                onClick={() => bump(q.id, 1)}
              >
                {q.label}
              </button>
            ))}
          </div>
          <div className="orchard-tiles">
            {visibleTrees.length === 0 && (
              <p className="hint">No species in block {zoneFilter} — pick another zone or show all.</p>
            )}
            {visibleTrees.map((t) => {
              const count = qty[t.id] ?? 0
              return (
                <div key={t.id} className={`orchard-tile${count > 0 ? ' on' : ''}`}>
                  {count > 0 && (
                    <span className="orchard-badge" aria-hidden="true">
                      {count}
                    </span>
                  )}
                  <span className="orchard-zone-tag">{TREE_ZONES[t.id]}</span>
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

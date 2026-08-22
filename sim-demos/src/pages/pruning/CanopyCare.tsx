import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoChrome } from '../../components/DemoChrome'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import { buildYachtCalendar } from '../../shared/calendarMock'
import {
  PRUNING_ADDONS,
  PRUNING_TREES,
  estimatePruning,
  formatPruningBracket,
} from '../../shared/pruningTrees'

const TREE_HAZARDS: Record<string, { id: string; label: string }[]> = {
  apple: [{ id: 'powerline', label: 'Near powerline' }],
  citrus: [{ id: 'steep', label: 'Steep bank' }],
  stone: [{ id: 'dog', label: 'Dog on site' }],
  native: [{ id: 'steep', label: 'Steep access' }, { id: 'protected', label: 'Protected specimen' }],
  hedge: [{ id: 'traffic', label: 'Road frontage' }],
  shade: [{ id: 'powerline', label: 'Overhead lines' }, { id: 'steep', label: 'Soft ground' }],
  rose: [],
}

/**
 * Canopy Care — vertical catalog with qty steppers, then when / review.
 */
export default function CanopyCare() {
  const days = useMemo(() => buildYachtCalendar(8), [])
  const [step, setStep] = useState(1)
  const [qty, setQty] = useState<Record<string, number>>({ apple: 2 })
  const [addOns, setAddOns] = useState<string[]>([])
  const [date, setDate] = useState<string>()
  const [time, setTime] = useState<string>()
  const [access, setAccess] = useState('')
  const [hazardFlags, setHazardFlags] = useState<Record<string, string[]>>({})
  const [done, setDone] = useState(false)

  const toggleHazard = (treeId: string, hazardId: string) => {
    setHazardFlags((prev) => {
      const current = prev[treeId] ?? []
      const next = current.includes(hazardId) ? current.filter((x) => x !== hazardId) : [...current, hazardId]
      return { ...prev, [treeId]: next }
    })
  }

  const estimate = useMemo(() => estimatePruning(qty, addOns), [qty, addOns])
  const selectedDay = days.find((d) => d.date === date)

  const setCount = (id: string, next: number) => {
    setQty((prev) => ({ ...prev, [id]: Math.max(0, next) }))
  }

  const toggleAddOn = (id: string) => {
    setAddOns((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  if (done && estimate) {
    return (
      <div className="pruning-page theme-canopy">
        <DemoChrome
          theme="Canopy Care"
          title="Demo prune booked"
          subtitle="Nothing was scheduled — simulation only."
          imageId="canopy"
        />
        <div className="yacht-panel success-panel demo-enter-success">
          <h2>Visit pencilled in (demo)</h2>
          <ul className="prune-lines">
            {estimate.lines.map((l) => (
              <li key={l.id}>
                {l.qty} {l.unitLabel === 'm' ? 'm' : l.qty === 1 ? 'tree' : 'trees'} · {l.name}
              </li>
            ))}
          </ul>
          <p>
            {date} @ {time}
          </p>
          <p className="estimate-bracket">{formatPruningBracket(estimate)}</p>
          <DemoQuoteCta styleName="Canopy Care" />
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              setDone(false)
              setStep(1)
            }}
          >
            Book another (demo)
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
        <DemoPitchBar
          packageTier="essential"
          compareTo="/pruning/orchard"
          compareLabel="Orchard count grid"
          engineNote="Two jobs, not two skins — garden prune catalog vs orchard count grid."
        />
      </div>
    )
  }

  return (
    <div className="pruning-page theme-canopy">
      <DemoChrome
        theme="Canopy Care"
        title="Garden prune catalog"
        subtitle="Garden trees by type — apple, citrus, stone fruit, natives, hedges — then schedule."
        imageId="canopy"
      />
        <DemoPitchBar
          packageTier="essential"
          compareTo="/pruning/orchard"
          compareLabel="Orchard count grid"
          engineNote="Two jobs, not two skins — garden prune catalog vs orchard count grid."
        />

      <ol className="wizard-steps" aria-label="Booking steps">
        {[1, 2, 3].map((n) => (
          <li key={n} className={step === n ? 'active' : step > n ? 'done' : ''}>
            {n}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <section key="step-1" className="yacht-panel demo-enter">
          <h2>1. Trees &amp; hedges</h2>
          <p className="hint">Set quantity per type. Zero means not included.</p>
          <div className="prune-catalog">
            {PRUNING_TREES.map((t) => {
              const count = qty[t.id] ?? 0
              const hazards = TREE_HAZARDS[t.id] ?? []
              const activeHazards = hazardFlags[t.id] ?? []
              return (
                <div key={t.id} className={`prune-row${count > 0 ? ' on' : ''}`}>
                  <div>
                    <strong>{t.name}</strong>
                    <small>
                      {t.blurb} · ${t.pricePerUnit}/{t.unitLabel}
                    </small>
                    {count > 0 && hazards.length > 0 && (
                      <div className="hazard-flag-row">
                        {hazards.map((h) => (
                          <button
                            key={h.id}
                            type="button"
                            className={`hazard-chip${activeHazards.includes(h.id) ? ' on' : ''}`}
                            onClick={() => toggleHazard(t.id, h.id)}
                          >
                            {h.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="crew-stepper">
                    <button type="button" aria-label={`Fewer ${t.name}`} onClick={() => setCount(t.id, count - 1)}>
                      −
                    </button>
                    <strong>{count}</strong>
                    <button type="button" aria-label={`More ${t.name}`} onClick={() => setCount(t.id, count + 1)}>
                      +
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="addon-row">
            {PRUNING_ADDONS.map((a) => (
              <label key={a.id} className={`addon-chip${addOns.includes(a.id) ? ' on' : ''}`}>
                <input type="checkbox" checked={addOns.includes(a.id)} onChange={() => toggleAddOn(a.id)} />
                {a.name} (+${a.price})
              </label>
            ))}
          </div>

          {estimate && (
            <p className="live-estimate">
              Running estimate <strong>{formatPruningBracket(estimate)}</strong>
            </p>
          )}
          <div className="btn-row">
            <button type="button" className="btn primary" disabled={!estimate} onClick={() => setStep(2)}>
              Next: When
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section key="step-2" className="yacht-panel demo-enter">
          <h2>2. Preferred window</h2>
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
          <label className="field">
            Access notes
            <textarea
              rows={3}
              value={access}
              onChange={(e) => setAccess(e.target.value)}
              placeholder="Steep drive, soft ground, powerlines, locked gate, dogs on site…"
            />
          </label>
          <p className="hint">
            Site access details change travel time and equipment — a live portal can flag these for the crew.
          </p>
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(1)}>
              Back
            </button>
            <button type="button" className="btn primary" disabled={!date || !time} onClick={() => setStep(3)}>
              Next: Review
            </button>
          </div>
        </section>
      )}

      {step === 3 && estimate && (
        <section key="step-3" className="yacht-panel demo-enter">
          <h2>3. Review</h2>
          <div className="summary">
            <ul className="prune-lines">
              {estimate.lines.map((l) => (
                <li key={l.id}>
                  {l.name} × {l.qty} = ${l.lineTotal.toFixed(2)}
                </li>
              ))}
            </ul>
            <p>
              Call-out ${estimate.callOut.toFixed(2)}
              {estimate.addOnsTotal > 0 ? ` · add-ons $${estimate.addOnsTotal.toFixed(2)}` : ''}
            </p>
            <p>
              <strong>When:</strong> {date} @ {time}
            </p>
            {access && (
              <p>
                <strong>Access:</strong> {access}
              </p>
            )}
            <p className="estimate-bracket">Estimated cost {formatPruningBracket(estimate)}</p>
          </div>
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(2)}>
              Back
            </button>
            <button type="button" className="btn primary" onClick={() => setDone(true)}>
              Confirm prune (demo)
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

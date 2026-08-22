import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoCardImage } from '../../components/DemoHeroImage'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import {
  CARERS,
  ROUND_HOURS,
  careTaskById,
  clientById,
  getRounds,
  setRoundCarer,
  toggleRoundCovered,
} from '../../shared/homecare'

/** Round Board — day roster as carer rows × time columns (management). */
export default function RoundBoard() {
  const [, setTick] = useState(0)
  const refresh = () => setTick((n) => n + 1)
  const rounds = getRounds()
  const [locked, setLocked] = useState(false)
  const gaps = rounds.filter((r) => !r.covered).length

  const cell = (carerId: string, time: string) =>
    rounds.find((r) => r.carerId === carerId && r.time === time)

  if (locked) {
    return (
      <div className="rounds-page theme-rounds">
        <div className="adventure-launch-ok demo-enter-success">
          <p className="demo-badge">Simulated · management</p>
          <h1>Rounds saved</h1>
          <p>
            {rounds.length} visits · {gaps} coverage gap{gaps === 1 ? '' : 's'}
          </p>
          <DemoQuoteCta styleName="Round Board" pitchKind="customOps" />
          <button type="button" className="btn ghost" onClick={() => setLocked(false)}>
            Keep editing
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
        <DemoPitchBar
          pitchKind="customOps"
          compareTo="/homecare/visit"
          compareLabel="Care Visit"
          engineNote="Management day roster vs field visit log."
        />
      </div>
    )
  }

  return (
    <div className="rounds-page theme-rounds">
      <header className="apiary-top">
        <Link to="/" className="demo-back">
          ← All demos
        </Link>
        <div>
          <p className="demo-badge">Round Board · management</p>
          <h1>Today&apos;s round sheet</h1>
          <p className="demo-sub">Carers × visit windows — cover gaps, reassign. Management only.</p>
        </div>
        <span className="demo-theme-tag">Day roster</span>
      </header>
      <div className={`coverage-hero${gaps > 0 ? ' has-gaps' : ' all-clear'}`}>
        <p className="coverage-hero__label">Uncovered visits</p>
        <strong>{gaps}</strong>
        <p>
          {gaps > 0
            ? `Tick Covered when the carer confirms — ${gaps} slot${gaps === 1 ? '' : 's'} still open.`
            : 'All visits covered for this demo day.'}
        </p>
      </div>
      <div className="demo-hero-photo">
        <DemoCardImage id="rounds" className="demo-hero-photo__img" />
      </div>
      <DemoPitchBar
        pitchKind="customOps"
        compareTo="/homecare/visit"
        compareLabel="Care Visit"
        engineNote="Management day roster vs field visit log."
      />

      <div className="round-sheet-wrap">
        <table className="round-sheet">
          <thead>
            <tr>
              <th>Carer</th>
              {ROUND_HOURS.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CARERS.map((c) => (
              <tr key={c.id}>
                <th>
                  {c.name}
                  <small>
                    {rounds.filter((r) => r.carerId === c.id).length} visits
                  </small>
                </th>
                {ROUND_HOURS.map((h) => {
                  const slot = cell(c.id, h)
                  if (!slot) {
                    return (
                      <td key={h} className="round-empty">
                        —
                      </td>
                    )
                  }
                  const client = clientById(slot.clientId)
                  return (
                    <td key={h} className={slot.covered ? 'round-ok' : 'round-gap'}>
                      <strong>{client?.name}</strong>
                      <span>{client?.suburb}</span>
                      <small>{slot.tasks.map((id) => careTaskById(id)?.name).join(' · ')}</small>
                      <select
                        value={slot.carerId}
                        onChange={(e) => {
                          setRoundCarer(slot.id, e.target.value)
                          refresh()
                        }}
                      >
                        {CARERS.map((x) => (
                          <option key={x.id} value={x.id}>
                            {x.name}
                          </option>
                        ))}
                      </select>
                      <label>
                        <input
                          type="checkbox"
                          checked={slot.covered}
                          onChange={() => {
                            toggleRoundCovered(slot.id)
                            refresh()
                          }}
                        />
                        Covered
                      </label>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button type="button" className="btn primary launch-btn" onClick={() => setLocked(true)}>
        Save rounds (demo)
      </button>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoCardImage } from '../../components/DemoHeroImage'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import {
  CARERS,
  careTaskById,
  clientById,
  getRounds,
  setRoundCarer,
  setRoundHandoff,
  toggleRoundCovered,
} from '../../shared/homecare'

/** Round Board — management day roster across clients. */
export default function RoundBoard() {
  const [, setTick] = useState(0)
  const refresh = () => setTick((n) => n + 1)
  const rounds = getRounds()
  const [locked, setLocked] = useState(false)
  const gaps = rounds.filter((r) => !r.covered).length

  if (locked) {
    return (
      <div className="rounds-page theme-rounds">
        <div className="adventure-launch-ok demo-enter-success">
          <p className="demo-badge">Simulated · management</p>
          <h1>Rounds saved</h1>
          <p>
            {rounds.length} visits · {gaps} coverage gap{gaps === 1 ? '' : 's'}
          </p>
          <DemoQuoteCta styleName="Round Board" />
          <button type="button" className="btn ghost" onClick={() => setLocked(false)}>
            Keep editing
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
        <DemoPitchBar
          packageTier="advanced"
          compareTo="/homecare/visit"
          compareLabel="Care Visit"
          engineNote="Management rounds vs field carer visit — staff + coordination."
        />
      </div>
    )
  }

  return (
    <div className="rounds-page theme-rounds">
      <header className="tradeboard-top">
        <Link to="/" className="demo-back">
          ← All demos
        </Link>
        <div>
          <p className="demo-badge">Round Board · management</p>
          <h1>Day rounds</h1>
          <p className="demo-sub">Assign carers, flag coverage gaps, capture hand-offs across households.</p>
        </div>
        <span className="demo-theme-tag">Management · roster</span>
      </header>
      <div className="demo-hero-photo">
        <DemoCardImage id="rounds" className="demo-hero-photo__img" />
      </div>
      <DemoPitchBar
        packageTier="advanced"
        compareTo="/homecare/visit"
        compareLabel="Care Visit"
        engineNote="Management rounds vs field carer visit — staff + coordination."
      />

      <div className="tradeboard-deck demo-enter">
        <aside className="tradeboard-jobs">
          <h2>Today&apos;s roster</h2>
          {gaps > 0 && (
            <p className="coverage-gap">
              {gaps} uncovered visit{gaps === 1 ? '' : 's'} — tick covered when staff confirmed.
            </p>
          )}
          <div className="apiary-roster">
            {rounds.map((slot) => {
              const client = clientById(slot.clientId)
              return (
                <article key={slot.id} className={`apiary-row${slot.covered ? '' : ' gap'}`}>
                  <header>
                    <strong>
                      {slot.time} · {client?.name}
                    </strong>
                    <span>{client?.suburb}</span>
                  </header>
                  <p className="hint">{slot.tasks.map((id) => careTaskById(id)?.name).join(' · ')}</p>
                  <label className="field">
                    Carer
                    <select
                      value={slot.carerId}
                      onChange={(e) => {
                        setRoundCarer(slot.id, e.target.value)
                        refresh()
                      }}
                    >
                      {CARERS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={`exercise-check${slot.covered ? ' on' : ''}`}>
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
                  <label className="field">
                    Hand-off
                    <input
                      type="text"
                      value={slot.handoff}
                      placeholder="Note for next shift…"
                      onChange={(e) => {
                        setRoundHandoff(slot.id, e.target.value)
                        refresh()
                      }}
                    />
                  </label>
                </article>
              )
            })}
          </div>
        </aside>
        <aside className="tradeboard-side">
          <section>
            <h2>Team</h2>
            <ul className="benefit-list-sim">
              {CARERS.map((c) => (
                <li key={c.id}>
                  {c.name} · {rounds.filter((r) => r.carerId === c.id).length} visits
                </li>
              ))}
            </ul>
          </section>
          <button type="button" className="btn primary launch-btn" onClick={() => setLocked(true)}>
            Save rounds (demo)
          </button>
        </aside>
      </div>
    </div>
  )
}

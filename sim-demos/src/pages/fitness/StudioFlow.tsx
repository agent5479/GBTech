import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoChrome } from '../../components/DemoChrome'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import {
  FITNESS_PLANS,
  bookOccurrence,
  classTypeById,
  formatPrepaid,
  getMember,
  getOccurrences,
  planById,
  spotsLeft,
  syncLabels,
  type PlanId,
} from '../../shared/fitnessStudio'

/**
 * Studio Flow — member booking wizard.
 * Class (spots vs cap) → prepaid plan → confirm (simulated calendar + Firebase).
 */
export default function StudioFlow() {
  const [, setTick] = useState(0)
  const refresh = () => setTick((n) => n + 1)

  const [step, setStep] = useState(1)
  const [occurrenceId, setOccurrenceId] = useState<string>()
  const [planId, setPlanId] = useState<PlanId>(getMember().planId)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const occurrences = getOccurrences()
  const member = getMember()
  const occ = occurrenceId ? occurrences.find((o) => o.id === occurrenceId) : undefined
  const cls = occ ? classTypeById(occ.classTypeId) : undefined
  const plan = planById(planId)
  const sync = useMemo(() => syncLabels(), [done, occurrenceId])

  if (done && occ && cls && plan) {
    return (
      <div className="fitness-page theme-studioflow">
        <DemoChrome
          theme="Studio Flow"
          title="Class locked in (demo)"
          subtitle="Nothing was charged or written to a live calendar."
          imageId="studioflow"
        />
        <div className="yacht-panel success-panel demo-enter-success">
          <h2>You&apos;re on the list</h2>
          <p>
            <strong>
              {cls.name} · {occ.dayLabel} {occ.time}
            </strong>
          </p>
          <p>
            {plan.name} · {formatPrepaid(plan)} ·{' '}
            {member.creditsLeft === 1 ? '1 credit left' : `${member.creditsLeft} credits left`}
          </p>
          <p className="sync-chip">{sync.calendar}</p>
          <p className="sync-chip">{sync.firebase}</p>
          <p className="hint">
            {spotsLeft(occ)} of {cls.cap} spots still open — walk-ins stop when the cap is hit, without you watching
            the phone.
          </p>
          <DemoQuoteCta styleName="Studio Flow" />
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              setDone(false)
              setStep(1)
              setError(null)
            }}
          >
            Book another class (demo)
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
        <DemoPitchBar
          packageTier="essential"
          compareTo="/fitness/classboard"
          compareLabel="Class Board"
          engineNote="Same packs, caps, and calendar check — member wizard vs instructor board."
        />
      </div>
    )
  }

  return (
    <div className="fitness-page theme-studioflow">
      <DemoChrome
        theme="Studio Flow"
        title="Studio Flow"
        subtitle="Book a class, pay in advance, and stop when the room is full — the calendar holds the cap."
        imageId="studioflow"
      />
      <DemoPitchBar
        packageTier="essential"
        compareTo="/fitness/classboard"
        compareLabel="Class Board"
        engineNote="Same packs, caps, and calendar check — member wizard vs instructor board."
      />

      <ol className="wizard-steps" aria-label="Booking steps">
        {[1, 2, 3].map((n) => (
          <li key={n} className={step === n ? 'active' : step > n ? 'done' : ''}>
            {n}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <section className="yacht-panel demo-enter">
          <h2>1. Pick a class</h2>
          <p className="hint">Spots come from the simulated Google Calendar — full classes cannot be booked.</p>
          <div className="class-occ-list">
            {occurrences.map((o) => {
              const type = classTypeById(o.classTypeId)
              if (!type) return null
              const left = spotsLeft(o)
              const full = left === 0
              const on = occurrenceId === o.id
              return (
                <button
                  key={o.id}
                  type="button"
                  disabled={full}
                  className={`class-occ-card${on ? ' selected' : ''}${full ? ' is-full' : ''}`}
                  onClick={() => setOccurrenceId(o.id)}
                >
                  <strong>
                    {type.name} · {o.time}
                  </strong>
                  <span>{o.dayLabel}</span>
                  <span className="spots-line">
                    {full ? 'Full' : `${left} of ${type.cap} spots left`}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="btn-row">
            <button type="button" className="btn primary" disabled={!occurrenceId} onClick={() => setStep(2)}>
              Next: Plan
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="yacht-panel demo-enter">
          <h2>2. Pay in advance</h2>
          <p className="hint">
            Casual $17 · 10-pack $15 · 20-pack $12.50 · 3-a-week $10. All prepaid. Demo member currently has{' '}
            {member.creditsLeft} credits on a {planById(member.planId)?.name}.
          </p>
          <div className="pkg-grid">
            {FITNESS_PLANS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`pkg-card${planId === p.id ? ' selected' : ''}`}
                onClick={() => setPlanId(p.id)}
              >
                <strong>{p.name}</strong>
                <span className="pkg-price">
                  ${p.ratePerClass.toFixed(2)} / class · {formatPrepaid(p)}
                </span>
                <p>{p.blurb}</p>
              </button>
            ))}
          </div>
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(1)}>
              Back
            </button>
            <button type="button" className="btn primary" onClick={() => setStep(3)}>
              Next: Confirm
            </button>
          </div>
        </section>
      )}

      {step === 3 && occ && cls && plan && (
        <section className="yacht-panel demo-enter">
          <h2>3. Confirm</h2>
          <div className="summary">
            <p>
              <strong>
                {cls.name} · {occ.dayLabel} {occ.time}
              </strong>
            </p>
            <p>
              {plan.name} · {formatPrepaid(plan)}
            </p>
            <p>
              Calendar check: {spotsLeft(occ)} of {cls.cap} spots left (event {occ.calendarEventId}).
            </p>
            {error && <p className="hint">{error}</p>}
          </div>
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setStep(2)}>
              Back
            </button>
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                const msg = bookOccurrence(occ.id, plan.id)
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
              Pay &amp; book (demo)
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { buildYachtCalendar } from '../../shared/calendarMock'
import { GB_PLACES } from '../../shared/gbPlaces'
import {
  HANDYMAN_JOBS,
  estimateHandymanJobs,
  formatHandymanBracket,
  jobById,
} from '../../shared/handymanJobs'
import { PaletteSwitcher } from '../../components/PaletteSwitcher'
import { useDemoPalette } from '../../hooks/useDemoPalette'

/**
 * Trade Board — single-screen multi-select (not a wizard).
 * Job chips + day/time rail + estimate column.
 */
export default function TradeBoard() {
  const { paletteId, setPaletteId, style } = useDemoPalette('handyman-tradeboard')
  const days = useMemo(() => buildYachtCalendar(8), [])
  const [selected, setSelected] = useState<string[]>(['gutters', 'carpentry'])
  const [date, setDate] = useState<string>()
  const [time, setTime] = useState<string>()
  const [placeId, setPlaceId] = useState('takaka')
  const [done, setDone] = useState(false)

  const estimate = useMemo(() => estimateHandymanJobs(selected), [selected])
  const selectedDay = days.find((d) => d.date === date)
  const canConfirm = Boolean(estimate && date && time)

  const toggleJob = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  if (done && estimate) {
    return (
      <div className="tradeboard-page theme-tradeboard" style={style}>
        <PaletteSwitcher value={paletteId} onChange={setPaletteId} />
        <div className="adventure-launch-ok">
          <p className="demo-badge">Simulated · not a real booking</p>
          <h1>Board ticket locked</h1>
          <p>{selected.map((id) => jobById(id)?.name).join(' · ')}</p>
          <p>
            {date} @ {time}
          </p>
          <p className="estimate-bracket">{formatHandymanBracket(estimate)}</p>
          <button type="button" className="btn primary" onClick={() => setDone(false)}>
            Plan another job
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="tradeboard-page theme-tradeboard" style={style}>
      <header className="tradeboard-top">
        <Link to="/" className="demo-back">
          ← All demos
        </Link>
        <div>
          <p className="demo-badge">Trade Board · multi-select jobs</p>
          <h1>Pin the work</h1>
        </div>
        <span className="demo-theme-tag">Different UI · not a wizard</span>
      </header>
      <PaletteSwitcher value={paletteId} onChange={setPaletteId} />

      <div className="tradeboard-deck">
        <aside className="tradeboard-jobs">
          <h2>Job types</h2>
          <p className="hint">Tap to pin — select as many as you need.</p>
          <div className="job-chip-stack">
            {HANDYMAN_JOBS.map((j) => {
              const on = selected.includes(j.id)
              return (
                <button
                  key={j.id}
                  type="button"
                  className={`job-chip${on ? ' on' : ''}`}
                  aria-pressed={on}
                  onClick={() => toggleJob(j.id)}
                >
                  <strong>{j.name}</strong>
                  <span>from ${j.basePrice}</span>
                </button>
              )
            })}
          </div>
        </aside>

        <aside className="tradeboard-side">
          <section>
            <h2>When</h2>
            <div className="day-rail" role="listbox" aria-label="Available days">
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

          <section>
            <h2>Site</h2>
            <label className="field">
              Area
              <select value={placeId} onChange={(e) => setPlaceId(e.target.value)}>
                {GB_PLACES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <div className="tradeboard-estimate">
            {estimate ? (
              <>
                <span>Est. cost</span>
                <strong>{formatHandymanBracket(estimate)}</strong>
                <small>
                  {selected.length} job{selected.length === 1 ? '' : 's'} · travel ${estimate.travelFee}
                  {estimate.multiJobDiscount > 0 ? ` · −$${estimate.multiJobDiscount.toFixed(2)} multi` : ''}
                </small>
              </>
            ) : (
              <p className="hint">Pin at least one job type.</p>
            )}
          </div>

          <button type="button" className="btn primary launch-btn" disabled={!canConfirm} onClick={() => setDone(true)}>
            Lock board ticket (demo)
          </button>
        </aside>
      </div>
    </div>
  )
}

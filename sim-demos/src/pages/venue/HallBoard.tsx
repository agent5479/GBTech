import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { DayCalendarNav } from '../../components/DayCalendarNav'
import { DemoOutsideShell } from '../../components/DemoChrome'
import { DemoModeBar } from '../../components/DemoModeBar'
import { DemoPitchBar, DemoQuoteCta } from '../../components/DemoPitch'
import { MultiSelectChipRail } from '../../components/MultiSelectChipRail'
import {
  CAL_COLOR_SCHEMES,
  loadCalColorScheme,
  saveCalColorScheme,
  type CalColorScheme,
} from '../../shared/calendarColorPrefs'
import {
  HALL_BOARD_HOURS,
  HALL_ROOMS,
  HALL_STAFF,
  LIVE_BOOK_URL,
  LIVE_STAFF_URL,
  findNextHallHold,
  formatHallDayLabel,
  getHallWeekStrip,
  getHoldsForDate,
  placeHold,
  setHoldAssignee,
  setHoldStatus,
  shiftDate,
  staffById,
  todayIso,
  type HallHold,
  type HallHoldStatus,
} from '../../shared/venueHall'

const STATUS_CYCLE: HallHoldStatus[] = ['hold', 'confirmed', 'blocked']
const TURNAROUND_BUFFER_MIN = 30

const STATUS_FILTERS = [
  { id: 'hold', label: 'Holds' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'free', label: 'Free slots' },
]

const FIND_KINDS = [
  { id: 'any', label: 'Any booking' },
  { id: 'hold', label: 'Next hold' },
  { id: 'confirmed', label: 'Next confirmed' },
  { id: 'blocked', label: 'Next blocked' },
]

function matchesSearch(hold: HallHold, q: string): boolean {
  if (!q) return true
  const staff = hold.assigneeId ? (staffById(hold.assigneeId)?.name.toLowerCase() ?? '') : ''
  const room = HALL_ROOMS.find((r) => r.id === hold.roomId)?.name.toLowerCase() ?? ''
  return `${hold.partyName} ${room} ${staff} ${hold.status}`.toLowerCase().includes(q)
}

/** Hall Board — multi-day staff venue calendar with search, filters, and find-next. */
export default function HallBoard() {
  const [, setTick] = useState(0)
  const refresh = () => setTick((n) => n + 1)
  const [selectedDate, setSelectedDate] = useState(todayIso)
  const [locked, setLocked] = useState(false)
  const [bufferOn, setBufferOn] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [roomFilters, setRoomFilters] = useState<string[]>([])
  const [findKind, setFindKind] = useState('any')
  const [findMsg, setFindMsg] = useState<string | null>(null)
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const [findCursor, setFindCursor] = useState<{ date: string; time: string } | null>(null)
  const [colorScheme, setColorScheme] = useState<CalColorScheme>(() => loadCalColorScheme())
  const gridRef = useRef<HTMLDivElement>(null)

  const holds = getHoldsForDate(selectedDate)
  const weekStrip = useMemo(() => getHallWeekStrip(shiftDate(selectedDate, -3), 14), [selectedDate])

  const hours = useMemo(() => {
    const fromHolds = holds.map((h) => h.time)
    return [...new Set([...HALL_BOARD_HOURS, ...fromHolds])].sort()
  }, [holds])

  const rooms = useMemo(() => {
    if (!roomFilters.length) return HALL_ROOMS
    return HALL_ROOMS.filter((r) => roomFilters.includes(r.id))
  }, [roomFilters])

  const q = search.trim().toLowerCase()
  const statusOnly = statusFilters.filter((f) => f !== 'free')
  const wantFree = !statusFilters.length || statusFilters.includes('free')
  const wantBusy = !statusFilters.length || statusOnly.length > 0

  const holdPassesFilters = (hold: HallHold): boolean => {
    if (!wantBusy && statusFilters.includes('free') && statusOnly.length === 0) return false
    if (statusOnly.length && !statusOnly.includes(hold.status)) return false
    return matchesSearch(hold, q)
  }

  const visibleHolds = holds.filter(holdPassesFilters)
  const totalCells = rooms.length * hours.length
  const occupiedOnBoard = holds.filter((h) => rooms.some((r) => r.id === h.roomId)).length
  const freeSlots = totalCells - occupiedOnBoard

  const isBufferCell = (roomId: string, time: string): boolean => {
    if (!bufferOn) return false
    const timeIdx = hours.indexOf(time)
    if (timeIdx <= 0) return false
    const prevTime = hours[timeIdx - 1]
    return holds.some((h) => h.roomId === roomId && h.time === prevTime)
  }

  const toggleStatus = (id: string) => {
    setStatusFilters((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }
  const toggleRoom = (id: string) => {
    setRoomFilters((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const onColorChange = (scheme: CalColorScheme) => {
    setColorScheme(scheme)
    saveCalColorScheme(scheme)
  }

  const runFindNext = () => {
    const status = findKind === 'any' ? undefined : (findKind as HallHoldStatus)
    const after = findCursor ?? { date: selectedDate, time: '00:00' }
    const next = findNextHallHold({
      afterDate: after.date,
      afterTime: after.time,
      status,
      query: search || undefined,
      roomId: roomFilters.length === 1 ? roomFilters[0] : undefined,
    })
    if (!next) {
      setFindMsg('No matching event ahead — try Today, clear filters, or pick another kind.')
      setHighlightId(null)
      return
    }
    setSelectedDate(next.date)
    setHighlightId(next.id)
    setFindCursor({ date: next.date, time: next.time })
    setFindMsg(
      `Next: ${next.partyName === '—' ? next.status : next.partyName} · ${formatHallDayLabel(next.date)} ${next.time}`,
    )
    requestAnimationFrame(() => {
      gridRef.current?.querySelector(`[data-hold-id="${next.id}"]`)?.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'smooth',
      })
    })
  }

  if (locked) {
    return (
      <div className="hallboard-page theme-hallboard">
        <div className="adventure-launch-ok demo-enter-success">
          <p className="demo-badge">Simulated · staff board</p>
          <h1>Board saved</h1>
          <p>
            {holds.length} rows on {formatHallDayLabel(selectedDate)}
          </p>
          <p className="hint">
            Full product:{' '}
            <a href={LIVE_STAFF_URL}>Harbour Hall staff demo</a>
            {' · '}
            <a href={LIVE_BOOK_URL}>Public book</a>
          </p>
          <DemoQuoteCta styleName="Hall Board" />
          <button type="button" className="btn ghost" onClick={() => setLocked(false)}>
            Keep editing
          </button>
          <Link to="/" className="adventure-hub-link">
            ← All demos
          </Link>
        </div>
        <DemoPitchBar
          packageTier="advanced"
          compareTo="/venue/harbourbook"
          compareLabel="Harbour Book"
          engineNote="Staff day board vs client facility book — Harbour Hall pair."
        />
      </div>
    )
  }

  return (
    <div className="hallboard-page theme-hallboard" data-cal-scheme={colorScheme}>
      <DemoOutsideShell imageId="hallboard" heroCompact />
      <DemoPitchBar
        packageTier="advanced"
        compareTo="/venue/harbourbook"
        compareLabel="Harbour Book"
        engineNote="Staff day board vs client facility book — Harbour Hall pair."
      />
      <DemoModeBar
        clientTo="/venue/harbourbook"
        clientLabel="Client view"
        opsTo="/venue/hallboard"
        opsLabel="Admin view"
      />
      <header className="tradeboard-top">
        <div>
          <p className="demo-badge">Hall Board · staff</p>
          <h1>Rooms × hours board</h1>
          <p className="demo-sub">
            Multi-day calendar — jump dates, search, filter, find the next booking, and set colour prefs.
          </p>
        </div>
        <span className="demo-theme-tag">Staff board</span>
      </header>

      <div className="kpi-row kpi-row--header">
        <article>
          <strong>{visibleHolds.length}</strong>
          <span>Visible bookings</span>
        </article>
        <article className={freeSlots === 0 ? 'warn' : undefined}>
          <strong>{freeSlots}</strong>
          <span>Free slots</span>
        </article>
        <article>
          <strong>{Math.round((occupiedOnBoard / Math.max(1, totalCells)) * 100)}%</strong>
          <span>Utilization</span>
        </article>
        <article>
          <strong>{bufferOn ? 'On' : 'Off'}</strong>
          <span>Turnaround buffer</span>
        </article>
      </div>

      <div className="ops-deck demo-enter">
        <DayCalendarNav
          date={selectedDate}
          onChange={(d) => {
            setSelectedDate(d)
            setFindCursor(null)
            setHighlightId(null)
          }}
        />

        <div className="hall-week-strip" role="list" aria-label="Occupancy ahead">
          {weekStrip.map((d) => (
            <button
              key={d.date}
              type="button"
              role="listitem"
              className={`hall-week-strip__day${d.date === selectedDate ? ' is-selected' : ''}${d.date === todayIso() ? ' is-today' : ''}`}
              onClick={() => {
                setSelectedDate(d.date)
                setFindCursor(null)
                setHighlightId(null)
              }}
            >
              <span className="hall-week-strip__label">{d.label}</span>
              <span className="hall-week-strip__bar" aria-hidden="true">
                <span style={{ width: `${d.pct}%` }} />
              </span>
              <span className="hall-week-strip__pct">
                {d.booked}/{d.total}
              </span>
            </button>
          ))}
        </div>

        <div className="cal-tools">
          <label className="cal-tools__search">
            <span>Search</span>
            <input
              type="search"
              value={search}
              placeholder="Party, room, staff…"
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <div className="cal-tools__find">
            <label>
              <span>Find next</span>
              <select value={findKind} onChange={(e) => setFindKind(e.target.value)}>
                {FIND_KINDS.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.label}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="btn primary" onClick={runFindNext}>
              Go
            </button>
          </div>
          <label className="cal-tools__colours">
            <span>Colours</span>
            <select value={colorScheme} onChange={(e) => onColorChange(e.target.value as CalColorScheme)}>
              {CAL_COLOR_SCHEMES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {findMsg ? <p className="cal-tools__msg">{findMsg}</p> : null}

        <MultiSelectChipRail label="Status" options={STATUS_FILTERS} selected={statusFilters} onToggle={toggleStatus} />
        <MultiSelectChipRail
          label="Rooms"
          options={HALL_ROOMS.map((r) => ({ id: r.id, label: r.name }))}
          selected={roomFilters}
          onToggle={toggleRoom}
        />

        <p className={`coverage-banner${freeSlots === 0 ? '' : ' all-clear'}`}>
          {freeSlots === 0
            ? `No free room slots on ${formatHallDayLabel(selectedDate)}.`
            : `${freeSlots} free room slot${freeSlots === 1 ? '' : 's'} on ${formatHallDayLabel(selectedDate)}.`}
        </p>
        <label className="hive-check" style={{ marginBottom: '0.75rem' }}>
          <input type="checkbox" checked={bufferOn} onChange={(e) => setBufferOn(e.target.checked)} />
          Show {TURNAROUND_BUFFER_MIN} min turnaround buffer after bookings
        </label>

        <div className="ops-board-surface week-grid-wrap" ref={gridRef}>
          <div className="ops-board-head">
            <h2>Rooms × hours · {formatHallDayLabel(selectedDate)}</h2>
            <p className="hint">
              Tap a free cell to place a hold. Cycle status hold → confirmed → blocked. Assign staff on occupied cells.
            </p>
          </div>
          <div className="ops-board-scroll">
            <table className="hall-time-grid ops-cal-table">
              <thead>
                <tr>
                  <th>Room</th>
                  {hours.map((t) => (
                    <th key={t}>{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <th>
                      {room.name}
                      <small>{room.capacity} pax</small>
                    </th>
                    {hours.map((time) => {
                      const hold = holds.find((h) => h.roomId === room.id && h.time === time)
                      if (!hold) {
                        if (!wantFree) return <td key={time} className="hall-cell-muted" />
                        if (isBufferCell(room.id, time)) {
                          return (
                            <td key={time} className="hall-cell-free hall-cell-buffer">
                              Buffer {TURNAROUND_BUFFER_MIN}m
                            </td>
                          )
                        }
                        return (
                          <td key={time} className="hall-cell-free">
                            <button
                              type="button"
                              className="hall-place-hold"
                              onClick={() => {
                                placeHold(room.id, selectedDate, time)
                                refresh()
                              }}
                            >
                              Free · book
                            </button>
                          </td>
                        )
                      }
                      if (!holdPassesFilters(hold)) {
                        return <td key={time} className="hall-cell-muted" />
                      }
                      return (
                        <td
                          key={time}
                          data-hold-id={hold.id}
                          className={`hall-cell status-${hold.status}${highlightId === hold.id ? ' is-cal-highlight' : ''}`}
                        >
                          <button
                            type="button"
                            className="hall-status-cycle"
                            onClick={() => {
                              const i = STATUS_CYCLE.indexOf(hold.status)
                              setHoldStatus(hold.id, STATUS_CYCLE[(i + 1) % STATUS_CYCLE.length])
                              refresh()
                            }}
                          >
                            {hold.status}
                          </button>
                          <p>{hold.partyName === '—' ? 'No party' : hold.partyName}</p>
                          <select
                            value={hold.assigneeId ?? ''}
                            aria-label={`${room.name} ${time} assignee`}
                            onChange={(e) => {
                              setHoldAssignee(hold.id, e.target.value)
                              refresh()
                            }}
                          >
                            <option value="">Unassigned</option>
                            {HALL_STAFF.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="btn primary launch-btn" onClick={() => setLocked(true)}>
            Save board (demo)
          </button>
        </div>
      </div>
    </div>
  )
}

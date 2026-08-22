/** Simulated Golden Bay horse yard — tides, sun, horses, stays, Apps Script calendar. */

export const YARD_TZ = 'Pacific/Auckland'
export const YARD_LAT = -40.82
export const YARD_LON = 172.8
export const PLANNER_DAYS = 8

export type RideId = 'beach' | 'sunset' | 'swim' | 'arena' | 'vault'
export type DaylightRule = 'after-sunrise' | 'around-sunset' | 'daylight'
export type WindowStatus = 'ok' | 'caution' | 'unsuitable' | 'conflict'
export type StayId = 'farmstay' | 'camp' | 'horseStay'
export type CalKind = 'busy' | 'booking' | 'stay' | 'open'

export interface RideType {
  id: RideId
  name: string
  blurb: string
  durationHours: number
  daylight: DaylightRule
  usesTides: boolean
  maxWindKmh: number
  maxRainMm: number
  minTempC?: number
  sunriseBufferMin: number
  price: number
}

export interface Horse {
  id: string
  name: string
  level: string
  rideIds: RideId[]
  restWeekday: number | null
  maxPerDay: number
}

export interface StayType {
  id: StayId
  name: string
  blurb: string
  price: number
}

export interface TideExtreme {
  time: Date
  height: number
  type: 'high' | 'low'
}

export interface DayWeather {
  date: string
  maxTempC: number
  rainMm: number
  windMaxKmh: number
  label: string
}

export interface RideWindow {
  date: string
  dayLabel: string
  start: Date
  end: Date
  startClock: string
  endClock: string
  status: WindowStatus
  reasons: string[]
  summary: string
  lowTideClock?: string
}

export interface CalendarEvent {
  id: string
  date: string
  title: string
  kind: CalKind
  startMin: number
  endMin: number
  horseId?: string
  stayId?: StayId
  rideId?: RideId
}

export const RIDE_TYPES: RideType[] = [
  {
    id: 'beach',
    name: 'Beach ride',
    blurb: 'Two hours on the sand — best around low to mid tide in daylight.',
    durationHours: 2,
    daylight: 'after-sunrise',
    usesTides: true,
    maxWindKmh: 40,
    maxRainMm: 8,
    sunriseBufferMin: 20,
    price: 95,
  },
  {
    id: 'sunset',
    name: 'Sunset ride',
    blurb: 'Finish near sunset when the tide still leaves a rideable beach.',
    durationHours: 1.5,
    daylight: 'around-sunset',
    usesTides: true,
    maxWindKmh: 35,
    maxRainMm: 6,
    sunriseBufferMin: 0,
    price: 110,
  },
  {
    id: 'swim',
    name: 'Swim with horses',
    blurb: 'Calmer air, warmer water, and a tide that lets you in.',
    durationHours: 1.5,
    daylight: 'after-sunrise',
    usesTides: true,
    maxWindKmh: 28,
    maxRainMm: 4,
    minTempC: 12,
    sunriseBufferMin: 45,
    price: 120,
  },
  {
    id: 'arena',
    name: 'Arena lesson',
    blurb: 'On-farm school — weather only; tides do not apply.',
    durationHours: 1,
    daylight: 'daylight',
    usesTides: false,
    maxWindKmh: 55,
    maxRainMm: 15,
    sunriseBufferMin: 15,
    price: 65,
  },
  {
    id: 'vault',
    name: 'Vaulting session',
    blurb: 'Gymnastics on horseback in the yard — no beach window needed.',
    durationHours: 1,
    daylight: 'daylight',
    usesTides: false,
    maxWindKmh: 50,
    maxRainMm: 12,
    sunriseBufferMin: 20,
    price: 70,
  },
]

export const HORSES: Horse[] = [
  { id: 'tui', name: 'Tui', level: 'Quiet · beach', rideIds: ['beach', 'sunset', 'swim'], restWeekday: 1, maxPerDay: 2 },
  { id: 'drift', name: 'Drift', level: 'Steady · swim', rideIds: ['beach', 'swim'], restWeekday: null, maxPerDay: 2 },
  { id: 'kowhai', name: 'Kowhai', level: 'Keen · arena', rideIds: ['arena', 'vault', 'beach'], restWeekday: 3, maxPerDay: 3 },
  { id: 'pipi', name: 'Pipi', level: 'Quiet · first ride', rideIds: ['beach', 'arena', 'vault'], restWeekday: null, maxPerDay: 2 },
  { id: 'mocha', name: 'Mocha', level: 'Steady · sunset', rideIds: ['sunset', 'beach', 'arena'], restWeekday: 2, maxPerDay: 2 },
]

export const STAYS: StayType[] = [
  { id: 'farmstay', name: 'Farmstay night', blurb: 'House room after the ride — one night.', price: 180 },
  { id: 'camp', name: 'Camp site', blurb: 'Tent site, shared kitchen, one night.', price: 25 },
  { id: 'horseStay', name: 'Horse stay', blurb: 'Bring your own horse overnight.', price: 45 },
]

export function rideById(id: RideId): RideType {
  return RIDE_TYPES.find((r) => r.id === id) ?? RIDE_TYPES[0]
}

export function horseById(id: string): Horse | undefined {
  return getHorses().find((h) => h.id === id)
}

export function stayById(id: StayId): StayType | undefined {
  return STAYS.find((s) => s.id === id)
}

export function formatClock(date: Date): string {
  return new Intl.DateTimeFormat('en-NZ', {
    timeZone: YARD_TZ,
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function formatDay(date: Date): string {
  return new Intl.DateTimeFormat('en-NZ', {
    timeZone: YARD_TZ,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date)
}

export function todayKey(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: YARD_TZ }).format(new Date())
}

export function addDaysKey(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d + n))
  return dt.toISOString().slice(0, 10)
}

export function weekdayFromKey(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

function atMinutes(iso: string, minutes: number): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d, 0, minutes) - 12 * 60 * 60 * 1000)
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000)
}

export function minutesOf(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-NZ', {
    timeZone: YARD_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0)
  return hour * 60 + minute
}

/** NOAA-style sunrise/sunset for Golden Bay (no live API). */
export function sunTimesForDate(iso: string): { sunrise: Date; sunset: Date } {
  const [y, m, d] = iso.split('-').map(Number)
  const noon = new Date(Date.UTC(y, m - 1, d, 0, 0))
  const julian = noon.getTime() / 86400000 + 2440587.5 + 0.5
  const n = julian - 2451545 + 0.0008
  const jStar = n - YARD_LON / 360
  const mean = (357.5291 + 0.98560028 * jStar) % 360
  const mRad = (mean * Math.PI) / 180
  const c = 1.9148 * Math.sin(mRad) + 0.02 * Math.sin(2 * mRad)
  const lambda = (mean + c + 180 + 102.9372) % 360
  const lambdaRad = (lambda * Math.PI) / 180
  const jTransit = 2451545 + jStar + 0.0053 * Math.sin(mRad) - 0.0069 * Math.sin(2 * lambdaRad)
  const sinDec = Math.sin(lambdaRad) * Math.sin((23.4397 * Math.PI) / 180)
  const dec = Math.asin(sinDec)
  const latRad = (YARD_LAT * Math.PI) / 180
  const cosHa =
    (Math.sin((-0.833 * Math.PI) / 180) - Math.sin(latRad) * Math.sin(dec)) /
    (Math.cos(latRad) * Math.cos(dec))
  const ha = Math.acos(Math.min(1, Math.max(-1, cosHa)))
  const rise = new Date((jTransit - (ha * 180) / Math.PI / 360 - 2440587.5) * 86400000)
  const set = new Date((jTransit + (ha * 180) / Math.PI / 360 - 2440587.5) * 86400000)
  return { sunrise: rise, sunset: set }
}

export function tidesForDay(iso: string): TideExtreme[] {
  const seed = Number(iso.replace(/-/g, ''))
  const shift = (seed % 7) * 42
  const lows = [6 * 60 + 10 + shift, 18 * 60 + 25 + shift]
  const highs = [0 * 60 + 20 + shift, 12 * 60 + 35 + shift]
  return [
    ...lows.map((min) => ({ time: atMinutes(iso, min % (24 * 60)), height: 0.4, type: 'low' as const })),
    ...highs.map((min) => ({ time: atMinutes(iso, min % (24 * 60)), height: 3.1, type: 'high' as const })),
  ]
}

export function weatherForDay(iso: string): DayWeather {
  const n = Number(iso.slice(-2))
  const wind = 12 + (n % 5) * 6 + (n % 3) * 2
  const rain = n % 6 === 0 ? 9 : n % 4 === 0 ? 3.5 : 0.4
  const maxTempC = 11 + (n % 8)
  let label = 'Clear'
  if (rain > 6) label = 'Rain'
  else if (rain > 2) label = 'Showers'
  else if (wind > 32) label = 'Breezy'
  else if (n % 3 === 0) label = 'Partly cloudy'
  return { date: iso, maxTempC, rainMm: rain, windMaxKmh: wind, label }
}

function pickLowTide(tides: TideExtreme[], start: Date, end: Date): TideExtreme | undefined {
  const lows = tides.filter((t) => t.type === 'low')
  const inWindow = lows.find((t) => t.time >= start && t.time <= end)
  return inWindow ?? lows[0]
}

function tideUsable(low: TideExtreme | undefined, start: Date, end: Date): boolean {
  if (!low) return false
  const centre = new Date((start.getTime() + end.getTime()) / 2)
  return Math.abs(low.time.getTime() - centre.getTime()) / 3_600_000 <= 2.5
}

export function buildWindows(ride: RideType): RideWindow[] {
  const startKey = todayKey()
  const out: RideWindow[] = []
  for (let i = 0; i < PLANNER_DAYS; i++) {
    const date = addDaysKey(startKey, i)
    const sun = sunTimesForDate(date)
    const tides = tidesForDay(date)
    const day = weatherForDay(date)
    const reasons: string[] = []
    let status: WindowStatus = 'ok'

    let start: Date
    let end: Date
    if (ride.daylight === 'around-sunset') {
      end = addMinutes(sun.sunset, 15)
      start = addMinutes(end, -ride.durationHours * 60)
    } else if (ride.daylight === 'daylight') {
      start = addMinutes(sun.sunrise, ride.sunriseBufferMin)
      end = addMinutes(start, ride.durationHours * 60)
    } else {
      start = addMinutes(sun.sunrise, ride.sunriseBufferMin)
      const low = pickLowTide(tides, start, addMinutes(sun.sunset, -30))
      if (low) {
        start = addMinutes(low.time, -ride.durationHours * 30)
        if (start < addMinutes(sun.sunrise, ride.sunriseBufferMin)) {
          start = addMinutes(sun.sunrise, ride.sunriseBufferMin)
        }
      }
      end = addMinutes(start, ride.durationHours * 60)
    }

    const low = pickLowTide(tides, start, end)

    if (day.windMaxKmh > ride.maxWindKmh) {
      status = 'unsuitable'
      reasons.push(`Wind ${Math.round(day.windMaxKmh)} km/h`)
    } else if (day.windMaxKmh > ride.maxWindKmh * 0.75) {
      status = 'caution'
      reasons.push(`Breezy ${Math.round(day.windMaxKmh)} km/h`)
    }

    if (day.rainMm > ride.maxRainMm) {
      status = 'unsuitable'
      reasons.push(`${day.rainMm.toFixed(0)} mm rain`)
    } else if (day.rainMm > ride.maxRainMm * 0.5) {
      if (status !== 'unsuitable') status = 'caution'
      reasons.push(`Showers ${day.rainMm.toFixed(1)} mm`)
    }

    if (ride.minTempC != null && day.maxTempC < ride.minTempC) {
      status = 'unsuitable'
      reasons.push(`Cool ${Math.round(day.maxTempC)}°C`)
    }

    if (ride.usesTides) {
      if (!low) {
        if (status !== 'unsuitable') status = 'caution'
        reasons.push('Tide times unavailable')
      } else if (!tideUsable(low, start, end)) {
        status = 'unsuitable'
        reasons.push(`Tide not aligned (${formatClock(low.time)})`)
      } else {
        reasons.push(`Low tide ${formatClock(low.time)}`)
      }
    }

    reasons.unshift(`Sunrise ${formatClock(sun.sunrise)}`)
    if (ride.daylight === 'around-sunset') reasons.unshift(`Sunset ${formatClock(sun.sunset)}`)

    const conflict = calendarConflict(date, minutesOf(start), minutesOf(end), undefined)
    if (conflict && status !== 'unsuitable') {
      status = 'conflict'
      reasons.push(conflict)
    }

    const summary =
      status === 'ok'
        ? `${formatClock(start)}–${formatClock(end)} · ${day.label}`
        : status === 'caution'
          ? `${formatClock(start)}–${formatClock(end)} · check conditions`
          : status === 'conflict'
            ? 'Calendar conflict'
            : 'Not a good window'

    out.push({
      date,
      dayLabel: formatDay(start),
      start,
      end,
      startClock: formatClock(start),
      endClock: formatClock(end),
      status,
      reasons,
      summary,
      lowTideClock: low ? formatClock(low.time) : undefined,
    })
  }
  return out
}

const store = {
  horses: HORSES.map((h) => ({ ...h, rideIds: [...h.rideIds] })),
  events: [] as CalendarEvent[],
  lastScriptRead: '',
  lastScriptWrite: '',
}

function seedEvents() {
  if (store.events.length) return
  const d0 = todayKey()
  store.events = [
    {
      id: 'cal-farrier',
      date: addDaysKey(d0, 2),
      title: 'Farrier — all horses',
      kind: 'busy',
      startMin: 9 * 60,
      endMin: 12 * 60,
    },
    {
      id: 'cal-private',
      date: addDaysKey(d0, 3),
      title: 'Private group (already booked)',
      kind: 'busy',
      startMin: 14 * 60,
      endMin: 16 * 60 + 30,
    },
    {
      id: 'cal-open-beach',
      date: addDaysKey(d0, 1),
      title: 'Bookable window',
      kind: 'open',
      startMin: 8 * 60,
      endMin: 17 * 60,
    },
    {
      id: 'cal-stay',
      date: addDaysKey(d0, 4),
      title: 'Farmstay occupied',
      kind: 'stay',
      startMin: 16 * 60,
      endMin: 20 * 60,
      stayId: 'farmstay',
    },
  ]
}

seedEvents()

export function getHorses(): Horse[] {
  return store.horses
}

export function getEvents(): CalendarEvent[] {
  return store.events
}

export function eventsOn(date: string): CalendarEvent[] {
  return store.events.filter((e) => e.date === date).sort((a, b) => a.startMin - b.startMin)
}

export function calendarConflict(
  date: string,
  startMin: number,
  endMin: number,
  horseId?: string,
): string | null {
  for (const ev of eventsOn(date)) {
    if (ev.kind === 'open') continue
    const overlap = startMin < ev.endMin && endMin > ev.startMin
    if (!overlap) continue
    if (ev.kind === 'stay') continue
    if (horseId && ev.horseId && ev.horseId !== horseId) continue
    return `Calendar busy: ${ev.title} (${ev.id})`
  }
  return null
}

function ridesThatDay(horseId: string, date: string): number {
  return store.events.filter((e) => e.date === date && e.horseId === horseId && e.kind === 'booking')
    .length
}

export function horseAvailable(horse: Horse, ride: RideType, date: string, startMin: number, endMin: number): string | null {
  if (!horse.rideIds.includes(ride.id)) return `${horse.name} does not do this ride`
  if (horse.restWeekday != null && weekdayFromKey(date) === horse.restWeekday) {
    return `${horse.name} is on a rest day`
  }
  if (ridesThatDay(horse.id, date) >= horse.maxPerDay) return `${horse.name} is at max rides today`
  const clash = calendarConflict(date, startMin, endMin, horse.id)
  if (clash) return clash
  return null
}

export function freeHorses(ride: RideType, date: string, startMin: number, endMin: number): Horse[] {
  return getHorses().filter((h) => !horseAvailable(h, ride, date, startMin, endMin))
}

/** Simulated Apps Script GET ?action=availability */
export function scriptAvailability(rideId: RideId): RideWindow[] {
  return buildWindows(rideById(rideId))
}

export interface BookRequest {
  rideId: RideId
  date: string
  startMin: number
  endMin: number
  horseId: string
  stayId?: StayId
  guestName?: string
}

/** Simulated Apps Script POST { action: "book" } — re-checks calendar then writes. */
export function scriptBook(req: BookRequest): string | null {
  const ride = rideById(req.rideId)
  const horse = horseById(req.horseId)
  if (!horse) return 'Horse not found.'
  const clash = horseAvailable(horse, ride, req.date, req.startMin, req.endMin)
  if (clash) {
    store.lastScriptRead = `GET availability · conflict`
    return clash
  }
  const id = `cal-book-${store.events.length + 1}`
  store.events = [
    ...store.events,
    {
      id,
      date: req.date,
      title: `${ride.name} · ${horse.name}${req.guestName ? ` · ${req.guestName}` : ''}`,
      kind: 'booking',
      startMin: req.startMin,
      endMin: req.endMin,
      horseId: horse.id,
      rideId: ride.id,
    },
  ]
  if (req.stayId) {
    store.events = [
      ...store.events,
      {
        id: `${id}-stay`,
        date: req.date,
        title: stayById(req.stayId)?.name ?? 'Stay',
        kind: 'stay',
        startMin: 16 * 60,
        endMin: 20 * 60,
        stayId: req.stayId,
      },
    ]
  }
  store.lastScriptWrite = id
  store.lastScriptRead = `POST book · re-check passed`
  return null
}

export function toggleHorseRest(horseId: string, date?: string): void {
  const horse = store.horses.find((h) => h.id === horseId)
  if (!horse) return
  const wd = weekdayFromKey(date ?? todayKey())
  if (date != null) {
    horse.restWeekday = horse.restWeekday === wd ? null : wd
    return
  }
  horse.restWeekday = horse.restWeekday == null ? wd : null
}

export function setHorseMax(horseId: string, max: number): void {
  const horse = store.horses.find((h) => h.id === horseId)
  if (!horse) return
  horse.maxPerDay = Math.min(4, Math.max(1, Math.round(max)))
}

export function addStayNight(date: string, stayId: StayId): void {
  const clash = eventsOn(date).find((e) => e.kind === 'stay' && e.stayId === stayId)
  if (clash) return
  store.events = [
    ...store.events,
    {
      id: `cal-stay-${store.events.length + 1}`,
      date,
      title: stayById(stayId)?.name ?? 'Stay',
      kind: 'stay',
      startMin: 16 * 60,
      endMin: 20 * 60,
      stayId,
    },
  ]
  store.lastScriptWrite = store.events[store.events.length - 1].id
}

export function syncLabels(): { script: string; calendar: string } {
  return {
    script: store.lastScriptRead
      ? `Apps Script (demo) · ${store.lastScriptRead}`
      : 'Apps Script (demo) · idle — would call /exec',
    calendar: store.lastScriptWrite
      ? `Google Calendar (demo) · event ${store.lastScriptWrite}`
      : 'Google Calendar (demo) · checking linked calendar for conflicts',
  }
}

export function clockFromMin(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  const d = new Date(Date.UTC(2026, 0, 1, h, m))
  return new Intl.DateTimeFormat('en-NZ', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }).format(d)
}

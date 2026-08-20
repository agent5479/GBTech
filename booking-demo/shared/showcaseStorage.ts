import type { PendingBooking } from './showcaseTypes';

export const SHOWCASE_PENDING_KEY = 'gbt/showcase/pending-bookings';
export const SHOWCASE_HANDLED_KEY = 'gbt/showcase/handled-bookings';

let nextRowIndex = 1000;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function readShowcasePendingBookings(): PendingBooking[] {
  return readJson<PendingBooking[]>(SHOWCASE_PENDING_KEY, []);
}

export function appendShowcasePendingBooking(
  booking: Omit<PendingBooking, 'rowIndex' | 'timestamp' | 'calendarEventId'>
): PendingBooking {
  const rowIndex = nextRowIndex++;
  const entry: PendingBooking = {
    ...booking,
    rowIndex,
    timestamp: new Date().toISOString(),
    calendarEventId: `showcase_evt_${rowIndex}`,
  };
  const existing = readShowcasePendingBookings();
  writeJson(SHOWCASE_PENDING_KEY, [...existing, entry]);
  return entry;
}

export function readShowcaseHandledRows(): number[] {
  return readJson<number[]>(SHOWCASE_HANDLED_KEY, []);
}

export function markShowcaseBookingHandled(rowIndex: number): void {
  const handled = readShowcaseHandledRows();
  if (!handled.includes(rowIndex)) {
    writeJson(SHOWCASE_HANDLED_KEY, [...handled, rowIndex]);
  }
}

export function listActiveShowcasePendingBookings(): PendingBooking[] {
  const handled = new Set(readShowcaseHandledRows());
  return readShowcasePendingBookings().filter((b) => !handled.has(b.rowIndex));
}

import {
  BOOKING_SERVICE_TYPES,
  type BookingServiceType,
} from '@shared/bookingServiceTypes';
import type { AvailabilityResult, BookingSlot } from '../data/bookingConfig';
import { BOOKING_FACILITIES } from '../data/bookingFacilities';

export interface ShowcaseCalendarBlock {
  facilityId: string;
  facilityLabel: string;
  startHour: number;
  endHour: number;
  title: string;
}

/** Stable hash so sample bookings stay consistent for a given date + facility. */
function daySeed(date: string, facilityId: string): number {
  let h = 0;
  const key = `${date}:${facilityId}`;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Deterministic sample “already booked” blocks for the demo calendar and slot picker.
 * Hours are local wall-clock (9–17).
 */
export function getShowcaseBookedBlocks(date: string, facilityId: string): ShowcaseCalendarBlock[] {
  const facility = BOOKING_FACILITIES.find((f) => f.id === facilityId);
  if (!facility) return [];

  const seed = daySeed(date, facilityId);
  const patterns: { startHour: number; endHour: number; title: string }[] = [
    { startHour: 9, endHour: 11, title: 'Sample booking' },
    { startHour: 11, endHour: 15, title: 'Sample booking' },
    { startHour: 13, endHour: 17, title: 'Sample booking' },
    { startHour: 10, endHour: 12, title: 'Sample booking' },
  ];
  const pick = patterns[seed % patterns.length];

  // Roughly half of days have a conflict so visitors see both free and busy days.
  if (seed % 2 === 0) return [];

  return [
    {
      facilityId,
      facilityLabel: facility.label,
      startHour: pick.startHour,
      endHour: pick.endHour,
      title: `${facility.label} — ${pick.title}`,
    },
  ];
}

export function getShowcaseWeekBlocks(dates: string[]): ShowcaseCalendarBlock[] {
  return dates.flatMap((date) =>
    BOOKING_FACILITIES.flatMap((f) =>
      getShowcaseBookedBlocks(date, f.id).map((b) => ({ ...b, title: `${date.slice(5)} · ${b.title}` }))
    )
  );
}

function overlaps(startHour: number, endHour: number, blocks: ShowcaseCalendarBlock[]): boolean {
  return blocks.some((b) => startHour < b.endHour && endHour > b.startHour);
}

function formatSlotLabel(start: Date): string {
  return start.toLocaleString('en-NZ', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Build bookable slots for a date, honouring duration and sample conflicts. */
export function buildShowcaseAvailability(
  date: string,
  bookingType: string,
  facilityId: string
): AvailabilityResult {
  const config = isBookingType(bookingType) ? BOOKING_SERVICE_TYPES[bookingType] : undefined;
  if (!config) {
    return { success: false, message: 'Unknown booking type.' };
  }

  const sessionHours = Math.max(1, Math.ceil(config.sessionMinutes / 60));
  const blocks = getShowcaseBookedBlocks(date, facilityId);
  const slots: BookingSlot[] = [];
  const dayStart = 9;
  const dayEnd = 17;

  for (let hour = dayStart; hour + sessionHours <= dayEnd; hour += sessionHours === 1 ? 1 : sessionHours) {
    if (overlaps(hour, hour + sessionHours, blocks)) continue;

    const start = new Date(`${date}T00:00:00`);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(hour + sessionHours, 0, 0, 0);

    slots.push({
      start: start.toISOString(),
      end: end.toISOString(),
      label: formatSlotLabel(start),
    });
  }

  return {
    success: true,
    slots,
    booking_window: {
      start_label: '9:00 am',
      last_start_label: '4:00 pm',
      season: 'Showcase demo',
    },
    message: slots.length ? undefined : 'No slots available on this date. Try another day.',
  };
}

function isBookingType(value: string): value is BookingServiceType {
  return value in BOOKING_SERVICE_TYPES;
}

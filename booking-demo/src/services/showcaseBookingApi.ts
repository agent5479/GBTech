import type { AvailabilityResult, BookingSlot } from '../data/bookingConfig';
import { appendShowcasePendingBooking } from '@shared/showcaseStorage';

function buildSlots(date: string): BookingSlot[] {
  const base = new Date(`${date}T09:00:00`);
  const slots: BookingSlot[] = [];
  for (let hour = 9; hour <= 15; hour += 2) {
    const start = new Date(base);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(hour + 2, 0, 0, 0);
    const label = start.toLocaleString('en-NZ', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });
    slots.push({
      start: start.toISOString(),
      end: end.toISOString(),
      label,
    });
  }
  return slots;
}

export async function fetchShowcaseAvailability(
  _date: string,
  _bookingType: string,
  _location: string,
  _category: string
): Promise<AvailabilityResult> {
  await new Promise((r) => setTimeout(r, 300));
  return {
    success: true,
    slots: buildSlots(_date),
    booking_window: {
      start_label: '9:00 am',
      last_start_label: '3:00 pm',
      season: 'Showcase demo',
    },
  };
}

export interface ShowcaseSubmitPayload {
  booking_type: string;
  location: string;
  category: string;
  slot_start: string;
  slot_end: string;
  name: string;
  phone: string;
  email: string;
  organisation: string;
  message: string;
  extended_json?: string;
}

export async function submitShowcaseBooking(payload: ShowcaseSubmitPayload): Promise<{ success: boolean; message?: string }> {
  await new Promise((r) => setTimeout(r, 400));
  appendShowcasePendingBooking({
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    organisation: payload.organisation || undefined,
    facilityType: payload.booking_type,
    message: payload.message,
    appointmentStart: payload.slot_start,
    appointmentEnd: payload.slot_end,
    location: payload.location,
    category: payload.category,
    extendedJson: payload.extended_json,
  });
  return { success: true, message: 'Booking recorded in showcase demo. Open the staff app to import it.' };
}

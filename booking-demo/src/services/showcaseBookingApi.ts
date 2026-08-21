import type { AvailabilityResult } from '../data/bookingConfig';
import { appendShowcasePendingBooking } from '@shared/showcaseStorage';
import { buildShowcaseAvailability } from './showcaseAvailability';

export async function fetchShowcaseAvailability(
  date: string,
  bookingType: string,
  facilityId: string
): Promise<AvailabilityResult> {
  await new Promise((r) => setTimeout(r, 280));
  const result = buildShowcaseAvailability(date, bookingType, facilityId);
  if (result.success && !result.slots?.length) {
    return {
      ...result,
      message: result.message || 'No slots available on this date. Try another day.',
    };
  }
  return result;
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

export async function submitShowcaseBooking(
  payload: ShowcaseSubmitPayload
): Promise<{ success: boolean; message?: string }> {
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
  return {
    success: true,
    message: 'Booking recorded in showcase demo. Open the staff app to import it.',
  };
}

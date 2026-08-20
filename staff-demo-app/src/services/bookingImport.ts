import type { Renter, Rental, TenantData } from '@/types';
import { getEnv } from './env';
import { tenantPath } from './mutations';
import { IS_SHOWCASE_MODE } from '@/config/showcaseMode';
import {
  listActiveShowcasePendingBookings,
  markShowcaseBookingHandled,
} from '@shared/showcaseStorage';
import { getShowcaseSeedPendingBookings } from '@/data/showcaseFixtures';

export interface PendingBooking {
  rowIndex: number;
  timestamp: string;
  name: string;
  phone: string;
  email: string;
  organisation?: string;
  facilityType?: string;
  addons?: string;
  message: string;
  appointmentStart: string;
  appointmentEnd: string;
  calendarEventId: string;
  location: string;
  category?: string;
  extendedJson?: string;
  /** @deprecated Gold Standard field — may be empty for Hub */
  dogName?: string;
  dogBreed?: string;
  dogAge?: string;
  region?: string;
}

export interface RentalImportPlan {
  renter: Renter;
  rental: Rental;
  renterIsNew: boolean;
  rentalIsNew: boolean;
}

/** @deprecated Use RentalImportPlan */
export type BookingImportPlan = RentalImportPlan;

export function isBookingImportConfigured(): boolean {
  if (IS_SHOWCASE_MODE) return true;
  return Boolean(getEnv('BOOKING_API_URL') && getEnv('BOOKING_IMPORT_KEY'));
}

async function postBookingAction<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const url = getEnv('BOOKING_API_URL');
  const trainerKey = getEnv('BOOKING_IMPORT_KEY');
  if (!url || !trainerKey) {
    throw new Error('Booking import is not configured. Set VITE_BOOKING_API_URL and VITE_BOOKING_IMPORT_KEY.');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, trainer_key: trainerKey, ...payload }),
  });

  const data = (await response.json()) as { success?: boolean; message?: string };
  if (!response.ok || data.success === false) {
    throw new Error(data.message || 'Booking import request failed');
  }

  return data as T;
}

export async function fetchPendingBookings(): Promise<PendingBooking[]> {
  if (IS_SHOWCASE_MODE) {
    const fromStorage = listActiveShowcasePendingBookings();
    const seeds = getShowcaseSeedPendingBookings();
    const seen = new Set(fromStorage.map((b) => b.rowIndex));
    const merged = [...fromStorage, ...seeds.filter((s) => !seen.has(s.rowIndex))];
    return merged.sort(
      (a, b) => new Date(a.appointmentStart).getTime() - new Date(b.appointmentStart).getTime()
    );
  }
  const data = await postBookingAction<{ bookings: PendingBooking[] }>('list_bookings');
  return data.bookings || [];
}

export async function markBookingImported(rowIndex: number): Promise<void> {
  if (IS_SHOWCASE_MODE) {
    markShowcaseBookingHandled(rowIndex);
    return;
  }
  await postBookingAction('mark_imported', { row_index: rowIndex });
}

export async function markBookingDismissed(rowIndex: number): Promise<void> {
  if (IS_SHOWCASE_MODE) {
    markShowcaseBookingHandled(rowIndex);
    return;
  }
  await postBookingAction('mark_dismissed', { row_index: rowIndex });
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

function renterIdFromPhone(phone: string): string {
  const digits = normalizePhone(phone);
  return `renter_phone_${digits || Date.now()}`;
}

function renterIdFromEmail(email: string): string {
  const slug = normalizeEmail(email).replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  return `renter_${slug || Date.now()}`;
}

function sanitizeFirebaseKey(raw: string): string {
  return raw.replace(/[.#$\[\]/]/g, '_').replace(/@/g, '_');
}

function idFromCalendarEvent(calendarEventId?: string): string {
  const raw = calendarEventId?.trim();
  if (!raw) return String(Date.now());
  return sanitizeFirebaseKey(raw);
}

function parsePriceFromExtended(extendedJson?: string): number | undefined {
  if (!extendedJson) return undefined;
  try {
    const parsed = JSON.parse(extendedJson) as { priceLabel?: string };
    const match = String(parsed.priceLabel || '').match(/\$(\d+)/);
    return match ? Number(match[1]) : undefined;
  } catch {
    return undefined;
  }
}

function parseBookingType(extendedJson?: string, facilityType?: string): string | undefined {
  if (extendedJson) {
    try {
      const parsed = JSON.parse(extendedJson) as { bookingType?: string };
      if (parsed.bookingType) return parsed.bookingType;
    } catch {
      /* ignore */
    }
  }
  return facilityType;
}

export function planRentalImport(booking: PendingBooking, data: TenantData): RentalImportPlan | null {
  const phone = booking.phone?.trim();
  if (!phone) return null;

  if (data.rentals.some((rental) => rental.calendarEventId === booking.calendarEventId)) {
    return null;
  }

  const emailRaw = booking.email?.trim();
  const nameRaw = booking.name?.trim();
  const organisation = booking.organisation?.trim();

  let existingRenter = emailRaw
    ? data.renters.find((r) => normalizeEmail(r.email || '') === normalizeEmail(emailRaw))
    : undefined;
  if (!existingRenter && phone) {
    const normPhone = normalizePhone(phone);
    existingRenter = data.renters.find((r) => normalizePhone(r.phone || '') === normPhone);
  }

  const renterId = existingRenter
    ? String(existingRenter.id)
    : emailRaw
      ? renterIdFromEmail(emailRaw)
      : renterIdFromPhone(phone);
  const now = new Date().toISOString();
  const eventKey = idFromCalendarEvent(booking.calendarEventId);
  const rentalId = `rental_${eventKey}`;
  const amountDue = parsePriceFromExtended(booking.extendedJson);
  const isEquipment = booking.category === 'equipment';

  const renter: Renter = {
    ...(existingRenter || {}),
    id: renterId,
    name: nameRaw || organisation || existingRenter?.name || phone,
    phone: phone || existingRenter?.phone,
    email: emailRaw || existingRenter?.email,
    organisation: organisation || existingRenter?.organisation,
    notes: mergeNotes(existingRenter?.notes, booking.message),
    updatedAt: now,
    createdAt: existingRenter?.createdAt || now,
  };

  const rental: Rental = {
    id: rentalId,
    renterId,
    facility: booking.location,
    category: booking.category,
    bookingType: parseBookingType(booking.extendedJson, booking.facilityType),
    start: booking.appointmentStart,
    end: booking.appointmentEnd,
    calendarEventId: booking.calendarEventId,
    sheetRowIndex: booking.rowIndex,
    amountDue,
    amountPaid: 0,
    currency: 'NZD',
    depositAmount: isEquipment ? 50 : undefined,
    depositStatus: isEquipment ? 'held' : undefined,
    paymentStatus: 'unpaid',
    importedAt: now,
    notes: booking.message?.trim() || undefined,
    extendedJson: booking.extendedJson,
    updatedAt: now,
  };

  return {
    renter,
    rental,
    renterIsNew: !existingRenter,
    rentalIsNew: true,
  };
}

/** @deprecated Use planRentalImport for Hub */
export const planBookingImport = planRentalImport;

function mergeNotes(existing: string | undefined, incoming: string | undefined): string | undefined {
  const next = incoming?.trim();
  if (!next) return existing;
  if (!existing?.trim()) return next;
  if (existing.includes(next)) return existing;
  return `${existing}\n\nBooking notes:\n${next}`;
}

export function importPlanPaths(tenantId: string, plan: RentalImportPlan) {
  return {
    renterPath: tenantPath(tenantId, 'renters', plan.renter.id),
    rentalPath: tenantPath(tenantId, 'rentals', plan.rental.id),
  };
}

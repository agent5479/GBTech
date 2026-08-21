/** Facility × duration booking types — keep in sync with google-apps-script/Code.gs BOOKING_TYPES. */

export type BookingServiceType =
  | 'workshop_hourly'
  | 'workshop_half_day'
  | 'workshop_full_day'
  | 'kitchen_hourly'
  | 'kitchen_half_day'
  | 'kitchen_full_day'
  | 'seminar_hourly'
  | 'seminar_half_day'
  | 'seminar_full_day'
  | 'equipment_hourly';

export type DurationPackage = 'hourly' | 'half_day' | 'full_day';

export interface BookingServiceTypeConfig {
  id: BookingServiceType;
  label: string;
  headline: string;
  facilityId: string;
  locationLabel: string;
  category: 'facility' | 'equipment';
  durationPackage: DurationPackage;
  sessionMinutes: number;
  calendarBlockMinutes: number;
  priceLabel: string;
}

export const BOOKING_SERVICE_TYPES: Record<BookingServiceType, BookingServiceTypeConfig> = {
  workshop_hourly: {
    id: 'workshop_hourly',
    label: 'Workshop — hourly',
    headline: '1 hour in the Creative Workshop',
    facilityId: 'workshop',
    locationLabel: 'Creative Workshop',
    category: 'facility',
    durationPackage: 'hourly',
    sessionMinutes: 60,
    calendarBlockMinutes: 60,
    priceLabel: '$10',
  },
  workshop_half_day: {
    id: 'workshop_half_day',
    label: 'Workshop — half day (4 hours)',
    headline: '4 hours in the Creative Workshop',
    facilityId: 'workshop',
    locationLabel: 'Creative Workshop',
    category: 'facility',
    durationPackage: 'half_day',
    sessionMinutes: 240,
    calendarBlockMinutes: 240,
    priceLabel: '$35',
  },
  workshop_full_day: {
    id: 'workshop_full_day',
    label: 'Workshop — full day',
    headline: 'Full day in the Creative Workshop',
    facilityId: 'workshop',
    locationLabel: 'Creative Workshop',
    category: 'facility',
    durationPackage: 'full_day',
    sessionMinutes: 480,
    calendarBlockMinutes: 480,
    priceLabel: '$55',
  },
  kitchen_hourly: {
    id: 'kitchen_hourly',
    label: 'Kitchen — hourly',
    headline: '1 hour in the Prep Kitchen',
    facilityId: 'kitchen',
    locationLabel: 'Prep Kitchen',
    category: 'facility',
    durationPackage: 'hourly',
    sessionMinutes: 60,
    calendarBlockMinutes: 60,
    priceLabel: '$12',
  },
  kitchen_half_day: {
    id: 'kitchen_half_day',
    label: 'Kitchen — half day (4 hours)',
    headline: '4 hours in the Prep Kitchen',
    facilityId: 'kitchen',
    locationLabel: 'Prep Kitchen',
    category: 'facility',
    durationPackage: 'half_day',
    sessionMinutes: 240,
    calendarBlockMinutes: 240,
    priceLabel: '$40',
  },
  kitchen_full_day: {
    id: 'kitchen_full_day',
    label: 'Kitchen — full day',
    headline: 'Full day in the Prep Kitchen',
    facilityId: 'kitchen',
    locationLabel: 'Prep Kitchen',
    category: 'facility',
    durationPackage: 'full_day',
    sessionMinutes: 480,
    calendarBlockMinutes: 480,
    priceLabel: '$70',
  },
  seminar_hourly: {
    id: 'seminar_hourly',
    label: 'Seminar Room — hourly',
    headline: '1 hour in the Seminar Room',
    facilityId: 'seminar',
    locationLabel: 'Seminar Room',
    category: 'facility',
    durationPackage: 'hourly',
    sessionMinutes: 60,
    calendarBlockMinutes: 60,
    priceLabel: '$8',
  },
  seminar_half_day: {
    id: 'seminar_half_day',
    label: 'Seminar Room — half day (4 hours)',
    headline: '4 hours in the Seminar Room',
    facilityId: 'seminar',
    locationLabel: 'Seminar Room',
    category: 'facility',
    durationPackage: 'half_day',
    sessionMinutes: 240,
    calendarBlockMinutes: 240,
    priceLabel: '$30',
  },
  seminar_full_day: {
    id: 'seminar_full_day',
    label: 'Seminar Room — full day',
    headline: 'Full day in the Seminar Room',
    facilityId: 'seminar',
    locationLabel: 'Seminar Room',
    category: 'facility',
    durationPackage: 'full_day',
    sessionMinutes: 480,
    calendarBlockMinutes: 480,
    priceLabel: '$50',
  },
  equipment_hourly: {
    id: 'equipment_hourly',
    label: 'AV kit — hourly',
    headline: '1 hour portable AV kit hire',
    facilityId: 'equipment',
    locationLabel: 'Portable AV kit',
    category: 'equipment',
    durationPackage: 'hourly',
    sessionMinutes: 60,
    calendarBlockMinutes: 60,
    priceLabel: '$20 + $50 deposit',
  },
};

export const BOOKING_SERVICE_TYPE_LIST: BookingServiceTypeConfig[] = Object.values(BOOKING_SERVICE_TYPES);

export function isBookingServiceType(value: string): value is BookingServiceType {
  return value in BOOKING_SERVICE_TYPES;
}

export function getBookingServiceTypeConfig(serviceType: BookingServiceType): BookingServiceTypeConfig {
  return BOOKING_SERVICE_TYPES[serviceType];
}

export function getServiceTypesForFacility(facilityId: string): BookingServiceTypeConfig[] {
  return BOOKING_SERVICE_TYPE_LIST.filter((t) => t.facilityId === facilityId);
}

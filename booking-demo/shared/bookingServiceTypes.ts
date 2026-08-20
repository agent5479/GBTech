/** Facility × duration booking types — keep in sync with google-apps-script/Code.gs BOOKING_TYPES. */

export type BookingServiceType =
  | 'makerspace_hourly'
  | 'makerspace_half_day'
  | 'makerspace_full_day'
  | 'kitchen_hourly'
  | 'kitchen_half_day'
  | 'kitchen_full_day'
  | 'earth_building_hourly'
  | 'earth_building_half_day'
  | 'earth_building_full_day'
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
  makerspace_hourly: {
    id: 'makerspace_hourly',
    label: 'Makerspace — hourly',
    headline: '1 hour in The Makerspace',
    facilityId: 'makerspace',
    locationLabel: 'The Makerspace',
    category: 'facility',
    durationPackage: 'hourly',
    sessionMinutes: 60,
    calendarBlockMinutes: 60,
    priceLabel: '$10',
  },
  makerspace_half_day: {
    id: 'makerspace_half_day',
    label: 'Makerspace — half day (4 hours)',
    headline: '4 hours in The Makerspace',
    facilityId: 'makerspace',
    locationLabel: 'The Makerspace',
    category: 'facility',
    durationPackage: 'half_day',
    sessionMinutes: 240,
    calendarBlockMinutes: 240,
    priceLabel: '$35',
  },
  makerspace_full_day: {
    id: 'makerspace_full_day',
    label: 'Makerspace — full day',
    headline: 'Full day in The Makerspace',
    facilityId: 'makerspace',
    locationLabel: 'The Makerspace',
    category: 'facility',
    durationPackage: 'full_day',
    sessionMinutes: 480,
    calendarBlockMinutes: 480,
    priceLabel: '$55',
  },
  kitchen_hourly: {
    id: 'kitchen_hourly',
    label: 'Kitchen — hourly',
    headline: '1 hour in The Kitchen',
    facilityId: 'kitchen',
    locationLabel: 'The Kitchen',
    category: 'facility',
    durationPackage: 'hourly',
    sessionMinutes: 60,
    calendarBlockMinutes: 60,
    priceLabel: '$12',
  },
  kitchen_half_day: {
    id: 'kitchen_half_day',
    label: 'Kitchen — half day (4 hours)',
    headline: '4 hours in The Kitchen',
    facilityId: 'kitchen',
    locationLabel: 'The Kitchen',
    category: 'facility',
    durationPackage: 'half_day',
    sessionMinutes: 240,
    calendarBlockMinutes: 240,
    priceLabel: '$40',
  },
  kitchen_full_day: {
    id: 'kitchen_full_day',
    label: 'Kitchen — full day',
    headline: 'Full day in The Kitchen',
    facilityId: 'kitchen',
    locationLabel: 'The Kitchen',
    category: 'facility',
    durationPackage: 'full_day',
    sessionMinutes: 480,
    calendarBlockMinutes: 480,
    priceLabel: '$70',
  },
  earth_building_hourly: {
    id: 'earth_building_hourly',
    label: 'Earth Building — hourly',
    headline: '1 hour in Earth Building',
    facilityId: 'earth-building',
    locationLabel: 'Earth Building',
    category: 'facility',
    durationPackage: 'hourly',
    sessionMinutes: 60,
    calendarBlockMinutes: 60,
    priceLabel: 'TBD',
  },
  earth_building_half_day: {
    id: 'earth_building_half_day',
    label: 'Earth Building — half day (4 hours)',
    headline: '4 hours in Earth Building',
    facilityId: 'earth-building',
    locationLabel: 'Earth Building',
    category: 'facility',
    durationPackage: 'half_day',
    sessionMinutes: 240,
    calendarBlockMinutes: 240,
    priceLabel: 'TBD',
  },
  earth_building_full_day: {
    id: 'earth_building_full_day',
    label: 'Earth Building — full day',
    headline: 'Full day in Earth Building',
    facilityId: 'earth-building',
    locationLabel: 'Earth Building',
    category: 'facility',
    durationPackage: 'full_day',
    sessionMinutes: 480,
    calendarBlockMinutes: 480,
    priceLabel: 'TBD',
  },
  equipment_hourly: {
    id: 'equipment_hourly',
    label: 'Equipment — hourly',
    headline: '1 hour equipment hire',
    facilityId: 'equipment',
    locationLabel: 'Fruit processing equipment',
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

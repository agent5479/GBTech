/** Canonical booking payloads for automated pipeline tests. */

export const SAMPLE_BOOKING_API_PAYLOAD = {
  action: 'book',
  booking_type: 'kitchen_half_day',
  location: 'The Kitchen',
  category: 'facility',
  slot_start: '2026-07-15T09:00:00',
  name: 'Jane Smith',
  phone: '027 123 4567',
  email: 'jane@example.com',
  organisation: 'Takaka Craft Group',
  message: 'Pizza oven session for workshop',
  website: '',
} as const;

export const SAMPLE_EXTENDED_DETAILS_INPUT = {
  firewood: true,
  cleaningFeeAck: true,
  depositAck: false,
  equipmentDeposit: false,
  addonNotes: 'Need access to pizza oven',
  bookingType: 'kitchen_half_day' as const,
  durationPackage: 'half_day' as const,
  priceLabel: '$40',
};

export const SAMPLE_EXTENDED_JSON_PARSED = {
  v: 1,
  bookingType: 'kitchen_half_day',
  durationPackage: 'half_day',
  priceLabel: '$40',
  firewood: true,
  cleaningFeeAck: true,
  equipmentDeposit: false,
  depositAck: false,
  addonNotes: 'Need access to pizza oven',
};

export const SAMPLE_EQUIPMENT_API_PAYLOAD = {
  action: 'book',
  booking_type: 'equipment_hourly',
  location: 'Fruit processing equipment',
  category: 'equipment',
  slot_start: '2026-08-01T10:00:00',
  name: 'Maria Garcia',
  phone: '021 234 5678',
  email: 'maria@example.com',
  organisation: 'Community Kitchen Collective',
  message: 'Apple press hire',
  website: '',
};

export const SAMPLE_EQUIPMENT_EXTENDED_JSON = {
  v: 1,
  bookingType: 'equipment_hourly',
  durationPackage: 'hourly',
  priceLabel: '$20 + $50 deposit',
  equipmentDeposit: true,
  depositAck: true,
  cleaningFeeAck: true,
  firewood: false,
};

export const SAMPLE_PENDING_BOOKING = {
  rowIndex: 42,
  timestamp: '2026-06-18T10:00:00.000Z',
  name: SAMPLE_BOOKING_API_PAYLOAD.name,
  phone: SAMPLE_BOOKING_API_PAYLOAD.phone,
  email: SAMPLE_BOOKING_API_PAYLOAD.email,
  organisation: SAMPLE_BOOKING_API_PAYLOAD.organisation,
  facilityType: 'Kitchen — half day (4 hours)',
  addons: 'Cleaning fee ack',
  message: SAMPLE_BOOKING_API_PAYLOAD.message,
  appointmentStart: '2026-07-15T09:00:00+12:00',
  appointmentEnd: '2026-07-15T13:00:00+12:00',
  calendarEventId: 'evt_test_123',
  location: 'The Kitchen',
  category: 'facility',
  extendedJson: JSON.stringify(SAMPLE_EXTENDED_JSON_PARSED),
};

export function sampleBookingPayload(overrides: Record<string, string> = {}) {
  return { ...SAMPLE_BOOKING_API_PAYLOAD, ...overrides };
}

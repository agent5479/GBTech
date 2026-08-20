/** Booking categories — keep in sync with google-apps-script/Code.gs CATEGORIES. */

export type BookingCategoryId = 'facility' | 'equipment';

export interface BookingCategoryConfig {
  id: BookingCategoryId;
  label: string;
}

export const BOOKING_CATEGORIES: Record<BookingCategoryId, BookingCategoryConfig> = {
  facility: { id: 'facility', label: 'Facility hire' },
  equipment: { id: 'equipment', label: 'Equipment hire' },
};

export const BOOKING_CATEGORY_LIST: BookingCategoryConfig[] = [
  BOOKING_CATEGORIES.facility,
  BOOKING_CATEGORIES.equipment,
];

export function isBookingCategoryId(value: string): value is BookingCategoryId {
  return value === 'facility' || value === 'equipment';
}

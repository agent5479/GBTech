/** Pending booking shape shared between public demo and staff import. */
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
}

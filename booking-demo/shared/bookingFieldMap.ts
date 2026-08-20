/** Booking form → Apps Script → Google Sheet → staff import field linkage. */

export type BookingFieldSource = 'react-state' | 'form-input' | 'computed' | 'extended-json';

export interface BookingFieldLink {
  label: string;
  source: BookingFieldSource;
  formKey?: string;
  apiKey?: string;
  sheetColumn?: string;
  sheetHeader?: string;
  extendedJsonPath?: string;
  importTarget?: string;
  required?: boolean;
}

/** Submissions sheet columns A–Q — keep in sync with google-apps-script/Code.gs. */
export const BOOKING_SHEET_COLUMNS = [
  { col: 'A', header: 'Timestamp', key: 'timestamp' },
  { col: 'B', header: 'Type', key: 'type' },
  { col: 'C', header: 'Name', key: 'name' },
  { col: 'D', header: 'Phone', key: 'phone' },
  { col: 'E', header: 'Email', key: 'email' },
  { col: 'F', header: 'Organisation / Group', key: 'organisation' },
  { col: 'G', header: 'Facility Type', key: 'facilityType' },
  { col: 'H', header: 'Add-ons', key: 'addons' },
  { col: 'I', header: 'Message', key: 'message' },
  { col: 'J', header: 'Appointment Start', key: 'appointmentStart' },
  { col: 'K', header: 'Appointment End', key: 'appointmentEnd' },
  { col: 'L', header: 'Calendar Event ID', key: 'calendarEventId' },
  { col: 'M', header: 'Status', key: 'status' },
  { col: 'N', header: 'Facility', key: 'facility' },
  { col: 'O', header: 'Staff Processed', key: 'staffProcessed' },
  { col: 'P', header: 'Extended Details', key: 'extendedJson' },
  { col: 'Q', header: 'Booking Category', key: 'category' },
] as const;

export const BOOKING_FIELD_LINKS: BookingFieldLink[] = [
  {
    label: 'Booking type',
    source: 'react-state',
    formKey: 'selectedServiceType',
    apiKey: 'booking_type',
    extendedJsonPath: 'bookingType',
    importTarget: 'rental.bookingType',
    required: true,
  },
  {
    label: 'Category',
    source: 'react-state',
    formKey: 'selectedCategory',
    apiKey: 'category',
    sheetColumn: 'Q',
    sheetHeader: 'Booking Category',
    importTarget: 'rental.category',
    required: true,
  },
  {
    label: 'Time slot',
    source: 'react-state',
    formKey: 'selectedSlot',
    apiKey: 'slot_start',
    sheetColumn: 'J/K',
    sheetHeader: 'Appointment Start / End',
    importTarget: 'rental.start, rental.end',
    required: true,
  },
  {
    label: 'Facility',
    source: 'react-state',
    formKey: 'selectedFacilityId',
    apiKey: 'location',
    sheetColumn: 'N',
    sheetHeader: 'Facility',
    importTarget: 'rental.facility',
    required: true,
  },
  {
    label: 'Your name',
    source: 'form-input',
    formKey: 'name',
    apiKey: 'name',
    sheetColumn: 'C',
    sheetHeader: 'Name',
    importTarget: 'renter.name',
  },
  {
    label: 'Phone',
    source: 'form-input',
    formKey: 'phone',
    apiKey: 'phone',
    sheetColumn: 'D',
    sheetHeader: 'Phone',
    importTarget: 'renter.phone',
    required: true,
  },
  {
    label: 'Email',
    source: 'form-input',
    formKey: 'email',
    apiKey: 'email',
    sheetColumn: 'E',
    sheetHeader: 'Email',
    importTarget: 'renter.email',
  },
  {
    label: 'Organisation / group',
    source: 'form-input',
    formKey: 'organisation',
    apiKey: 'organisation',
    sheetColumn: 'F',
    sheetHeader: 'Organisation / Group',
    importTarget: 'renter.organisation',
  },
  {
    label: 'Notes',
    source: 'form-input',
    formKey: 'message',
    apiKey: 'message',
    sheetColumn: 'I',
    sheetHeader: 'Message',
    importTarget: 'rental.notes',
  },
  {
    label: 'Extended details bundle',
    source: 'computed',
    apiKey: 'extended_json',
    sheetColumn: 'P',
    sheetHeader: 'Extended Details',
    importTarget: 'rental.extendedJson',
  },
  {
    label: 'Honeypot (spam trap)',
    source: 'form-input',
    formKey: 'website',
    apiKey: 'website',
  },
];

export function getRequiredBookingApiKeys(): string[] {
  return BOOKING_FIELD_LINKS.filter((field) => field.required && field.apiKey).map(
    (field) => field.apiKey as string
  );
}

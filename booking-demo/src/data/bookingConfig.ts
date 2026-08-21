export const NOTIFY_EMAIL = 'staff@example.com';

export const DURATION_LABELS = {
  hourly: 'Hourly',
  half_day: 'Half day (4 hours)',
  full_day: 'Full day (8+ hours)',
} as const;

export const BOOKING_POLICY =
  'Bookings are held on the venue facility calendar. Payment is arranged with staff — online payment is not processed through this form.';

export const BOOKING_PREP =
  'Please arrive on time. Additional fees may apply for supplies or cleaning as noted on the rentals page.';

export interface BookingSlot {
  start: string;
  end: string;
  label: string;
}

export interface AvailabilityResult {
  success: boolean;
  category?: string;
  slots?: BookingSlot[];
  booking_window?: {
    start_label: string;
    last_start_label: string;
    season: string;
  };
  message?: string;
}

export function defaultBookingDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return formatIsoDate(d);
}

export function minBookingDate(): string {
  return formatIsoDate(new Date());
}

export function maxBookingDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  return formatIsoDate(d);
}

export function formatIsoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatDisplayDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-NZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function getQuickDateOptions(count = 7): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  const start = new Date();
  start.setDate(start.getDate() + 1);
  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const value = formatIsoDate(d);
    options.push({ value, label: formatDisplayDate(value) });
  }
  return options;
}

export function shortSlotLabel(slot: BookingSlot): string {
  return slot.label.replace(/, \d{1,2}:\d{2} [ap]m$/, '').trim();
}

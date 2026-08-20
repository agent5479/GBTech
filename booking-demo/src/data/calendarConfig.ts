/** Public facility-hire calendar — keep in sync with google-apps-script/Code.gs CALENDAR_ID. */

export const FACILITY_CALENDAR_ID =
  import.meta.env.VITE_CALENDAR_ID || 'YOUR_CALENDAR_ID@group.calendar.google.com';

export const CALENDAR_TIMEZONE = 'Pacific/Auckland';

export type CalendarEmbedMode = 'MONTH' | 'WEEK';

const PLACEHOLDER_SUFFIX = '@group.calendar.google.com';

export function isCalendarConfigured(): boolean {
  return (
    Boolean(FACILITY_CALENDAR_ID) &&
    !FACILITY_CALENDAR_ID.startsWith('YOUR_CALENDAR_ID')
  );
}

/** Standard Google Calendar public embed URL (month/week/day tabs when showTabs=1). */
export function getCalendarEmbedUrl(mode: CalendarEmbedMode = 'WEEK'): string {
  const params = new URLSearchParams({
    src: FACILITY_CALENDAR_ID,
    ctz: CALENDAR_TIMEZONE,
    mode,
    showTitle: '1',
    showNav: '1',
    showDate: '1',
    showTabs: '1',
    showPrint: '0',
    showCalendars: '0',
    wkst: '2',
  });
  return `https://calendar.google.com/calendar/embed?${params.toString()}`;
}

export function getCalendarPublicUrl(): string {
  const id = encodeURIComponent(FACILITY_CALENDAR_ID);
  return `https://calendar.google.com/calendar/embed?src=${id}&ctz=${encodeURIComponent(CALENDAR_TIMEZONE)}`;
}

export const CALENDAR_PLACEHOLDER_NOTE = `Set VITE_CALENDAR_ID in .env.local to the Hub Facility Hire calendar ID (ends with ${PLACEHOLDER_SUFFIX}). The calendar must be shared publicly as "See all event details".`;

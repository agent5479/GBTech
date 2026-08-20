import { useState } from 'react';
import { IS_SHOWCASE_MODE } from '@shared/showcaseMode';
import {
  CALENDAR_PLACEHOLDER_NOTE,
  type CalendarEmbedMode,
  getCalendarEmbedUrl,
  getCalendarPublicUrl,
  isCalendarConfigured,
} from '../data/calendarConfig';

interface BookingsCalendarEmbedProps {
  heading?: string;
  intro?: string;
  defaultMode?: CalendarEmbedMode;
}

export default function BookingsCalendarEmbed({
  heading = 'Bookings Calendar',
  intro = 'See which times are already booked across our hire venues. Switch between week and month views using the calendar tabs.',
  defaultMode = 'WEEK',
}: BookingsCalendarEmbedProps) {
  const [mode, setMode] = useState<CalendarEmbedMode>(defaultMode);
  const configured = isCalendarConfigured() && !IS_SHOWCASE_MODE;

  return (
    <section className="bookings-calendar-section" aria-labelledby="bookings-calendar-heading">
      <h2 id="bookings-calendar-heading">{heading}</h2>
      {IS_SHOWCASE_MODE ? (
        <p className="bookings-calendar-section__intro">
          Showcase mode — sample availability is shown in the booking wizard below. No live calendar is connected.
        </p>
      ) : (
        intro && <p className="bookings-calendar-section__intro">{intro}</p>
      )}

      {configured ? (
        <>
          <div className="bookings-calendar__toolbar" role="group" aria-label="Calendar view">
            <button
              type="button"
              className={`bookings-calendar__view-btn${mode === 'WEEK' ? ' is-active' : ''}`}
              aria-pressed={mode === 'WEEK'}
              onClick={() => setMode('WEEK')}
            >
              Week
            </button>
            <button
              type="button"
              className={`bookings-calendar__view-btn${mode === 'MONTH' ? ' is-active' : ''}`}
              aria-pressed={mode === 'MONTH'}
              onClick={() => setMode('MONTH')}
            >
              Month
            </button>
          </div>

          <div className="bookings-calendar">
            <iframe
              title="Hub facility hire bookings calendar"
              src={getCalendarEmbedUrl(mode)}
              loading="lazy"
            />
          </div>

          <p className="bookings-calendar-section__footnote">
            <a href={getCalendarPublicUrl()} target="_blank" rel="noopener noreferrer">
              Open calendar in Google Calendar
            </a>
          </p>
        </>
      ) : (
        <div className="bookings-calendar-placeholder">
          <p>{CALENDAR_PLACEHOLDER_NOTE}</p>
        </div>
      )}
    </section>
  );
}

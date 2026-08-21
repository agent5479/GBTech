import { Link } from 'react-router-dom';
import { MARSHALL_ADVANCED_URL, PUBLIC_DEMO_BOOK_URL, STAFF_DEMO_URL } from '@shared/showcaseBrand';

export function ShowcaseBanner() {
  return (
    <div className="showcase-banner" role="note">
      GBTech demo · Potential booking system for a venue · Simulated only · Nothing is sent live
    </div>
  );
}

export function ShowcasePitchBar() {
  return (
    <aside className="showcase-pitch-bar" aria-label="GBTech showcase links">
      <div className="showcase-pitch-bar__inner">
        <span className="showcase-pitch-kicker">This demo ≈</span>
        <a className="showcase-pitch-package" href={MARSHALL_ADVANCED_URL}>
          Advanced · $702
        </a>
        <a className="showcase-pitch-compare" href={STAFF_DEMO_URL}>
          Open staff back office →
        </a>
        <Link className="showcase-pitch-compare" to="/rentals/book">
          Public booking wizard
        </Link>
        <a className="showcase-pitch-back" href={MARSHALL_ADVANCED_URL}>
          GBTech packages
        </a>
      </div>
    </aside>
  );
}

export function ShowcaseStaffPitchBar() {
  return (
    <aside className="showcase-pitch-bar" aria-label="GBTech showcase links">
      <div className="showcase-pitch-bar__inner">
        <span className="showcase-pitch-kicker">Staff demo ≈</span>
        <a className="showcase-pitch-package" href={MARSHALL_ADVANCED_URL}>
          Advanced · $702
        </a>
        <a className="showcase-pitch-compare" href={PUBLIC_DEMO_BOOK_URL}>
          Try public booking site →
        </a>
        <a className="showcase-pitch-back" href={MARSHALL_ADVANCED_URL}>
          GBTech packages
        </a>
      </div>
    </aside>
  );
}

/** Step-by-step how to use the booking demo — shown on the book page. */
export function DemoBookingGuide() {
  return (
    <aside className="demo-booking-guide" aria-labelledby="demo-guide-heading">
      <p className="demo-booking-guide__badge">Demo walkthrough</p>
      <h2 id="demo-guide-heading">How to try this potential booking system</h2>
      <ol className="demo-booking-guide__steps">
        <li>
          <strong>Scan the sample calendar</strong> — grey = already booked (fictional), green =
          free. Same data drives the time slots below.
        </li>
        <li>
          <strong>Choose a room and duration</strong> — Creative Workshop, Prep Kitchen, Seminar
          Room, or Portable AV kit.
        </li>
        <li>
          <strong>Pick a free date and time</strong> — busy sample days show fewer (or no) slots on
          purpose.
        </li>
        <li>
          <strong>Enter any details and confirm</strong> — nothing is emailed or charged; the booking
          is stored in this browser for the staff demo.
        </li>
        <li>
          <strong>Optional:</strong>{' '}
          <a href={STAFF_DEMO_URL}>Open the staff back office</a> to import the booking you just
          made.
        </li>
      </ol>
      <p className="demo-booking-guide__note">
        Names, rooms, and address are fictional sample content for GBTech&apos;s Advanced package —
        not a live venue.
      </p>
    </aside>
  );
}

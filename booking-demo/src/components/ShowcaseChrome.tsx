import { Link } from 'react-router-dom';
import { MARSHALL_ADVANCED_URL, PUBLIC_DEMO_BOOK_URL, STAFF_DEMO_URL } from '@shared/showcaseBrand';

export function ShowcaseBanner() {
  return (
    <div className="showcase-banner" role="note">
      Advanced package demo · Bookings are simulated · No real calendar writes
    </div>
  );
}

export function ShowcasePitchBar() {
  return (
    <aside className="showcase-pitch-bar" aria-label="Marshall Solutions showcase links">
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
          Marshall Solutions packages
        </a>
      </div>
    </aside>
  );
}

export function ShowcaseStaffPitchBar() {
  return (
    <aside className="showcase-pitch-bar" aria-label="Marshall Solutions showcase links">
      <div className="showcase-pitch-bar__inner">
        <span className="showcase-pitch-kicker">Staff demo ≈</span>
        <a className="showcase-pitch-package" href={MARSHALL_ADVANCED_URL}>
          Advanced · $702
        </a>
        <a className="showcase-pitch-compare" href={PUBLIC_DEMO_BOOK_URL}>
          Try public booking site →
        </a>
        <a className="showcase-pitch-back" href={MARSHALL_ADVANCED_URL}>
          Marshall Solutions packages
        </a>
      </div>
    </aside>
  );
}

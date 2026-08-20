import { MARSHALL_ADVANCED_URL, PUBLIC_DEMO_BOOK_URL } from '@shared/showcaseBrand';

export function ShowcaseBanner() {
  return (
    <div className="showcase-banner text-center py-2 px-3 small fw-semibold" role="note">
      Advanced package staff demo · Sample data only · No live Firebase connection
    </div>
  );
}

export function ShowcaseStaffPitchBar() {
  return (
    <aside className="showcase-pitch-bar border-bottom bg-light px-3 py-2 small" aria-label="Marshall Solutions showcase links">
      <div className="d-flex flex-wrap align-items-center gap-2">
        <span className="text-muted fw-semibold">Staff demo ≈</span>
        <a className="fw-bold text-primary text-decoration-none" href={MARSHALL_ADVANCED_URL}>
          Advanced · $702
        </a>
        <a className="fw-semibold" href={PUBLIC_DEMO_BOOK_URL}>
          Try public booking site →
        </a>
        <a className="fw-semibold ms-auto" href={MARSHALL_ADVANCED_URL}>
          Marshall Solutions packages
        </a>
      </div>
    </aside>
  );
}

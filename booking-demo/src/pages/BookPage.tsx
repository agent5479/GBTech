import { Link } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout';
import BookingsCalendarEmbed from '../components/BookingsCalendarEmbed';
import { DemoBookingGuide } from '../components/ShowcaseChrome';
import BookForm from './BookForm';
import { IS_SHOWCASE_MODE } from '@shared/showcaseMode';

export default function BookPage() {
  return (
    <SiteLayout
      title="Book a facility | Harbour Hall Demo"
      description="Try a simulated facility booking wizard — sample calendar, rooms, and confirmation for GBTech’s Advanced package."
      path="/rentals/book"
      bodyClass="page-book"
      hero={
        <section className="page-hero page-hero--demo">
          <div className="page-hero-inner">
            <p className="section-label">GBTech · Advanced package demo</p>
            <h1>Potential booking system</h1>
            <p>
              Walk through a self-service hire flow the way a customer would: check sample
              availability, choose a room, pick a time, and confirm. This is a demonstration of what
              GBTech can build for a venue — not a live booking site.
            </p>
            <Link to="/about" className="text-link">
              About this demo
            </Link>
          </div>
        </section>
      }
      mainClassName="book-page-main"
    >
      {IS_SHOWCASE_MODE && <DemoBookingGuide />}

      <BookingsCalendarEmbed
        heading="Sample venue availability"
        intro="Check which times are already booked before choosing your slot below."
        defaultMode="WEEK"
      />

      <section className="form-panel">
        <h2 className="form-panel__heading">Booking wizard</h2>
        <p className="form-panel__intro">
          Complete the steps below. In a live deployment this would write to Google Calendar and
          notify staff; here everything stays in the demo.
        </p>
        <BookForm />
      </section>
    </SiteLayout>
  );
}

import { Link } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout';
import BookingsCalendarEmbed from '../components/BookingsCalendarEmbed';
import BookForm from './BookForm';

export default function BookPage() {
  return (
    <SiteLayout
      title="Book a facility | Community Venue Demo"
      description="Self-service facility booking demo — choose a space, pick a time, and confirm online."
      path="/rentals/book"
      bodyClass="page-book"
      hero={
        <section className="page-hero">
          <div className="page-hero-inner">
            <p className="section-label">Facility hire</p>
            <h1>Book a room or equipment</h1>
            <p>
              Choose your facility, pick a duration and time, and confirm online. Payment is
              arranged with staff — no online payment in v1.
            </p>
            <Link to="/contact" className="text-link">
              Send an enquiry instead
            </Link>
          </div>
        </section>
      }
      mainClassName="book-page-main"
    >
      <BookingsCalendarEmbed
        heading="Venue availability"
        intro="Check which times are already booked before choosing your slot below."
        defaultMode="WEEK"
      />

      <section className="form-panel">
        <BookForm />
      </section>
    </SiteLayout>
  );
}

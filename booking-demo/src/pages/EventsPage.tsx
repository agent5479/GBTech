import { Link } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout';
import ContentHero from '../components/content/ContentHero';
import ImageGallery from '../components/content/ImageGallery';
import ExternalLink from '../components/content/ExternalLink';
import { eventsContent } from '../data/content/eventsContent';

export default function EventsPage() {
  const { seo, hero, calendarNote, facebookLink, gallery } = eventsContent;

  return (
    <SiteLayout
      title={seo.title}
      description={seo.description}
      path="/events"
      bodyClass="page-events"
      hero={<ContentHero title={hero.title} intro={hero.intro} image={hero.image} />}
      mainClassName="page-content"
    >
      <section className="prose-section">
        <h2>Monthly Events Calendar</h2>
        <p>{calendarNote}</p>
        <p>
          <ExternalLink href={facebookLink}>Follow us on Facebook</ExternalLink> for upcoming events.
        </p>
        <Link to="/contact" className="btn-secondary">
          Contact us about hosting an event
        </Link>
      </section>

      {gallery.length > 0 && (
        <section className="prose-section">
          <h2>Recent gatherings</h2>
          <ImageGallery images={gallery} columns={3} />
        </section>
      )}
    </SiteLayout>
  );
}

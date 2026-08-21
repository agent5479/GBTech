import { Link } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout';
import ContentHero from '../components/content/ContentHero';
import ProseSection from '../components/content/ProseSection';
import PricingTable from '../components/content/PricingTable';
import ImageFigure from '../components/content/ImageFigure';
import BookingsCalendarEmbed from '../components/BookingsCalendarEmbed';
import { rentalsContent } from '../data/content/rentalsContent';
import { IS_SHOWCASE_MODE } from '@shared/showcaseMode';

export default function RentalsPage() {
  const { seo, hero, facilities, equipment, bookingCta } = rentalsContent;

  return (
    <SiteLayout
      title={seo.title}
      description={seo.description}
      path="/rentals"
      bodyClass="page-rentals"
      hero={<ContentHero title={hero.title} intro={hero.intro} />}
      mainClassName="page-content"
    >
      <ProseSection heading={facilities.heading}>
        <p>{facilities.intro}</p>
        {facilities.image && (
          <ImageFigure src={facilities.image} alt="Sample workshop hire space" />
        )}
        {facilities.spaces.map((space) => (
          <div key={space.name} className="facility-block">
            <h3>{space.name}</h3>
            <PricingTable rows={space.rates} />
          </div>
        ))}
        <ul>
          {facilities.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </ProseSection>

      <ProseSection heading={equipment.heading}>
        <p>{equipment.intro}</p>
        <div className="equipment-grid">
          {equipment.items.map((item) =>
            item.image ? (
              <ImageFigure key={item.name} src={item.image} alt={item.name} caption={item.name} />
            ) : (
              <p key={item.name}>
                <strong>{item.name}</strong>
              </p>
            )
          )}
        </div>
        <PricingTable rows={equipment.rates} />
        <p>
          To hire equipment, contact{' '}
          <a href={`mailto:${equipment.contact}`}>{equipment.contact}</a>.
        </p>
      </ProseSection>

      <BookingsCalendarEmbed
        heading={bookingCta.heading}
        intro={bookingCta.intro}
        defaultMode="WEEK"
      />

      <section className="cta-band">
        <Link to={bookingCta.to} className="btn-primary">
          {bookingCta.label}
        </Link>
      </section>

      {!IS_SHOWCASE_MODE && (
        <p className="rentals-footnote">
          For other hire enquiries, use the <Link to="/contact">contact form</Link>.
        </p>
      )}
    </SiteLayout>
  );
}

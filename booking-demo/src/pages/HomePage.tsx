import { Link } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout';
import ContentHero from '../components/content/ContentHero';
import TeaserCard from '../components/content/TeaserCard';
import { homeContent } from '../data/content/homeContent';

export default function HomePage() {
  const { seo, hero, aboutTeaser, bookCta } = homeContent;

  return (
    <SiteLayout
      title={seo.title}
      description={seo.description}
      path="/"
      bodyClass="page-home"
      hero={
        <ContentHero title={hero.title} intro={`${hero.subtitle}\n\n${hero.intro}`}>
          <div className="hero-actions">
            <Link to="/rentals/book" className="btn-primary">
              Book a facility
            </Link>
            <Link to="/contact" className="btn-secondary">
              Contact us
            </Link>
          </div>
        </ContentHero>
      }
      mainClassName="page-content"
    >
      <TeaserCard {...aboutTeaser} />
      <section className="home-book-cta">
        <h2>{bookCta.heading}</h2>
        <p>{bookCta.body}</p>
        <Link to={bookCta.link.to} className="btn-primary">
          {bookCta.link.label}
        </Link>
      </section>
    </SiteLayout>
  );
}

import { Link } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout';
import ContentHero from '../components/content/ContentHero';
import ProseSection from '../components/content/ProseSection';
import { educationContent } from '../data/content/educationContent';

export default function EducationPage() {
  const { seo, hero, topics, partnerships, cta } = educationContent;

  return (
    <SiteLayout
      title={seo.title}
      description={seo.description}
      path="/bespoke-education"
      bodyClass="page-education"
      hero={<ContentHero title={hero.title} intro={hero.intro} />}
      mainClassName="page-content"
    >
      <ProseSection heading="Topics can include">
        <ul>
          {topics.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </ProseSection>

      <ProseSection>
        {partnerships.split('\n\n').map((p) => (
          <p key={p.slice(0, 30)}>{p}</p>
        ))}
        <p>
          <Link to="/events" className="text-link">Check our Events page</Link> or Facebook for Sustainability Month workshops.
        </p>
      </ProseSection>

      <section className="cta-band">
        <h2>{cta}</h2>
        <Link to="/contact" className="btn-primary">Get in touch</Link>
      </section>
    </SiteLayout>
  );
}

import { Link } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout';
import ContentHero from '../components/content/ContentHero';
import ProseSection from '../components/content/ProseSection';
import { volunteeringContent } from '../data/content/volunteeringContent';

export default function VolunteeringPage() {
  const { seo, hero, work, dates, benefits, expectations, internationalCta, local, otherWays } =
    volunteeringContent;

  return (
    <SiteLayout
      title={seo.title}
      description={seo.description}
      path="/getting-involved"
      bodyClass="page-volunteering"
      hero={<ContentHero title={hero.title} intro={hero.intro} />}
      mainClassName="page-content"
    >
      <ProseSection heading={work.heading}>
        <p>{work.body}</p>
        <ul>
          {work.seasons.map((s) => (
            <li key={s.season}>
              <strong>{s.season}:</strong> {s.tasks}
            </li>
          ))}
        </ul>
      </ProseSection>

      <ProseSection heading="Dates Available">
        <ul>
          {dates.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <Link to="/contact" className="btn-primary">Volunteer Application Form</Link>
      </ProseSection>

      <ProseSection heading={benefits.heading}>
        {benefits.sections.map((s) => (
          <div key={s.title}>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </div>
        ))}
      </ProseSection>

      <ProseSection heading={expectations.heading}>
        <ul>
          {expectations.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </ProseSection>

      <ProseSection>
        <p>
          {internationalCta.text}{' '}
          <a href={`mailto:${internationalCta.email}`}>{internationalCta.email}</a>
        </p>
      </ProseSection>

      <ProseSection heading={local.heading}>
        <p>{local.body}</p>
        <p>
          Events Co-ordinator:{' '}
          <a href={`mailto:${local.eventsEmail}`}>{local.eventsEmail}</a>
        </p>
        <div className="hero-actions">
          {local.links.map((l) => (
            <Link key={l.to} to={l.to} className="btn-secondary">
              {l.label}
            </Link>
          ))}
        </div>
      </ProseSection>

      <section className="cta-band">
        <h2>{otherWays}</h2>
        <Link to="/contact" className="btn-primary">Contact us</Link>
      </section>
    </SiteLayout>
  );
}

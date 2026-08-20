import { Link } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout';
import ContentHero from '../components/content/ContentHero';
import ProseSection from '../components/content/ProseSection';
import AnchorSection from '../components/content/AnchorSection';
import ImageGallery from '../components/content/ImageGallery';
import { aboutContent } from '../data/content/aboutContent';

export default function AboutPage() {
  const { seo, hero, scope, vision, need, history, images, teamLink } = aboutContent;

  return (
    <SiteLayout
      title={seo.title}
      description={seo.description}
      path="/about"
      bodyClass="page-about"
      hero={<ContentHero title={hero.title} intro={hero.intro} />}
      mainClassName="page-content"
    >
      {images.length > 0 && <ImageGallery images={images.slice(0, 3)} columns={3} />}

      <ProseSection>
        <ul className="scope-list">
          {scope.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong> — {item.body}
              {'link' in item && item.link && (
                <>
                  {' '}
                  <Link to={item.link.to}>{item.link.label}</Link>
                </>
              )}
            </li>
          ))}
        </ul>
      </ProseSection>

      <ProseSection heading={vision.heading}>
        <p>{vision.body}</p>
        <Link to={teamLink.to} className="text-link">
          {teamLink.label} →
        </Link>
      </ProseSection>

      {need.items.length > 0 && (
        <ProseSection heading={need.heading}>
          <p>{need.intro}</p>
          <ul>
            {need.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          {need.closing && <p>{need.closing}</p>}
        </ProseSection>
      )}

      {history.periods.length > 0 && (
        <AnchorSection id={history.id} heading={history.heading}>
          {history.periods.map((period) => (
            <div key={period.era} className="history-period">
              <h3>{period.era}</h3>
              <p className="history-period__years">{period.years}</p>
              <ul>
                {period.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </AnchorSection>
      )}
    </SiteLayout>
  );
}

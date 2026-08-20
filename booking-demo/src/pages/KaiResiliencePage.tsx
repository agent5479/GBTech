import SiteLayout from '../components/SiteLayout';
import ContentHero from '../components/content/ContentHero';
import ProseSection from '../components/content/ProseSection';
import ImageGallery from '../components/content/ImageGallery';
import SponsorLogos from '../components/content/SponsorLogos';
import ExternalLink from '../components/content/ExternalLink';
import { kaiResilienceContent } from '../data/content/kaiResilienceContent';

export default function KaiResiliencePage() {
  const { seo, hero, definition, updates, reports, youtubeNote, images, sponsors } =
    kaiResilienceContent;

  return (
    <SiteLayout
      title={seo.title}
      description={seo.description}
      path="/kai-resilience"
      bodyClass="page-kai-resilience"
      hero={<ContentHero title={hero.title} intro={hero.intro} />}
      mainClassName="page-content"
    >
      <ProseSection heading={definition.heading}>
        <ul className="definition-list">
          {definition.points.map((p) => (
            <li key={p.title}>
              <strong>{p.title}</strong> — {p.body}
            </li>
          ))}
        </ul>
      </ProseSection>

      <ProseSection>
        {updates.split('\n\n').map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </ProseSection>

      <ProseSection heading="Reports">
        <ul>
          {reports.map((r) => (
            <li key={r.url}>
              <ExternalLink href={r.url}>{r.label}</ExternalLink>
            </li>
          ))}
        </ul>
        <p>{youtubeNote}</p>
      </ProseSection>

      {images.length > 0 && <ImageGallery images={images.slice(0, 3)} columns={3} />}

      <SponsorLogos heading="Proudly supported by" sponsors={sponsors} />
    </SiteLayout>
  );
}

import SiteLayout from '../components/SiteLayout';
import ContentHero from '../components/content/ContentHero';
import ProseSection from '../components/content/ProseSection';
import ImageGallery from '../components/content/ImageGallery';
import SponsorLogos from '../components/content/SponsorLogos';
import ExternalLink from '../components/content/ExternalLink';
import { compostContent } from '../data/content/compostContent';

export default function CompostPage() {
  const { seo, hero, dropOff, dos, donts, steps, images, sponsors, resources } = compostContent;

  return (
    <SiteLayout
      title={seo.title}
      description={seo.description}
      path="/compost"
      bodyClass="page-compost"
      hero={<ContentHero title={hero.title} intro={hero.tagline} />}
      mainClassName="page-content"
    >
      <ProseSection heading={dropOff.heading}>
        <p>{dropOff.body}</p>
        <h3>Are you a local?</h3>
        <ul>
          {dropOff.localInfo.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <p>
          Pop into the SLC or contact{' '}
          <a href={`mailto:${dropOff.contact}`}>{dropOff.contact}</a> to organise pick up.
        </p>
      </ProseSection>

      {images.length > 0 && <ImageGallery images={images.slice(0, 6)} columns={3} />}

      <ProseSection heading="Your compost journey">
        <ol className="steps-list">
          {steps.map((step, i) => (
            <li key={step}>
              <strong>{i + 1}.</strong> {step}
            </li>
          ))}
        </ol>
      </ProseSection>

      <div className="dos-donts">
        <ProseSection heading="Do include">
          <ul>{dos.map((d) => <li key={d}>{d}</li>)}</ul>
        </ProseSection>
        <ProseSection heading="Do not include">
          <ul>{donts.map((d) => <li key={d}>{d}</li>)}</ul>
        </ProseSection>
      </div>

      <SponsorLogos heading="Proudly Supported by" sponsors={sponsors} />

      <ProseSection heading="Other compost initiatives">
        <ul>
          {resources.map((r) => (
            <li key={r.url}>
              <ExternalLink href={r.url}>{r.label}</ExternalLink>
            </li>
          ))}
        </ul>
      </ProseSection>
    </SiteLayout>
  );
}

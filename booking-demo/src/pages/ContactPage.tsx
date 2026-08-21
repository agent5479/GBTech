import SiteLayout from '../components/SiteLayout';
import ContentHero from '../components/content/ContentHero';
import ProseSection from '../components/content/ProseSection';
import ImageFigure from '../components/content/ImageFigure';
import ExternalLink from '../components/content/ExternalLink';
import ContactForm from './ContactForm';
import { contactContent } from '../data/content/contactContent';
import { SOCIAL_LINKS } from '../data/siteConfig';
import { IS_SHOWCASE_MODE } from '@shared/showcaseMode';

export default function ContactPage() {
  const { seo, hero, emails, socialNote, region, visit } = contactContent;

  return (
    <SiteLayout
      title={seo.title}
      description={seo.description}
      path="/contact"
      bodyClass="page-contact"
      hero={<ContentHero title={hero.title} intro={hero.intro} />}
      mainClassName="page-content contact-page-main"
    >
      <ProseSection heading="Email us">
        <ul className="email-list">
          {emails.map((e) => (
            <li key={e.address}>
              <a href={`mailto:${e.address}`}>{e.address}</a>
            </li>
          ))}
        </ul>
        <p>
          {socialNote}{' '}
          <ExternalLink href={SOCIAL_LINKS.facebook}>Facebook</ExternalLink>
          {' or '}
          <ExternalLink href={SOCIAL_LINKS.instagram}>Instagram</ExternalLink>.
        </p>
      </ProseSection>

      <ProseSection heading={region.heading}>
        {region.body.split('\n\n').map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </ProseSection>

      <ProseSection heading={visit.heading}>
        <address className="visit-address">
          {visit.address.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </address>
        {visit.image && <ImageFigure src={visit.image} alt="Picking food from the garden" />}
      </ProseSection>

      <section className="form-panel">
        <h2>Send an enquiry</h2>
        <p>
          {IS_SHOWCASE_MODE
            ? 'Questions about the demo or hire flow — showcase only, messages are not delivered.'
            : 'Allotment interest, equipment questions, or anything not covered by the online booking form.'}
        </p>
        <ContactForm />
      </section>
    </SiteLayout>
  );
}

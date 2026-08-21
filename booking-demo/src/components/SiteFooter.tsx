import { Link } from 'react-router-dom';
import { IS_SHOWCASE_MODE } from '@shared/showcaseMode';
import {
  CONTACT_EMAILS,
  NAV_GROUPS,
  SITE_ADDRESS_LINES,
  SITE_NAME,
  SOCIAL_LINKS,
} from '../data/siteConfig';

function SocialLinks() {
  return (
    <div className="social-links social-links--footer">
      <a
        href={SOCIAL_LINKS.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
      >
        Facebook
      </a>
      <a
        href={SOCIAL_LINKS.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
      >
        Instagram
      </a>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <p className="site-footer__name">{SITE_NAME}</p>
          <address className="site-footer__address">
            {SITE_ADDRESS_LINES.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <div className="site-footer__emails">
            <a href={`mailto:${CONTACT_EMAILS.general}`}>{CONTACT_EMAILS.general}</a>
            {!IS_SHOWCASE_MODE && (
              <>
                <a href={`mailto:${CONTACT_EMAILS.events}`}>{CONTACT_EMAILS.events}</a>
                <a href={`mailto:${CONTACT_EMAILS.manager}`}>{CONTACT_EMAILS.manager}</a>
                <a href={`mailto:${CONTACT_EMAILS.trust}`}>{CONTACT_EMAILS.trust}</a>
              </>
            )}
          </div>
          <SocialLinks />
        </div>

        <div className="site-footer__nav">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="site-footer__nav-group">
              <p className="site-footer__nav-heading">{group.label}</p>
              <ul>
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="site-footer__newsletter">
          <p className="site-footer__newsletter-heading">Newsletter</p>
          <p>
            Sign up to stay in touch with special events and announcements at {SITE_NAME}.
          </p>
          <p className="site-footer__newsletter-note">
            Newsletter signup is a placeholder in this demo.
          </p>
        </div>
      </div>

      <p className="site-footer__legal">
        <a href="https://example.com/privacy" target="_blank" rel="noopener noreferrer">
          Privacy Statement
        </a>
      </p>
    </footer>
  );
}

import { Link } from 'react-router-dom';
import { assetUrl } from '../../shared/assetUrl';

interface TeaserCardProps {
  heading: string;
  body: string;
  image?: string;
  link?: { label: string; to: string };
  links?: { label: string; to: string }[];
}

export default function TeaserCard({ heading, body, image, link, links }: TeaserCardProps) {
  return (
    <article className="teaser-card">
      {image && (
        <div className="teaser-card__media">
          <img src={assetUrl(image)} alt="" loading="lazy" />
        </div>
      )}
      <div className="teaser-card__body">
        <h2>{heading}</h2>
        {body.split('\n\n').map((para) => (
          <p key={para.slice(0, 40)}>{para}</p>
        ))}
        {link && (
          <Link to={link.to} className="text-link">
            {link.label} →
          </Link>
        )}
        {links && (
          <ul className="teaser-card__links">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

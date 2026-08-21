import { assetUrl } from '../../shared/assetUrl';

interface Sponsor {
  name: string;
  image?: string;
}

interface SponsorLogosProps {
  sponsors: Sponsor[];
  heading?: string;
}

export default function SponsorLogos({ sponsors, heading }: SponsorLogosProps) {
  const visible = sponsors.filter((s) => s.image);
  if (!visible.length) return null;
  return (
    <section className="sponsor-row">
      {heading && <h2>{heading}</h2>}
      <div className="sponsor-row__grid">
        {visible.map((sponsor) => (
          <figure key={sponsor.name} className="sponsor-row__item">
            <img src={assetUrl(sponsor.image!)} alt={sponsor.name} loading="lazy" />
          </figure>
        ))}
      </div>
    </section>
  );
}

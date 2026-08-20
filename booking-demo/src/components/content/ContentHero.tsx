interface ContentHeroProps {
  label?: string;
  title: string;
  intro?: string;
  image?: string;
  children?: React.ReactNode;
}

export default function ContentHero({ label, title, intro, image, children }: ContentHeroProps) {
  return (
    <section className={`page-hero${image ? ' page-hero--image' : ''}`}>
      <div className="page-hero-inner">
        {label && <p className="section-label">{label}</p>}
        <h1>{title}</h1>
        {intro &&
          intro.split('\n\n').map((para) => (
            <p key={para.slice(0, 40)} className="page-hero__intro">
              {para}
            </p>
          ))}
        {children}
      </div>
      {image && (
        <div className="page-hero__media">
          <img src={image} alt="" loading="eager" />
        </div>
      )}
    </section>
  );
}

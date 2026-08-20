interface TeamMemberCardProps {
  name: string;
  role: string;
  bio: string;
  image?: string;
}

export default function TeamMemberCard({ name, role, bio, image }: TeamMemberCardProps) {
  return (
    <article className="team-card">
      {image && (
        <div className="team-card__photo">
          <img src={image} alt={name} loading="lazy" />
        </div>
      )}
      <div className="team-card__body">
        <h3>{name}</h3>
        <p className="team-card__role">{role}</p>
        {bio && <p>{bio}</p>}
      </div>
    </article>
  );
}

import { Link } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout';
import ContentHero from '../components/content/ContentHero';
import ProseSection from '../components/content/ProseSection';
import TeamMemberCard from '../components/content/TeamMemberCard';
import AnchorSection from '../components/content/AnchorSection';
import { teamContent } from '../data/content/teamContent';

export default function TeamPage() {
  const { seo, hero, staff, trust } = teamContent;

  return (
    <SiteLayout
      title={seo.title}
      description={seo.description}
      path="/our-team"
      bodyClass="page-team"
      hero={<ContentHero title={hero.title} intro={hero.intro} />}
      mainClassName="page-content"
    >
      <ProseSection heading="SLC Staff">
        <div className="team-grid">
          {staff.map((m) => (
            <TeamMemberCard key={m.name} {...m} />
          ))}
        </div>
      </ProseSection>

      <AnchorSection id={trust.id} heading={trust.heading}>
        <div className="team-grid">
          {trust.members.map((m) => (
            <TeamMemberCard key={m.name} {...m} />
          ))}
        </div>
      </AnchorSection>

      <p>
        <Link to="/contact" className="btn-primary">Contact Us</Link>
      </p>
    </SiteLayout>
  );
}

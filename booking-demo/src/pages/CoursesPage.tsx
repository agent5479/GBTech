import { Link } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout';
import ContentHero from '../components/content/ContentHero';
import ProseSection from '../components/content/ProseSection';
import TestimonialBlock from '../components/content/TestimonialBlock';
import TeamMemberCard from '../components/content/TeamMemberCard';
import ImageFigure from '../components/content/ImageFigure';
import { coursesContent } from '../data/content/coursesContent';

export default function CoursesPage() {
  const { seo, hero, overview, modules, tutors } = coursesContent;

  return (
    <SiteLayout
      title={seo.title}
      description={seo.description}
      path="/courses"
      bodyClass="page-courses"
      hero={<ContentHero title={hero.title} intro={hero.intro} />}
      mainClassName="page-content"
    >
      <ProseSection heading={overview.title}>
        <p>{overview.body}</p>
        <p className="status-note">{overview.closedNote}</p>
        {overview.quotes.map((q) => (
          <TestimonialBlock key={q.author} {...q} />
        ))}
      </ProseSection>

      {modules.map((mod) => (
        <section key={mod.id} className="module-card" id={mod.id}>
          <h2>{mod.title}</h2>
          {'tagline' in mod && mod.tagline && <p className="module-card__tagline">{mod.tagline}</p>}
          {mod.image && <ImageFigure src={mod.image} alt={mod.title} />}
          {mod.body && <p>{mod.body}</p>}
          {'tutor' in mod && mod.tutor && <p><strong>Tutor:</strong> {mod.tutor}</p>}
          {'tutors' in mod && mod.tutors && (
            <p><strong>Tutors:</strong> {mod.tutors.join(', ')}</p>
          )}
          {'locations' in mod && mod.locations && (
            <ul>
              {mod.locations.map((loc) => (
                <li key={loc}>{loc}</li>
              ))}
            </ul>
          )}
          {'submodules' in mod && mod.submodules && (
            <ul>
              {mod.submodules.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
          {'dayCourses' in mod &&
            mod.dayCourses?.map((dc) => (
              <div key={dc.title} className="day-course">
                <h3>{dc.title}</h3>
                <p><em>with {dc.tutor}</em></p>
                <p>{dc.description}</p>
              </div>
            ))}
          {'duration' in mod && mod.duration && <p><strong>{mod.duration}</strong></p>}
          <p className="status-note">{mod.status}</p>
        </section>
      ))}

      <ProseSection heading="Course Tutors">
        <div className="team-grid">
          {tutors.map((t) => (
            <TeamMemberCard key={t.name} {...t} />
          ))}
        </div>
      </ProseSection>

      <p>
        <Link to="/contact" className="btn-primary">Contact Us</Link>{' '}
        <Link to="/our-team" className="btn-secondary">SLC Team</Link>
      </p>
    </SiteLayout>
  );
}

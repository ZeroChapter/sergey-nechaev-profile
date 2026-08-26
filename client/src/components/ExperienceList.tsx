import type { Experience } from '../api/profile';
import ExperienceItem from './ExperienceItem';

type ExperienceListProps = {
  experiences: Experience[];
};

export default function ExperienceList({ experiences }: ExperienceListProps) {
  if (experiences.length === 0) {
    return null;
  }

  return (
    <section className="experience">
      <div className="container">
        <h2 className="section-title">Опыт</h2>
        <ul className="experience-list">
          {experiences.map((experience) => (
            <ExperienceItem key={experience.id} experience={experience} />
          ))}
        </ul>
      </div>
    </section>
  );
}

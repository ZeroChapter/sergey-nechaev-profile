import type { Experience } from '../api/profile';
import formatPeriod from '../utils/formatPeriod';

type ExperienceItemProps = {
  experience: Experience;
};

export default function ExperienceItem({ experience }: ExperienceItemProps) {
  const {
    role,
    company,
    startDate,
    endDate,
    description,
  } = experience;

  return (
    <li className="experience-card">
      <p className="experience-card__date">{formatPeriod(startDate, endDate)}</p>
      <div>
        <h3 className="experience-card__company">{company}</h3>
        <p className="experience-card__role">{role}</p>
        {description ? <p className="experience-card__description">{description}</p> : null}
      </div>
    </li>
  );
}

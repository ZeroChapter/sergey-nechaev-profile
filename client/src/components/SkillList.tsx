import type { Skill } from '../api/profile';

type SkillListProps = {
  skills: Skill[];
  title?: string;
};

export default function SkillList({ skills, title }: SkillListProps) {
  if (skills.length === 0) {
    return null;
  }

  const list = (
    <ul className="tag-list">
      {skills.map((skill) => (
        <li key={skill.id} className="tag">{skill.name}</li>
      ))}
    </ul>
  );

  if (!title) {
    return list;
  }

  return (
    <div className="skills-panel">
      <h2 className="skills-panel__title">{title}</h2>
      {list}
    </div>
  );
}

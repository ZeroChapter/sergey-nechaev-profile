import type { Project } from '../api/profile';
import ProjectItem from './ProjectItem';

type ProjectListProps = {
  projects: Project[];
};

export default function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="container">
        <h2 className="section-title">Проекты</h2>
        <ul className="projects-grid">
          {projects.map((project) => (
            <ProjectItem key={project.id} project={project} />
          ))}
        </ul>
      </div>
    </section>
  );
}

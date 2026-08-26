import type { Project } from '../api/profile';
import { GitHubIcon } from './icons';
import SkillList from './SkillList';

type ProjectItemProps = {
  project: Project;
};

function linkLabel(url: string): string {
  try {
    const parsed = new URL(url);
    const last = parsed.pathname.split('/').filter(Boolean).pop();

    return last ?? parsed.hostname;
  } catch {
    return url;
  }
}

export default function ProjectItem({ project }: ProjectItemProps) {
  const {
    name,
    url,
    summary,
    repoUrl,
    skills,
  } = project;

  return (
    <li className="project-card">
      <div className="project-card__bar" aria-hidden="true" />
      <div className="project-card__content">
        <h3 className="project-card__title">
          {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer">
              {name}
            </a>
          ) : (
            name
          )}
        </h3>
        {summary ? <p className="project-card__description">{summary}</p> : null}
        {skills.length > 0 ? (
          <div className="project-card__stack">
            <SkillList skills={skills} />
          </div>
        ) : null}
        {url ? (
          <a className="btn btn--primary btn--small" href={url} target="_blank" rel="noopener noreferrer">
            перейти на сайт
          </a>
        ) : null}
        {repoUrl.length > 0 ? (
          <div className="project-card__repos">
            {repoUrl.map((repo) => (
              <a
                key={repo}
                className="btn btn--small"
                href={repo}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon />
                {linkLabel(repo)}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </li>
  );
}

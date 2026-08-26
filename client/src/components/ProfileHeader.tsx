import type { Profile } from '../api/profile';
import { GitHubIcon, MailIcon, PhoneIcon } from './icons';
import SkillList from './SkillList';

type ProfileHeaderProps = {
  profile: Profile;
};

function splitDisplayName(name: string): { given: string; surname: string } {
  const parts = name.trim().split(/\s+/);

  if (parts.length < 2) {
    return { given: name, surname: '' };
  }

  return {
    surname: parts[0],
    given: parts.slice(1).join(' '),
  };
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const {
    avatarUrl,
    name,
    email,
    phone,
    github,
    blog,
    skills,
  } = profile;
  const { given, surname } = splitDisplayName(name);

  return (
    <header className="hero">
      <div className="container">
        {avatarUrl ? (
          <img
            className="avatar"
            src={avatarUrl}
            alt={name}
            width={88}
            height={88}
          />
        ) : null}
        <p className="hero__role">Цифровая визитка</p>
        <h1 className="hero__title">
          {given ? (
            <>
              {given}
              {' '}
              <span className="highlight">{surname}</span>
            </>
          ) : (
            <span className="highlight">{name}</span>
          )}
        </h1>
        <ul className="contact-list">
          <li>
            <a href={`mailto:${email}`}>
              <MailIcon className="contact-list__icon" />
              {email}
            </a>
          </li>
          <li>
            <a href={`tel:${phone}`}>
              <PhoneIcon className="contact-list__icon" />
              {phone}
            </a>
          </li>
        </ul>
        <div className="hero__actions">
          {blog ? (
            <a className="btn" href={blog} target="_blank" rel="noopener noreferrer">
              Сайт
            </a>
          ) : null}
          {github ? (
            <a className="btn btn--primary" href={github} target="_blank" rel="noopener noreferrer">
              <GitHubIcon />
              GitHub
            </a>
          ) : null}
        </div>
        <SkillList skills={skills} title="Навыки" />
      </div>
    </header>
  );
}

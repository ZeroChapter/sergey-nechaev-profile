import ExperienceList from './components/ExperienceList';
import ProfileHeader from './components/ProfileHeader';
import ProjectList from './components/ProjectList';
import StatusMessage from './components/StatusMessage';
import useProfile from './hooks/useProfile';

export default function App() {
  const { profile, error, loading } = useProfile();

  if (loading) {
    return (
      <StatusMessage>
        Загрузка…
      </StatusMessage>
    );
  }

  if (error) {
    return (
      <StatusMessage isError>
        {error}
      </StatusMessage>
    );
  }

  if (!profile) {
    return (
      <StatusMessage>
        Профиль ещё не заполнен.
      </StatusMessage>
    );
  }

  return (
    <main className="page">
      <ProfileHeader profile={profile} />
      <ExperienceList experiences={profile.experiences} />
      <ProjectList projects={profile.projects} />
    </main>
  );
}

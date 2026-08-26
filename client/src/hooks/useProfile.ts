import { useEffect, useState } from 'react';

import { fetchProfile, type Profile } from '../api/profile';

export default function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetchProfile(controller.signal)
      .then((data) => {
        setProfile(data);
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === 'AbortError') {
          return;
        }

        setError(
          reason instanceof Error ? reason.message : 'Не удалось загрузить профиль',
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  return { profile, error, loading };
}

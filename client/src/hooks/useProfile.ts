import { useEffect, useState } from 'react';

import { fetchProfile, type Profile } from '../api/profile';

export default function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      let lastError: unknown;
      for (let attempt = 0; attempt < 8; attempt += 1) {
        try {
          const data = await fetchProfile(controller.signal);
          setProfile(data);
          return;
        } catch (reason: unknown) {
          lastError = reason;
          if (reason instanceof DOMException && reason.name === 'AbortError') {
            return;
          }
          await new Promise((resolve) => {
            setTimeout(resolve, 2000);
          });
        }
      }

      setError(
        lastError instanceof Error
          ? lastError.message
          : 'Не удалось загрузить профиль',
      );
    };

    load()
      .catch(() => undefined)
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

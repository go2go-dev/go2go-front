import { useEffect, useState } from 'react';

export function useAuthReady() {
  const [ready, setReady] = useState(() => {
    return !!localStorage.getItem('accessToken');
  });

  useEffect(() => {
    const onReady = () => setReady(true);
    const onLogout = () => setReady(false);

    window.addEventListener('tokensReceived', onReady);
    window.addEventListener('authLogout', onLogout);

    return () => {
      window.removeEventListener('tokensReceived', onReady);
      window.removeEventListener('authLogout', onLogout);
    };
  }, []);

  return ready;
}

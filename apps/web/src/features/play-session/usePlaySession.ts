import { useCallback, useState } from 'react';
import { ApiError } from '@/shared/api';
import * as playApi from './api';

export function usePlaySession(accId: string | undefined, onSuccess: () => void) {
  const [acting, setActing] = useState(false);
  const [error, setError] = useState('');

  const run = useCallback(
    async (action: () => Promise<unknown>): Promise<boolean> => {
      if (!accId) return false;
      setActing(true);
      setError('');
      try {
        await action();
        onSuccess();
        return true;
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Thao tác thất bại';
        setError(message);
        return false;
      } finally {
        setActing(false);
      }
    },
    [accId, onSuccess]
  );

  const startPlay = useCallback(async () => {
    if (!accId) return false;
    return run(() => playApi.startPlay(accId));
  }, [accId, run]);

  const endPlay = useCallback(async () => {
    if (!accId) return false;
    return run(() => playApi.endPlay(accId));
  }, [accId, run]);

  const confirmLogout = useCallback(async () => {
    if (!accId) return false;
    return run(() => playApi.confirmLogout(accId));
  }, [accId, run]);

  const forceReset = useCallback(async () => {
    if (!accId) return false;
    return run(() => playApi.forceReset(accId));
  }, [accId, run]);

  return {
    acting,
    error,
    setError,
    startPlay,
    endPlay,
    confirmLogout,
    forceReset,
  };
}

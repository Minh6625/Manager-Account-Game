import { useCallback, useEffect, useState } from 'react';
import type { Invitation } from '@manager-acc/shared';
import * as inviteApi from './api';

export function useMyPendingInvitations(enabled: boolean) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError('');
    try {
      const data = await inviteApi.listMyPendingInvitations();
      setInvitations(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Không tải được lời mời';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const accept = useCallback(async (accId: string, invId: string) => {
    setActingId(invId);
    setError('');
    try {
      await inviteApi.acceptInvitation(accId, invId);
      setInvitations((prev) => prev.filter((i) => i.id !== invId));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Chấp nhận lời mời thất bại';
      setError(message);
      throw err;
    } finally {
      setActingId(null);
    }
  }, []);

  const reject = useCallback(async (accId: string, invId: string) => {
    setActingId(invId);
    setError('');
    try {
      await inviteApi.rejectInvitation(accId, invId);
      setInvitations((prev) => prev.filter((i) => i.id !== invId));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Từ chối lời mời thất bại';
      setError(message);
      throw err;
    } finally {
      setActingId(null);
    }
  }, []);

  return {
    invitations,
    loading,
    actingId,
    error,
    reload,
    accept,
    reject,
  };
}

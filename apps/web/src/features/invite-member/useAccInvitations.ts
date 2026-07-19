import { useCallback, useEffect, useState } from 'react';
import type { Invitation } from '@manager-acc/shared';
import * as inviteApi from './api';

export function useAccInvitations(accId: string | undefined, enabled: boolean) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    if (!accId || !enabled) return;
    setLoading(true);
    setError('');
    try {
      const data = await inviteApi.listAccInvitations(accId);
      setInvitations(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Không tải được lời mời';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [accId, enabled]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const sendInvite = useCallback(
    async (email: string) => {
      if (!accId) return;
      setSending(true);
      setError('');
      try {
        const created = await inviteApi.createInvitation(accId, email);
        setInvitations((prev) => [created, ...prev]);
        return created;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Gửi lời mời thất bại';
        setError(message);
        throw err;
      } finally {
        setSending(false);
      }
    },
    [accId]
  );

  const pending = invitations.filter((i) => i.status === 'PENDING');

  return {
    invitations,
    pending,
    loading,
    sending,
    error,
    setError,
    reload,
    sendInvite,
  };
}

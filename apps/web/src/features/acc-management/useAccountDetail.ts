import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HISTORY_DEFAULT_DAYS } from '@/shared/constants';
import type { AccountDetail, HistoryEntry } from '@/shared/types';
import * as accApi from './api';

export function useAccountDetail(
  accId: string | undefined,
  currentUserId: string | undefined
) {
  const navigate = useNavigate();
  const [account, setAccount] = useState<AccountDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [fullHistory, setFullHistory] = useState<HistoryEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const loadAccountDetail = useCallback(async () => {
    if (!accId) return;

    setLoading(true);
    try {
      const data = await accApi.getAccountById(accId);
      setAccount(data);
    } catch (error) {
      console.error('Failed to load account detail:', error);
      alert('Không thể tải thông tin tài khoản');
      navigate('/accounts');
    } finally {
      setLoading(false);
    }
  }, [accId, navigate]);

  useEffect(() => {
    if (currentUserId && accId) {
      loadAccountDetail();
    }
  }, [currentUserId, accId, loadAccountDetail]);

  const loadFullHistory = useCallback(async () => {
    if (!accId) return;

    setLoadingHistory(true);
    try {
      // Domain endpoint: last N days (shared business constant)
      const data = await accApi.getAccountHistory(accId, {
        days: HISTORY_DEFAULT_DAYS,
      });
      setFullHistory(data);
      setShowFullHistory(true);
    } catch (error) {
      console.error('Failed to load history:', error);
      alert('Không thể tải lịch sử');
    } finally {
      setLoadingHistory(false);
    }
  }, [accId]);

  const isOwner = Boolean(
    account && currentUserId && account.ownerUserId === currentUserId
  );

  const currentPlayer =
    account?.memberships.find((m) => m.memberStatus === 'PLAYING') ?? null;

  const pendingLogoutMember =
    account?.memberships.find((m) => m.memberStatus === 'PENDING_LOGOUT') ??
    null;

  const myMembership =
    account?.memberships.find((m) => m.user.id === currentUserId) ?? null;

  const historyToShow = showFullHistory
    ? fullHistory
    : account?.statusHistory ?? [];

  return {
    account,
    loading,
    isOwner,
    currentPlayer,
    pendingLogoutMember,
    myMembership,
    historyToShow,
    showFullHistory,
    loadingHistory,
    loadFullHistory,
    reload: loadAccountDetail,
  };
}

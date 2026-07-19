import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Account, AccountFilterTab } from '@/shared/types';
import * as accApi from './api';

export function useAccounts(userId: string | undefined) {
  const [allAccounts, setAllAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AccountFilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [creating, setCreating] = useState(false);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await accApi.getAccounts();
      setAllAccounts(data);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      loadAccounts();
    }
  }, [userId, loadAccounts]);

  const accounts = useMemo(() => {
    let filtered = allAccounts;

    if (activeTab === 'owned') {
      filtered = filtered.filter((acc) => acc.ownerUserId === userId);
    } else if (activeTab === 'joined') {
      filtered = filtered.filter((acc) => acc.ownerUserId !== userId);
    }

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter((acc) =>
        acc.name.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [allAccounts, activeTab, searchQuery, userId]);

  const createAccount = useCallback(
    async (name: string, note: string) => {
      setCreating(true);
      try {
        const body: { name: string; note?: string } = { name };
        if (note.trim()) {
          body.note = note.trim();
        }

        const created = await accApi.createAccount(body);
        setAllAccounts((prev) => [created, ...prev]);
        return created;
      } finally {
        setCreating(false);
      }
    },
    []
  );

  return {
    accounts,
    allAccounts,
    loading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    creating,
    createAccount,
    reload: loadAccounts,
  };
}

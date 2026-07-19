import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@/shared/types';
import * as authApi from './api';

interface UseAuthOptions {
  /** When true (default), redirect to /login if session invalid */
  requireAuth?: boolean;
}

export function useAuth(options: UseAuthOptions = {}) {
  const { requireAuth = true } = options;
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const me = await authApi.getMe();
        if (!cancelled) {
          setUser(me);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          if (requireAuth) {
            navigate('/login');
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [navigate, requireAuth]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      navigate('/login');
    }
  }, [navigate]);

  return { user, loading, logout, setUser };
}

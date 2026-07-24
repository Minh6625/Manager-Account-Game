import {
  MAX_MEMBERS_PER_ACC,
  SESSION_DAYS,
  INVITE_EXPIRY_HOURS,
  HISTORY_DEFAULT_DAYS,
  HISTORY_RECENT_LIMIT,
  MAX_PLAYERS_PER_ACC,
} from '@manager-acc/shared';

/** Base URL for API (web-only — depends on Vite env). */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '' : 'http://localhost:3000');

export const API_V1 = `${API_BASE_URL}/api/v1`;

/** Re-export business constants from monorepo shared package */
export {
  MAX_MEMBERS_PER_ACC,
  SESSION_DAYS,
  INVITE_EXPIRY_HOURS,
  HISTORY_DEFAULT_DAYS,
  HISTORY_RECENT_LIMIT,
  MAX_PLAYERS_PER_ACC,
};

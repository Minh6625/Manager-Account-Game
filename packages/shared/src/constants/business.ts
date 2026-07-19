/**
 * Business rules locked in architecture (02_Mini_Plan_Architecture.md).
 * Single source of truth for web + api.
 */

/** Max members per account (including owner) */
export const MAX_MEMBERS_PER_ACC = 5;

/** JWT / session lifetime in days */
export const SESSION_DAYS = 7;

/** Invitation expiry in hours */
export const INVITE_EXPIRY_HOURS = 24;

/** Default history window when loading "full" history (days) */
export const HISTORY_DEFAULT_DAYS = 3;

/** Recent history rows composed into account detail */
export const HISTORY_RECENT_LIMIT = 5;

/** One concurrent player per account */
export const MAX_PLAYERS_PER_ACC = 1;

/**
 * After end-session (PENDING_LOGOUT), send email reminder if user
 * has not confirmed logout within this many minutes.
 */
export const LOGOUT_REMINDER_MINUTES = 5;

import type { User } from './user';

/** Matches Prisma AccStatus */
export type AccStatus = 'AVAILABLE' | 'IN_USE' | 'PENDING_LOGOUT';

/** Matches Prisma MemberRole */
export type MemberRole = 'OWNER' | 'MEMBER';

/** Matches Prisma MemberStatus */
export type MemberStatus = 'IDLE' | 'PLAYING' | 'PENDING_LOGOUT' | 'KICKED';

/** FE account list tabs */
export type AccountFilterTab = 'all' | 'owned' | 'joined';

export interface Account {
  id: string;
  name: string;
  status: AccStatus;
  note: string | null;
  ownerUserId: string;
  owner: User;
  memberships: Array<{
    user: User;
    memberStatus: string;
  }>;
  _count: {
    memberships: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  role: MemberRole;
  memberStatus: MemberStatus;
  joinedAt: string;
  /** Set when left or kicked — null while active */
  leftAt?: string | null;
  user: User;
}

export interface HistoryEntry {
  id: string;
  actionType: string;
  fromStatus: string | null;
  toStatus: string | null;
  note: string | null;
  createdAt: string;
  user: User | null;
}

export interface AccountDetail {
  id: string;
  name: string;
  status: AccStatus;
  note: string | null;
  ownerUserId: string;
  owner: User;
  memberships: Member[];
  statusHistory: HistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

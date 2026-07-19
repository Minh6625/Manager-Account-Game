import type { User } from './user';

/** Matches Prisma InvitationStatus */
export type InvitationStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED';

export interface Invitation {
  id: string;
  accId: string;
  invitedUserId: string | null;
  invitedEmail: string | null;
  invitedByUserId: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
  respondedAt: string | null;
  invitedBy?: User;
  invitedUser?: User | null;
  acc?: {
    id: string;
    name: string;
    status: string;
  };
}

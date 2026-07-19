import { apiRequest } from '@/shared/api';
import type { AccStatus, MemberStatus } from '@/shared/types';

export interface PlaySessionAccSnapshot {
  id: string;
  name: string;
  status: AccStatus;
  ownerUserId: string;
  note: string | null;
  updatedAt: string;
}

export interface PlaySessionMembershipSnapshot {
  id: string;
  role: string;
  memberStatus: MemberStatus;
  user: {
    id: string;
    email: string;
    displayName: string | null;
  };
}

export interface PlaySessionResult {
  acc: PlaySessionAccSnapshot;
  membership: PlaySessionMembershipSnapshot;
}

export interface ForceResetResult {
  acc: PlaySessionAccSnapshot;
  reset: boolean;
  message: string;
}

export async function startPlay(accId: string): Promise<PlaySessionResult> {
  return apiRequest<PlaySessionResult>(`/api/v1/accs/${accId}/status/play`, {
    method: 'POST',
  });
}

export async function endPlay(accId: string): Promise<PlaySessionResult> {
  return apiRequest<PlaySessionResult>(`/api/v1/accs/${accId}/status/end`, {
    method: 'POST',
  });
}

export async function confirmLogout(
  accId: string
): Promise<PlaySessionResult> {
  return apiRequest<PlaySessionResult>(
    `/api/v1/accs/${accId}/status/confirm-logout`,
    { method: 'POST' }
  );
}

export async function forceReset(accId: string): Promise<ForceResetResult> {
  return apiRequest<ForceResetResult>(
    `/api/v1/accs/${accId}/status/force-reset`,
    { method: 'POST' }
  );
}

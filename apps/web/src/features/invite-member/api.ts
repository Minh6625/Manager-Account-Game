import { apiRequest } from '@/shared/api';
import type { Invitation } from '@manager-acc/shared';

export async function createInvitation(
  accId: string,
  email: string
): Promise<Invitation> {
  return apiRequest<Invitation>(`/api/v1/accs/${accId}/invitations`, {
    method: 'POST',
    body: { email },
  });
}

export async function listAccInvitations(accId: string): Promise<Invitation[]> {
  return apiRequest<Invitation[]>(`/api/v1/accs/${accId}/invitations`);
}

export async function listMyPendingInvitations(): Promise<Invitation[]> {
  return apiRequest<Invitation[]>('/api/v1/invitations/pending');
}

export async function acceptInvitation(
  accId: string,
  invId: string
): Promise<unknown> {
  return apiRequest(`/api/v1/accs/${accId}/invitations/${invId}/accept`, {
    method: 'POST',
  });
}

export async function rejectInvitation(
  accId: string,
  invId: string
): Promise<Invitation> {
  return apiRequest<Invitation>(
    `/api/v1/accs/${accId}/invitations/${invId}/reject`,
    { method: 'POST' }
  );
}

import { apiRequest } from '@/shared/api';
import type {
  Account,
  AccountDetail,
  CreateAccountPayload,
  HistoryEntry,
  Member,
  UpdateAccountPayload,
} from '@/shared/types';

export async function getAccounts(): Promise<Account[]> {
  return apiRequest<Account[]>('/api/v1/accs');
}

export async function createAccount(
  payload: CreateAccountPayload
): Promise<Account> {
  return apiRequest<Account>('/api/v1/accs', {
    method: 'POST',
    body: payload,
  });
}

export async function getAccountById(id: string): Promise<AccountDetail> {
  return apiRequest<AccountDetail>(`/api/v1/accs/${id}`);
}

export async function updateAccount(
  id: string,
  payload: UpdateAccountPayload
): Promise<AccountDetail> {
  return apiRequest<AccountDetail>(`/api/v1/accs/${id}`, {
    method: 'PATCH',
    body: payload,
  });
}

export async function deleteAccount(
  id: string
): Promise<{ id: string; name: string }> {
  return apiRequest<{ id: string; name: string }>(`/api/v1/accs/${id}`, {
    method: 'DELETE',
  });
}

export async function kickMember(
  accId: string,
  memberId: string
): Promise<{ membership: Member; acc: { id: string; name: string; status: string } }> {
  return apiRequest(`/api/v1/accs/${accId}/members/${memberId}`, {
    method: 'DELETE',
  });
}

/**
 * GET /api/v1/history?acc_id=&days=&limit=
 * History is a separate backend domain module.
 */
export async function getAccountHistory(
  accId: string,
  options?: { days?: number; limit?: number }
): Promise<HistoryEntry[]> {
  const params = new URLSearchParams({ acc_id: accId });
  if (options?.days !== undefined) {
    params.set('days', String(options.days));
  }
  if (options?.limit !== undefined) {
    params.set('limit', String(options.limit));
  }
  return apiRequest<HistoryEntry[]>(`/api/v1/history?${params.toString()}`);
}

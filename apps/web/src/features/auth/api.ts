import { apiRequest } from '@/shared/api';
import type { User } from '@/shared/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthUserResult {
  user: User;
}

export async function login(payload: LoginPayload): Promise<AuthUserResult> {
  return apiRequest<AuthUserResult>('/api/v1/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export async function signup(payload: SignupPayload): Promise<User> {
  return apiRequest<User>('/api/v1/auth/signup', {
    method: 'POST',
    body: payload,
  });
}

export async function logout(): Promise<void> {
  await apiRequest<unknown>('/api/v1/auth/logout', {
    method: 'POST',
  });
}

export async function getMe(): Promise<User> {
  return apiRequest<User>('/api/v1/auth/me');
}

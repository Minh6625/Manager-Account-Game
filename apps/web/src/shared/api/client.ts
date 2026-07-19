import { API_BASE_URL } from '@/shared/constants';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

/**
 * Shared fetch wrapper: JSON, credentials (httpOnly cookie), error parsing.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    credentials: 'include',
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data: { success?: boolean; data?: T; message?: string; error?: { message?: string } } | null =
    null;

  try {
    data = await response.json();
  } catch {
    // Non-JSON response
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error?.message ||
      `Request failed (${response.status})`;
    throw new ApiError(message, response.status);
  }

  // Prefer unwrapped `data` field from API envelope when present
  if (data && typeof data === 'object' && 'data' in data && data.data !== undefined) {
    return data.data as T;
  }

  return data as T;
}

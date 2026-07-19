/** POST /api/v1/accs body (wire format) */
export interface CreateAccountDto {
  name: string;
  note?: string;
}

/** Alias used by some call sites / older naming */
export type CreateAccountPayload = CreateAccountDto;

/** PATCH /api/v1/accs/:id body (wire format) */
export interface UpdateAccountDto {
  name?: string;
  /** Pass null to clear note */
  note?: string | null;
}

export type UpdateAccountPayload = UpdateAccountDto;

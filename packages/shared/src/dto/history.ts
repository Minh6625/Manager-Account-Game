/** Query shape for GET /api/v1/history */
export interface ListHistoryQueryDto {
  acc_id: string;
  limit?: number;
  days?: number;
}

/** Internal write shape for status_history rows */
export interface CreateHistoryEntryDto {
  accId: string;
  userId?: string | null;
  actionType: string;
  fromStatus?: string | null;
  toStatus?: string | null;
  note?: string | null;
}

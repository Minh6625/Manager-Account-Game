import { HISTORY_RECENT_LIMIT } from '@manager-acc/shared';
import { NotFoundError } from '@/shared/errors/AppError';
import { HistoryRepository } from './history.repository';
import type { CreateHistoryEntryDto } from './history.schemas';

export interface ListHistoryParams {
  accId: string;
  limit?: number;
  days?: number;
}

export class HistoryService {
  private historyRepository: HistoryRepository;

  constructor() {
    this.historyRepository = new HistoryRepository();
  }

  /**
   * List status history for an acc the user can access.
   * Plan: GET /api/v1/history?acc_id=
   */
  async listForUser(userId: string, params: ListHistoryParams) {
    const hasAccess = await this.historyRepository.userHasAccess(
      params.accId,
      userId
    );

    if (!hasAccess) {
      throw new NotFoundError('Account not found or access denied');
    }

    return this.historyRepository.findByAcc({
      accId: params.accId,
      limit: params.limit,
      days: params.days,
    });
  }

  /** Last N entries (no date window) — used when composing acc detail */
  async getRecent(
    userId: string,
    accId: string,
    limit: number = HISTORY_RECENT_LIMIT
  ) {
    return this.listForUser(userId, { accId, limit });
  }

  /** Write path for future domain events (play, kick, create, …) */
  async append(data: CreateHistoryEntryDto) {
    return this.historyRepository.create(data);
  }
}

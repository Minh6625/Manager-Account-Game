import { HISTORY_ACTION, HISTORY_RECENT_LIMIT } from '@manager-acc/shared';
import {
  ForbiddenError,
  NotFoundError,
} from '@/shared/errors/AppError';
import { HistoryService } from '@/modules/history/history.service';
import { AccRepository } from './acc.repository';
import { CreateAccDto, UpdateAccDto } from './acc.schemas';

export class AccService {
  private accRepository: AccRepository;
  private historyService: HistoryService;

  constructor() {
    this.accRepository = new AccRepository();
    this.historyService = new HistoryService();
  }

  async getAccounts(userId: string, filter?: string, search?: string) {
    // Get all accounts user can view
    const allAccounts = await this.accRepository.getAccountsByUserId(userId);

    // Apply filter
    let filteredAccounts = allAccounts;

    if (filter === 'owned') {
      // "Acc của tôi" - accounts where user is owner
      filteredAccounts = allAccounts.filter(
        (acc) => acc.ownerUserId === userId
      );
    } else if (filter === 'joined') {
      // "Acc đã tham gia" - accounts where user is member but not owner
      filteredAccounts = allAccounts.filter(
        (acc) => acc.ownerUserId !== userId
      );
    }
    // filter === 'all' or undefined - show all accounts

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredAccounts = filteredAccounts.filter((acc) =>
        acc.name.toLowerCase().includes(searchLower)
      );
    }

    return filteredAccounts;
  }

  async createAccount(userId: string, data: CreateAccDto) {
    const account = await this.accRepository.createAccount(userId, data);

    await this.historyService.append({
      accId: account.id,
      userId,
      actionType: HISTORY_ACTION.CREATE,
      note: `Tạo acc "${account.name}"`,
    });

    return account;
  }

  async getAccountById(accId: string, userId: string) {
    const account = await this.accRepository.getAccountById(accId, userId);

    if (!account) {
      throw new NotFoundError('Account not found or access denied');
    }

    // History domain owns StatusHistory queries; compose recent rows for detail UX
    const statusHistory = await this.historyService.getRecent(
      userId,
      accId,
      HISTORY_RECENT_LIMIT
    );

    return {
      ...account,
      statusHistory,
    };
  }

  private async requireOwner(accId: string, userId: string) {
    const acc = await this.accRepository.findById(accId);
    if (!acc) {
      throw new NotFoundError('Không tìm thấy tài khoản');
    }
    if (acc.ownerUserId !== userId) {
      throw new ForbiddenError(
        'Chỉ chủ phòng mới có thể thực hiện thao tác này'
      );
    }
    return acc;
  }

  async updateAccount(userId: string, accId: string, data: UpdateAccDto) {
    const existing = await this.requireOwner(accId, userId);

    const updated = await this.accRepository.updateAccount(accId, data);

    const changes: string[] = [];
    if (data.name !== undefined && data.name !== existing.name) {
      changes.push(`tên: "${existing.name}" → "${data.name}"`);
    }
    if (data.note !== undefined && data.note !== existing.note) {
      changes.push('ghi chú');
    }

    await this.historyService.append({
      accId,
      userId,
      actionType: HISTORY_ACTION.UPDATE,
      note:
        changes.length > 0
          ? `Cập nhật acc (${changes.join(', ')})`
          : 'Cập nhật thông tin acc',
    });

    return updated;
  }

  async deleteAccount(userId: string, accId: string) {
    const acc = await this.requireOwner(accId, userId);

    // History is cascade-deleted with the acc; log is best-effort for local ops only.
    // Callers cannot view DELETE history after hard delete.
    await this.historyService.append({
      accId,
      userId,
      actionType: HISTORY_ACTION.DELETE,
      note: `Xóa acc "${acc.name}"`,
    });

    await this.accRepository.deleteAccount(accId);

    return { id: accId, name: acc.name };
  }
}

import { AccRepository } from './acc.repository';
import { CreateAccDto } from './acc.schemas';

export class AccService {
  private accRepository: AccRepository;

  constructor() {
    this.accRepository = new AccRepository();
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
    return await this.accRepository.createAccount(userId, data);
  }
}

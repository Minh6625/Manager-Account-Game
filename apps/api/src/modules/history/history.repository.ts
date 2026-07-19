import { prisma } from '@/infra/db/prisma';
import type { CreateHistoryEntryDto } from './history.schemas';

export interface FindHistoryOptions {
  accId: string;
  limit?: number;
  /** If set, only rows with createdAt >= now - days */
  days?: number;
}

const userSelect = {
  id: true,
  email: true,
  displayName: true,
} as const;

export class HistoryRepository {
  /** True if user is owner or active member of the acc */
  async userHasAccess(accId: string, userId: string): Promise<boolean> {
    const account = await prisma.acc.findFirst({
      where: {
        id: accId,
        OR: [
          { ownerUserId: userId },
          {
            memberships: {
              some: {
                userId,
                leftAt: null,
              },
            },
          },
        ],
      },
      select: { id: true },
    });

    return account !== null;
  }

  async findByAcc(options: FindHistoryOptions) {
    const { accId, limit, days } = options;

    const createdAtFilter =
      days !== undefined
        ? (() => {
            const since = new Date();
            since.setDate(since.getDate() - days);
            return { gte: since };
          })()
        : undefined;

    return prisma.statusHistory.findMany({
      where: {
        accId,
        ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
      },
      include: {
        user: { select: userSelect },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /** Append an audit row (used by play session / membership / CRUD later) */
  async create(data: CreateHistoryEntryDto) {
    return prisma.statusHistory.create({
      data: {
        accId: data.accId,
        userId: data.userId ?? null,
        actionType: data.actionType,
        fromStatus: data.fromStatus ?? null,
        toStatus: data.toStatus ?? null,
        note: data.note ?? null,
      },
      include: {
        user: { select: userSelect },
      },
    });
  }
}

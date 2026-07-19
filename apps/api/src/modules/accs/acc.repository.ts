import { prisma } from '@/infra/db/prisma';
import { CreateAccDto, UpdateAccDto } from './acc.schemas';
import { BadRequestError } from '@/shared/errors/AppError';

const ownerSelect = {
  id: true,
  email: true,
  displayName: true,
} as const;

const userSelect = {
  id: true,
  email: true,
  displayName: true,
} as const;

export class AccRepository {
  async getAccountsByUserId(userId: string) {
    // Get all accounts where user is owner or member
    const accounts = await prisma.acc.findMany({
      where: {
        OR: [
          { ownerUserId: userId },
          {
            memberships: {
              some: {
                userId: userId,
                leftAt: null, // Only active memberships
              },
            },
          },
        ],
      },
      include: {
        owner: {
          select: ownerSelect,
        },
        memberships: {
          where: {
            leftAt: null,
            // Holder = đang chơi hoặc chờ đăng xuất acc (vẫn chưa trả acc)
            memberStatus: { in: ['PLAYING', 'PENDING_LOGOUT'] },
          },
          include: {
            user: {
              select: userSelect,
            },
          },
          take: 1,
        },
        _count: {
          select: {
            memberships: {
              where: {
                leftAt: null,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return accounts;
  }

  async findById(accId: string) {
    return prisma.acc.findUnique({
      where: { id: accId },
      include: {
        owner: { select: ownerSelect },
      },
    });
  }

  async createAccount(userId: string, data: CreateAccDto) {
    // Check if account name already exists
    const existingAcc = await prisma.acc.findFirst({
      where: {
        name: data.name,
      },
    });

    if (existingAcc) {
      throw new BadRequestError('Tên tài khoản đã tồn tại');
    }

    // Create account and automatically add owner as member with OWNER role
    const account = await prisma.acc.create({
      data: {
        name: data.name,
        note: data.note,
        owner: {
          connect: { id: userId },
        },
        memberships: {
          create: {
            userId: userId,
            role: 'OWNER',
            memberStatus: 'IDLE',
          },
        },
      },
      include: {
        owner: {
          select: ownerSelect,
        },
        memberships: {
          where: {
            leftAt: null,
          },
          include: {
            user: {
              select: userSelect,
            },
          },
        },
        _count: {
          select: {
            memberships: {
              where: {
                leftAt: null,
              },
            },
          },
        },
      },
    });

    return account;
  }

  async updateAccount(accId: string, data: UpdateAccDto) {
    if (data.name !== undefined) {
      const existingAcc = await prisma.acc.findFirst({
        where: {
          name: data.name,
          NOT: { id: accId },
        },
      });

      if (existingAcc) {
        throw new BadRequestError('Tên tài khoản đã tồn tại');
      }
    }

    const updateData: { name?: string; note?: string | null } = {};
    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.note !== undefined) {
      updateData.note = data.note;
    }

    return prisma.acc.update({
      where: { id: accId },
      data: updateData,
      include: {
        owner: {
          select: ownerSelect,
        },
        memberships: {
          where: {
            leftAt: null,
          },
          include: {
            user: {
              select: userSelect,
            },
          },
          orderBy: {
            joinedAt: 'asc',
          },
        },
      },
    });
  }

  async deleteAccount(accId: string) {
    // Cascade removes memberships, invitations, status_history
    return prisma.acc.delete({
      where: { id: accId },
    });
  }

  async getAccountById(accId: string, userId: string) {
    // Account detail with members only (active).
    // Kicked members are not listed — audit is in status_history (MEMBER_KICK).
    const account = await prisma.acc.findFirst({
      where: {
        id: accId,
        OR: [
          { ownerUserId: userId },
          {
            memberships: {
              some: {
                userId: userId,
                leftAt: null,
              },
            },
          },
        ],
      },
      include: {
        owner: {
          select: ownerSelect,
        },
        memberships: {
          where: {
            leftAt: null,
            memberStatus: { not: 'KICKED' },
          },
          include: {
            user: {
              select: userSelect,
            },
          },
          orderBy: {
            joinedAt: 'asc',
          },
        },
      },
    });

    return account;
  }
}

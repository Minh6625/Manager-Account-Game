import { prisma } from '@/infra/db/prisma';
import { CreateAccDto } from './acc.schemas';
import { BadRequestError } from '@/shared/errors/AppError';

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
          select: {
            id: true,
            email: true,
            displayName: true,
          },
        },
        memberships: {
          where: {
            leftAt: null,
            memberStatus: 'PLAYING',
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                displayName: true,
              },
            },
          },
          take: 1, // Only get current player if any
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
          select: {
            id: true,
            email: true,
            displayName: true,
          },
        },
        memberships: {
          where: {
            leftAt: null,
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                displayName: true,
              },
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
}

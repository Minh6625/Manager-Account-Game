import type { AccStatus, MemberStatus } from '@prisma/client';
import { prisma } from '@/infra/db/prisma';

const userSelect = {
  id: true,
  email: true,
  displayName: true,
} as const;

export class PlaySessionRepository {
  async findAccById(accId: string) {
    return prisma.acc.findUnique({
      where: { id: accId },
      select: {
        id: true,
        name: true,
        status: true,
        ownerUserId: true,
        note: true,
        updatedAt: true,
      },
    });
  }

  /** Active membership: not left, not kicked */
  async findActiveMembership(accId: string, userId: string) {
    return prisma.membership.findFirst({
      where: {
        accId,
        userId,
        leftAt: null,
        memberStatus: { not: 'KICKED' },
      },
      include: {
        user: { select: userSelect },
      },
    });
  }

  /** Member currently holding acc (PLAYING or PENDING_LOGOUT) */
  async findCurrentHolder(accId: string) {
    return prisma.membership.findFirst({
      where: {
        accId,
        leftAt: null,
        memberStatus: { in: ['PLAYING', 'PENDING_LOGOUT'] },
      },
      include: {
        user: { select: userSelect },
      },
    });
  }

  async findUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });
  }

  /**
   * Atomic play start inside a transaction:
   * claim ACC only if still AVAILABLE, set member PLAYING, write history.
   */
  async startPlayInTransaction(params: {
    accId: string;
    userId: string;
    membershipId: string;
    fromAccStatus: AccStatus;
    fromMemberStatus: MemberStatus;
    note: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const claimed = await tx.acc.updateMany({
        where: {
          id: params.accId,
          status: 'AVAILABLE',
        },
        data: {
          status: 'IN_USE',
        },
      });

      if (claimed.count === 0) {
        return { ok: false as const, reason: 'ACC_NOT_AVAILABLE' as const };
      }

      // Re-check no other holder (race / data inconsistency)
      const otherHolder = await tx.membership.findFirst({
        where: {
          accId: params.accId,
          leftAt: null,
          memberStatus: { in: ['PLAYING', 'PENDING_LOGOUT'] },
          id: { not: params.membershipId },
        },
      });

      if (otherHolder) {
        // Roll back claim by throwing — transaction aborts
        throw new Error('HOLDER_CONFLICT');
      }

      const membership = await tx.membership.update({
        where: { id: params.membershipId },
        data: {
          memberStatus: 'PLAYING',
          pendingLogoutAt: null,
          logoutReminderSentAt: null,
        },
        include: { user: { select: userSelect } },
      });

      const acc = await tx.acc.findUniqueOrThrow({
        where: { id: params.accId },
        select: {
          id: true,
          name: true,
          status: true,
          ownerUserId: true,
          note: true,
          updatedAt: true,
        },
      });

      await tx.statusHistory.create({
        data: {
          accId: params.accId,
          userId: params.userId,
          actionType: 'START_PLAY',
          fromStatus: params.fromAccStatus,
          toStatus: 'IN_USE',
          note: params.note,
        },
      });

      return {
        ok: true as const,
        acc,
        membership,
        fromMemberStatus: params.fromMemberStatus,
      };
    });
  }

  async endPlayInTransaction(params: {
    accId: string;
    userId: string;
    membershipId: string;
    fromAccStatus: AccStatus;
    note: string;
    pendingLogoutAt: Date;
  }) {
    return prisma.$transaction(async (tx) => {
      const claimed = await tx.acc.updateMany({
        where: {
          id: params.accId,
          status: 'IN_USE',
        },
        data: {
          status: 'PENDING_LOGOUT',
        },
      });

      if (claimed.count === 0) {
        return { ok: false as const, reason: 'ACC_NOT_IN_USE' as const };
      }

      const membership = await tx.membership.update({
        where: { id: params.membershipId },
        data: {
          memberStatus: 'PENDING_LOGOUT',
          pendingLogoutAt: params.pendingLogoutAt,
          logoutReminderSentAt: null,
        },
        include: { user: { select: userSelect } },
      });

      const acc = await tx.acc.findUniqueOrThrow({
        where: { id: params.accId },
        select: {
          id: true,
          name: true,
          status: true,
          ownerUserId: true,
          note: true,
          updatedAt: true,
        },
      });

      await tx.statusHistory.create({
        data: {
          accId: params.accId,
          userId: params.userId,
          actionType: 'END_PLAY',
          fromStatus: params.fromAccStatus,
          toStatus: 'PENDING_LOGOUT',
          note: params.note,
        },
      });

      return { ok: true as const, acc, membership };
    });
  }

  async confirmLogoutInTransaction(params: {
    accId: string;
    userId: string;
    membershipId: string;
    fromAccStatus: AccStatus;
    note: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const claimed = await tx.acc.updateMany({
        where: {
          id: params.accId,
          status: 'PENDING_LOGOUT',
        },
        data: {
          status: 'AVAILABLE',
        },
      });

      if (claimed.count === 0) {
        return { ok: false as const, reason: 'ACC_NOT_PENDING' as const };
      }

      const membership = await tx.membership.update({
        where: { id: params.membershipId },
        data: {
          memberStatus: 'IDLE',
          pendingLogoutAt: null,
          logoutReminderSentAt: null,
        },
        include: { user: { select: userSelect } },
      });

      const acc = await tx.acc.findUniqueOrThrow({
        where: { id: params.accId },
        select: {
          id: true,
          name: true,
          status: true,
          ownerUserId: true,
          note: true,
          updatedAt: true,
        },
      });

      await tx.statusHistory.create({
        data: {
          accId: params.accId,
          userId: params.userId,
          actionType: 'CONFIRM_LOGOUT',
          fromStatus: params.fromAccStatus,
          toStatus: 'AVAILABLE',
          note: params.note,
        },
      });

      return { ok: true as const, acc, membership };
    });
  }

  async forceResetInTransaction(params: {
    accId: string;
    ownerUserId: string;
    fromAccStatus: AccStatus;
    holderIds: string[];
    note: string;
  }) {
    return prisma.$transaction(async (tx) => {
      if (params.holderIds.length > 0) {
        await tx.membership.updateMany({
          where: {
            id: { in: params.holderIds },
          },
          data: {
            memberStatus: 'IDLE',
            pendingLogoutAt: null,
            logoutReminderSentAt: null,
          },
        });
      }

      const acc = await tx.acc.update({
        where: { id: params.accId },
        data: { status: 'AVAILABLE' },
        select: {
          id: true,
          name: true,
          status: true,
          ownerUserId: true,
          note: true,
          updatedAt: true,
        },
      });

      await tx.statusHistory.create({
        data: {
          accId: params.accId,
          userId: params.ownerUserId,
          actionType: 'FORCE_RESET',
          fromStatus: params.fromAccStatus,
          toStatus: 'AVAILABLE',
          note: params.note,
        },
      });

      return acc;
    });
  }

  /** All holders (PLAYING / PENDING_LOGOUT) for force-reset */
  async findHolders(accId: string) {
    return prisma.membership.findMany({
      where: {
        accId,
        leftAt: null,
        memberStatus: { in: ['PLAYING', 'PENDING_LOGOUT'] },
      },
      include: {
        user: { select: userSelect },
      },
    });
  }

  /**
   * Members still PENDING_LOGOUT past the reminder deadline, not yet emailed.
   */
  async findDueLogoutReminders(deadline: Date) {
    return prisma.membership.findMany({
      where: {
        memberStatus: 'PENDING_LOGOUT',
        leftAt: null,
        pendingLogoutAt: { lte: deadline, not: null },
        logoutReminderSentAt: null,
      },
      include: {
        user: { select: userSelect },
        acc: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
      take: 50,
    });
  }

  /** Claim reminder send (prevent double-send under concurrent ticks). */
  async markLogoutReminderSent(membershipId: string, sentAt: Date) {
    const result = await prisma.membership.updateMany({
      where: {
        id: membershipId,
        memberStatus: 'PENDING_LOGOUT',
        logoutReminderSentAt: null,
      },
      data: {
        logoutReminderSentAt: sentAt,
      },
    });
    return result.count > 0;
  }

  async appendHistory(data: {
    accId: string;
    userId: string | null;
    actionType: string;
    fromStatus?: string | null;
    toStatus?: string | null;
    note?: string | null;
  }) {
    return prisma.statusHistory.create({
      data: {
        accId: data.accId,
        userId: data.userId,
        actionType: data.actionType,
        fromStatus: data.fromStatus ?? null,
        toStatus: data.toStatus ?? null,
        note: data.note ?? null,
      },
    });
  }
}

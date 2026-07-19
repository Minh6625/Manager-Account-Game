import { prisma } from '@/infra/db/prisma';

const userSelect = {
  id: true,
  email: true,
  displayName: true,
} as const;

export class MembershipRepository {
  async findAccById(accId: string) {
    return prisma.acc.findUnique({
      where: { id: accId },
      select: {
        id: true,
        name: true,
        status: true,
        ownerUserId: true,
      },
    });
  }

  async findUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });
  }

  async findMembershipById(membershipId: string) {
    return prisma.membership.findUnique({
      where: { id: membershipId },
      include: {
        user: { select: userSelect },
      },
    });
  }

  /**
   * Soft-kick: set KICKED + leftAt.
   * If member was holding the acc (PLAYING / PENDING_LOGOUT), free the acc.
   * History.userId = actor (người thực hiện kick) per Task 7 AC.
   */
  async kickMemberInTransaction(params: {
    membershipId: string;
    accId: string;
    wasHolding: boolean;
    fromAccStatus: string;
    fromMemberStatus: string;
    actorUserId: string;
    note: string;
  }) {
    const now = new Date();

    return prisma.$transaction(async (tx) => {
      const membership = await tx.membership.update({
        where: { id: params.membershipId },
        data: {
          memberStatus: 'KICKED',
          leftAt: now,
          pendingLogoutAt: null,
          logoutReminderSentAt: null,
        },
        include: {
          user: { select: userSelect },
        },
      });

      let acc = await tx.acc.findUniqueOrThrow({
        where: { id: params.accId },
      });

      if (params.wasHolding && acc.status !== 'AVAILABLE') {
        acc = await tx.acc.update({
          where: { id: params.accId },
          data: { status: 'AVAILABLE' },
        });
      }

      // Actor = người thực hiện; note chứa tên người bị kick
      await tx.statusHistory.create({
        data: {
          accId: params.accId,
          userId: params.actorUserId,
          actionType: 'MEMBER_KICK',
          fromStatus: params.fromMemberStatus,
          toStatus: 'KICKED',
          note: params.note,
        },
      });

      if (params.wasHolding && params.fromAccStatus !== 'AVAILABLE') {
        await tx.statusHistory.create({
          data: {
            accId: params.accId,
            userId: params.actorUserId,
            actionType: 'STATUS_CHANGE',
            fromStatus: params.fromAccStatus,
            toStatus: 'AVAILABLE',
            note: 'Acc được trả về rảnh do thành viên đang giữ bị kick',
          },
        });
      }

      return { membership, acc };
    });
  }
}

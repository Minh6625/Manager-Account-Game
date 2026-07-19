import { prisma } from '@/infra/db/prisma';
import type { InvitationStatus } from '@prisma/client';

const userSelect = {
  id: true,
  email: true,
  displayName: true,
} as const;

const invitationInclude = {
  invitedBy: { select: userSelect },
  invitedUser: { select: userSelect },
  acc: {
    select: {
      id: true,
      name: true,
      status: true,
    },
  },
} as const;

export class InvitationRepository {
  async findAccById(accId: string) {
    return prisma.acc.findUnique({
      where: { id: accId },
      select: {
        id: true,
        name: true,
        ownerUserId: true,
      },
    });
  }

  async findUserByEmail(email: string) {
    return prisma.user.findFirst({
      where: {
        email: { equals: email, mode: 'insensitive' },
      },
      select: userSelect,
    });
  }

  async findUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });
  }

  /** Active members: not left, not kicked */
  async countActiveMembers(accId: string): Promise<number> {
    return prisma.membership.count({
      where: {
        accId,
        leftAt: null,
        memberStatus: { not: 'KICKED' },
      },
    });
  }

  async findActiveMembership(accId: string, userId: string) {
    return prisma.membership.findFirst({
      where: {
        accId,
        userId,
        leftAt: null,
        memberStatus: { not: 'KICKED' },
      },
    });
  }

  async findPendingForEmailOrUser(
    accId: string,
    email: string,
    userId?: string | null
  ) {
    return prisma.invitation.findFirst({
      where: {
        accId,
        status: 'PENDING',
        OR: [
          { invitedEmail: { equals: email, mode: 'insensitive' } },
          ...(userId ? [{ invitedUserId: userId }] : []),
        ],
      },
    });
  }

  async create(data: {
    accId: string;
    invitedByUserId: string;
    invitedEmail: string;
    invitedUserId: string | null;
    expiresAt: Date;
  }) {
    return prisma.invitation.create({
      data: {
        accId: data.accId,
        invitedByUserId: data.invitedByUserId,
        invitedEmail: data.invitedEmail.toLowerCase(),
        invitedUserId: data.invitedUserId,
        status: 'PENDING',
        expiresAt: data.expiresAt,
      },
      include: invitationInclude,
    });
  }

  async findById(invId: string) {
    return prisma.invitation.findUnique({
      where: { id: invId },
      include: invitationInclude,
    });
  }

  async listByAccId(accId: string) {
    return prisma.invitation.findMany({
      where: { accId },
      include: invitationInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async listPendingForUser(userId: string, email: string) {
    return prisma.invitation.findMany({
      where: {
        status: 'PENDING',
        OR: [
          { invitedUserId: userId },
          { invitedEmail: { equals: email, mode: 'insensitive' } },
        ],
      },
      include: invitationInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(
    invId: string,
    status: InvitationStatus,
    options?: { respondedAt?: Date; invitedUserId?: string }
  ) {
    return prisma.invitation.update({
      where: { id: invId },
      data: {
        status,
        ...(options?.respondedAt !== undefined
          ? { respondedAt: options.respondedAt }
          : {}),
        ...(options?.invitedUserId
          ? { invitedUserId: options.invitedUserId }
          : {}),
      },
      include: invitationInclude,
    });
  }

  /** Mark overdue PENDING invites as EXPIRED (lazy expiry). */
  async expireOverdue(accId?: string) {
    const now = new Date();
    return prisma.invitation.updateMany({
      where: {
        status: 'PENDING',
        expiresAt: { lt: now },
        ...(accId ? { accId } : {}),
      },
      data: {
        status: 'EXPIRED',
        respondedAt: now,
      },
    });
  }

  /** Create membership or re-activate a previous (left/kicked) row */
  async createMembership(accId: string, userId: string) {
    const existing = await prisma.membership.findUnique({
      where: {
        accId_userId: { accId, userId },
      },
    });

    if (existing) {
      return prisma.membership.update({
        where: { id: existing.id },
        data: {
          leftAt: null,
          role: 'MEMBER',
          memberStatus: 'IDLE',
          joinedAt: new Date(),
        },
        include: {
          user: { select: userSelect },
        },
      });
    }

    return prisma.membership.create({
      data: {
        accId,
        userId,
        role: 'MEMBER',
        memberStatus: 'IDLE',
      },
      include: {
        user: { select: userSelect },
      },
    });
  }
}

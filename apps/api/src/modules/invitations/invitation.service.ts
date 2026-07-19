import {
  INVITE_EXPIRY_HOURS,
  MAX_MEMBERS_PER_ACC,
} from '@manager-acc/shared';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '@/shared/errors/AppError';
import { emailService } from '@/infra/email';
import { HistoryService } from '@/modules/history/history.service';
import { InvitationRepository } from './invitation.repository';

export class InvitationService {
  private invitationRepository: InvitationRepository;
  private historyService: HistoryService;

  constructor() {
    this.invitationRepository = new InvitationRepository();
    this.historyService = new HistoryService();
  }

  private async ensureOwner(accId: string, userId: string) {
    const acc = await this.invitationRepository.findAccById(accId);
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

  private async ensureAccAccess(accId: string, userId: string) {
    const acc = await this.invitationRepository.findAccById(accId);
    if (!acc) {
      throw new NotFoundError('Không tìm thấy tài khoản');
    }
    if (acc.ownerUserId === userId) {
      return acc;
    }
    const membership = await this.invitationRepository.findActiveMembership(
      accId,
      userId
    );
    if (!membership) {
      throw new ForbiddenError('Bạn không có quyền xem lời mời của acc này');
    }
    return acc;
  }

  private isInvitee(
    invitation: {
      invitedUserId: string | null;
      invitedEmail: string | null;
    },
    user: { id: string; email: string }
  ): boolean {
    if (invitation.invitedUserId && invitation.invitedUserId === user.id) {
      return true;
    }
    if (
      invitation.invitedEmail &&
      invitation.invitedEmail.toLowerCase() === user.email.toLowerCase()
    ) {
      return true;
    }
    return false;
  }

  private isPastExpiry(expiresAt: Date): boolean {
    return expiresAt.getTime() < Date.now();
  }

  /** Create invitation — owner only. Pending does not count toward member limit. */
  async createInvitation(ownerUserId: string, accId: string, email: string) {
    await this.invitationRepository.expireOverdue(accId);
    const acc = await this.ensureOwner(accId, ownerUserId);

    const normalizedEmail = email.trim().toLowerCase();
    const owner = await this.invitationRepository.findUserById(ownerUserId);
    if (owner && owner.email.toLowerCase() === normalizedEmail) {
      throw new BadRequestError('Không thể mời chính mình');
    }

    const memberCount =
      await this.invitationRepository.countActiveMembers(accId);
    if (memberCount >= MAX_MEMBERS_PER_ACC) {
      throw new BadRequestError(
        `Acc đã đủ ${MAX_MEMBERS_PER_ACC} thành viên, không thể mời thêm`
      );
    }

    const invitedUser =
      await this.invitationRepository.findUserByEmail(normalizedEmail);

    if (invitedUser) {
      const existingMember =
        await this.invitationRepository.findActiveMembership(
          accId,
          invitedUser.id
        );
      if (existingMember) {
        throw new BadRequestError('Người dùng đã là thành viên của acc này');
      }
    }

    const pending = await this.invitationRepository.findPendingForEmailOrUser(
      accId,
      normalizedEmail,
      invitedUser?.id
    );
    if (pending) {
      throw new BadRequestError(
        'Đã có lời mời đang chờ xác nhận cho email này'
      );
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + INVITE_EXPIRY_HOURS);

    const invitation = await this.invitationRepository.create({
      accId,
      invitedByUserId: ownerUserId,
      invitedEmail: normalizedEmail,
      invitedUserId: invitedUser?.id ?? null,
      expiresAt,
    });

    await this.historyService.append({
      accId,
      userId: ownerUserId,
      actionType: 'INVITE_SENT',
      note: `Mời ${normalizedEmail} vào acc ${acc.name}`,
    });

    // Email invitation (best-effort — does not fail the invite if SMTP errors)
    const inviterName =
      owner?.displayName || owner?.email || 'Chủ phòng';
    await emailService.sendInvitationEmail({
      toEmail: normalizedEmail,
      accName: acc.name,
      inviterName,
      expiresAt,
    });

    return invitation;
  }

  async listByAcc(userId: string, accId: string) {
    await this.invitationRepository.expireOverdue(accId);
    await this.ensureAccAccess(accId, userId);
    return this.invitationRepository.listByAccId(accId);
  }

  async listPendingForUser(userId: string) {
    await this.invitationRepository.expireOverdue();
    const user = await this.invitationRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User không tồn tại');
    }

    const pending = await this.invitationRepository.listPendingForUser(
      userId,
      user.email
    );

    const now = Date.now();
    const results = [];
    for (const inv of pending) {
      if (inv.expiresAt.getTime() < now) {
        await this.invitationRepository.updateStatus(inv.id, 'EXPIRED', {
          respondedAt: new Date(),
        });
        continue;
      }
      results.push(inv);
    }
    return results;
  }

  async acceptInvitation(userId: string, accId: string, invId: string) {
    await this.invitationRepository.expireOverdue(accId);

    const user = await this.invitationRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User không tồn tại');
    }

    const invitation = await this.invitationRepository.findById(invId);
    if (!invitation || invitation.accId !== accId) {
      throw new NotFoundError('Không tìm thấy lời mời');
    }

    if (!this.isInvitee(invitation, user)) {
      throw new ForbiddenError('Bạn không phải người được mời');
    }

    if (
      invitation.status === 'EXPIRED' ||
      this.isPastExpiry(invitation.expiresAt)
    ) {
      if (invitation.status === 'PENDING') {
        await this.invitationRepository.updateStatus(invId, 'EXPIRED', {
          respondedAt: new Date(),
        });
      }
      throw new BadRequestError('Lời mời đã hết hạn (24 giờ)');
    }

    if (invitation.status !== 'PENDING') {
      throw new BadRequestError(
        `Lời mời không còn hiệu lực (trạng thái: ${invitation.status})`
      );
    }

    const existing = await this.invitationRepository.findActiveMembership(
      accId,
      userId
    );
    if (existing) {
      const updated = await this.invitationRepository.updateStatus(
        invId,
        'ACCEPTED',
        { respondedAt: new Date(), invitedUserId: userId }
      );
      return { invitation: updated, membership: existing };
    }

    const memberCount =
      await this.invitationRepository.countActiveMembers(accId);
    if (memberCount >= MAX_MEMBERS_PER_ACC) {
      throw new BadRequestError(
        `Acc đã đủ ${MAX_MEMBERS_PER_ACC} thành viên, không thể chấp nhận lời mời`
      );
    }

    const membership = await this.invitationRepository.createMembership(
      accId,
      userId
    );

    const updated = await this.invitationRepository.updateStatus(
      invId,
      'ACCEPTED',
      { respondedAt: new Date(), invitedUserId: userId }
    );

    await this.historyService.append({
      accId,
      userId,
      actionType: 'INVITE_ACCEPTED',
      note: `${user.displayName || user.email} đã chấp nhận lời mời`,
    });

    await this.historyService.append({
      accId,
      userId,
      actionType: 'MEMBER_JOIN',
      note: `${user.displayName || user.email} trở thành thành viên`,
    });

    // Welcome email (best-effort)
    const accName =
      invitation.acc?.name ||
      (await this.invitationRepository.findAccById(accId))?.name ||
      'acc';
    await emailService.sendWelcomeEmail({
      toEmail: user.email,
      displayName: user.displayName || user.email,
      accName,
    });

    return { invitation: updated, membership };
  }

  async rejectInvitation(userId: string, accId: string, invId: string) {
    await this.invitationRepository.expireOverdue(accId);

    const user = await this.invitationRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User không tồn tại');
    }

    const invitation = await this.invitationRepository.findById(invId);
    if (!invitation || invitation.accId !== accId) {
      throw new NotFoundError('Không tìm thấy lời mời');
    }

    if (!this.isInvitee(invitation, user)) {
      throw new ForbiddenError('Bạn không phải người được mời');
    }

    if (
      invitation.status === 'EXPIRED' ||
      this.isPastExpiry(invitation.expiresAt)
    ) {
      if (invitation.status === 'PENDING') {
        await this.invitationRepository.updateStatus(invId, 'EXPIRED', {
          respondedAt: new Date(),
        });
      }
      throw new BadRequestError('Lời mời đã hết hạn (24 giờ)');
    }

    if (invitation.status !== 'PENDING') {
      throw new BadRequestError(
        `Lời mời không còn hiệu lực (trạng thái: ${invitation.status})`
      );
    }

    const updated = await this.invitationRepository.updateStatus(
      invId,
      'REJECTED',
      { respondedAt: new Date() }
    );

    await this.historyService.append({
      accId,
      userId,
      actionType: 'INVITE_REJECTED',
      note: `${user.displayName || user.email} đã từ chối lời mời`,
    });

    return updated;
  }
}

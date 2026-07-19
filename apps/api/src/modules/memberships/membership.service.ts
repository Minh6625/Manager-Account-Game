import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '@/shared/errors/AppError';
import { MembershipRepository } from './membership.repository';

export class MembershipService {
  private repository: MembershipRepository;

  constructor() {
    this.repository = new MembershipRepository();
  }

  private displayLabel(user: {
    displayName: string | null;
    email: string;
  }): string {
    return user.displayName || user.email;
  }

  /**
   * DELETE /api/v1/accs/:id/members/:memberId
   * Owner kicks a non-owner active member.
   * Task 7: history records actor + timestamp; holder kick frees acc.
   */
  async kickMember(
    actorUserId: string,
    accId: string,
    membershipId: string
  ) {
    const acc = await this.repository.findAccById(accId);
    if (!acc) {
      throw new NotFoundError('Không tìm thấy tài khoản');
    }

    if (acc.ownerUserId !== actorUserId) {
      throw new ForbiddenError(
        'Chỉ chủ phòng mới có thể kick thành viên'
      );
    }

    const membership = await this.repository.findMembershipById(membershipId);
    if (!membership || membership.accId !== accId) {
      throw new NotFoundError('Không tìm thấy thành viên trong acc này');
    }

    if (membership.leftAt !== null || membership.memberStatus === 'KICKED') {
      throw new BadRequestError('Thành viên này đã rời hoặc bị kick');
    }

    if (membership.role === 'OWNER' || membership.userId === acc.ownerUserId) {
      throw new BadRequestError('Không thể kick chủ phòng');
    }

    const wasHolding =
      membership.memberStatus === 'PLAYING' ||
      membership.memberStatus === 'PENDING_LOGOUT';

    const actor = await this.repository.findUserById(actorUserId);
    const actorName = actor
      ? this.displayLabel(actor)
      : 'Chủ phòng';
    const kickedName = this.displayLabel(membership.user);

    // note: who was kicked + context; history.userId = actor (người thực hiện)
    const note = wasHolding
      ? `Đã kick ${kickedName} (đang giữ acc — ${membership.memberStatus})`
      : `Đã kick ${kickedName}`;

    const result = await this.repository.kickMemberInTransaction({
      membershipId: membership.id,
      accId,
      wasHolding,
      fromAccStatus: acc.status,
      fromMemberStatus: membership.memberStatus,
      actorUserId,
      note: `${note} · bởi ${actorName}`,
    });

    return {
      membership: result.membership,
      acc: {
        id: result.acc.id,
        name: result.acc.name,
        status: result.acc.status,
      },
    };
  }
}

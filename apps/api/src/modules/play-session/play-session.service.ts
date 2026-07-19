import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '@/shared/errors/AppError';
import { PlaySessionRepository } from './play-session.repository';

export class PlaySessionService {
  private repository: PlaySessionRepository;

  constructor() {
    this.repository = new PlaySessionRepository();
  }

  private async requireAcc(accId: string) {
    const acc = await this.repository.findAccById(accId);
    if (!acc) {
      throw new NotFoundError('Không tìm thấy tài khoản');
    }
    return acc;
  }

  private async requireActiveMember(accId: string, userId: string) {
    const membership = await this.repository.findActiveMembership(
      accId,
      userId
    );
    if (!membership) {
      throw new ForbiddenError(
        'Bạn không phải thành viên của acc này hoặc đã bị kick'
      );
    }
    return membership;
  }

  private displayLabel(user: {
    displayName: string | null;
    email: string;
  }): string {
    return user.displayName || user.email;
  }

  /**
   * POST /status/play
   * Member starts playing when acc is AVAILABLE.
   * Only one holder at a time (optimistic claim on acc.status).
   */
  async startPlay(userId: string, accId: string) {
    const acc = await this.requireAcc(accId);
    const membership = await this.requireActiveMember(accId, userId);

    if (acc.status !== 'AVAILABLE') {
      const holder = await this.repository.findCurrentHolder(accId);
      const holderName = holder
        ? this.displayLabel(holder.user)
        : 'người khác';
      throw new ConflictError(
        acc.status === 'PENDING_LOGOUT'
          ? `Acc ${acc.name} đang chờ đăng xuất (bởi ${holderName}). Không thể đăng ký chơi.`
          : `Acc ${acc.name} đang có người giữ (${holderName}). Không thể đăng ký chơi.`
      );
    }

    if (
      membership.memberStatus === 'PLAYING' ||
      membership.memberStatus === 'PENDING_LOGOUT'
    ) {
      throw new BadRequestError(
        `Bạn đang giữ acc hoặc chờ đăng xuất ${acc.name}. Hãy hoàn tất phiên hiện tại trước.`
      );
    }

    const user = membership.user;
    const note = `${this.displayLabel(user)} bắt đầu chơi`;

    try {
      const result = await this.repository.startPlayInTransaction({
        accId,
        userId,
        membershipId: membership.id,
        fromAccStatus: acc.status,
        fromMemberStatus: membership.memberStatus,
        note,
      });

      if (!result.ok) {
        throw new ConflictError(
          'Acc vừa được người khác giữ. Không thể đăng ký chơi.'
        );
      }

      return {
        acc: result.acc,
        membership: result.membership,
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'HOLDER_CONFLICT') {
        throw new ConflictError(
          'Acc đang có người giữ. Không thể đăng ký chơi.'
        );
      }
      throw error;
    }
  }

  /**
   * POST /status/end
   * Current player ends session → PENDING_LOGOUT (must confirm logout later).
   */
  async endPlay(userId: string, accId: string) {
    const acc = await this.requireAcc(accId);
    const membership = await this.requireActiveMember(accId, userId);

    if (membership.memberStatus !== 'PLAYING') {
      throw new BadRequestError(
        'Bạn không đang chơi trên acc này. Chỉ người đang giữ acc mới kết thúc phiên được.'
      );
    }

    if (acc.status !== 'IN_USE') {
      throw new ConflictError(
        'Trạng thái acc không khớp (không ở IN_USE). Hãy tải lại trang hoặc nhờ chủ phòng force reset.'
      );
    }

    const note = `${this.displayLabel(membership.user)} kết thúc phiên, chờ đăng xuất ${acc.name}`;

    const result = await this.repository.endPlayInTransaction({
      accId,
      userId,
      membershipId: membership.id,
      fromAccStatus: acc.status,
      note,
      pendingLogoutAt: new Date(),
    });

    if (!result.ok) {
      throw new ConflictError(
        'Không thể kết thúc phiên (trạng thái acc đã đổi). Hãy tải lại trang.'
      );
    }

    return {
      acc: result.acc,
      membership: result.membership,
    };
  }

  /**
   * POST /status/confirm-logout
   * Player who is PENDING_LOGOUT confirms game logout → acc AVAILABLE.
   * Does NOT auto-expire; must be explicit action.
   */
  async confirmLogout(userId: string, accId: string) {
    const acc = await this.requireAcc(accId);
    const membership = await this.requireActiveMember(accId, userId);

    if (membership.memberStatus !== 'PENDING_LOGOUT') {
      throw new BadRequestError(
        `Bạn không ở trạng thái chờ đăng xuất ${acc.name}.`
      );
    }

    if (acc.status !== 'PENDING_LOGOUT') {
      throw new ConflictError(
        `Trạng thái acc ${acc.name} không khớp. Hãy tải lại trang hoặc nhờ chủ phòng ép reset.`
      );
    }

    const note = `${this.displayLabel(membership.user)} đã đăng xuất ${acc.name}`;

    const result = await this.repository.confirmLogoutInTransaction({
      accId,
      userId,
      membershipId: membership.id,
      fromAccStatus: acc.status,
      note,
    });

    if (!result.ok) {
      throw new ConflictError(
        `Không thể xác nhận đăng xuất ${acc.name} (trạng thái đã đổi). Hãy tải lại trang.`
      );
    }

    return {
      acc: result.acc,
      membership: result.membership,
    };
  }

  /**
   * POST /status/force-reset
   * Owner only — clear stuck IN_USE / PENDING_LOGOUT (or any non-AVAILABLE).
   */
  async forceReset(userId: string, accId: string) {
    const acc = await this.requireAcc(accId);

    if (acc.ownerUserId !== userId) {
      throw new ForbiddenError(
        'Chỉ chủ phòng mới có thể ép reset trạng thái acc'
      );
    }

    const holders = await this.repository.findHolders(accId);

    if (acc.status === 'AVAILABLE' && holders.length === 0) {
      return {
        acc,
        reset: false as const,
        message: 'Acc đã ở trạng thái rảnh, không cần reset',
      };
    }

    const holderNames = holders
      .map((h) => this.displayLabel(h.user))
      .join(', ');

    const note =
      holders.length > 0
        ? `Chủ phòng ép reset trạng thái (từ ${acc.status}; holder: ${holderNames})`
        : `Chủ phòng ép reset trạng thái (từ ${acc.status})`;

    const updated = await this.repository.forceResetInTransaction({
      accId,
      ownerUserId: userId,
      fromAccStatus: acc.status,
      holderIds: holders.map((h) => h.id),
      note,
    });

    return {
      acc: updated,
      reset: true as const,
      message: 'Đã ép reset trạng thái acc về rảnh',
    };
  }
}

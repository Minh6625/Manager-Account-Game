import { Request, Response, NextFunction } from 'express';
import { MembershipService } from './membership.service';

export class MembershipController {
  private membershipService: MembershipService;

  constructor() {
    this.membershipService = new MembershipService();
  }

  /** DELETE /api/v1/accs/:id/members/:memberId */
  async kickMember(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id: accId, memberId } = req.params;

      const result = await this.membershipService.kickMember(
        userId,
        accId,
        memberId
      );

      res.json({
        success: true,
        data: result,
        message: 'Đã kick thành viên khỏi acc',
      });
    } catch (error) {
      next(error);
    }
  }
}

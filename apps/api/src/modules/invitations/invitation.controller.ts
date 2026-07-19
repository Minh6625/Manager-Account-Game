import { Request, Response, NextFunction } from 'express';
import { createInvitationSchema } from './invitation.schemas';
import { InvitationService } from './invitation.service';

export class InvitationController {
  private invitationService: InvitationService;

  constructor() {
    this.invitationService = new InvitationService();
  }

  /** POST /api/v1/accs/:id/invitations */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const accId = req.params.id;
      const body = createInvitationSchema.parse(req.body);

      const invitation = await this.invitationService.createInvitation(
        userId,
        accId,
        body.email
      );

      res.status(201).json({
        success: true,
        message: 'Đã gửi lời mời',
        data: invitation,
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET /api/v1/accs/:id/invitations */
  async listByAcc(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const accId = req.params.id;

      const invitations = await this.invitationService.listByAcc(userId, accId);

      res.json({
        success: true,
        data: invitations,
      });
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/v1/accs/:id/invitations/:invId/accept */
  async accept(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { id: accId, invId } = req.params;

      const result = await this.invitationService.acceptInvitation(
        userId,
        accId,
        invId
      );

      res.json({
        success: true,
        message: 'Đã chấp nhận lời mời',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/v1/accs/:id/invitations/:invId/reject */
  async reject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { id: accId, invId } = req.params;

      const invitation = await this.invitationService.rejectInvitation(
        userId,
        accId,
        invId
      );

      res.json({
        success: true,
        message: 'Đã từ chối lời mời',
        data: invitation,
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET /api/v1/invitations/pending — lời mời chờ xác nhận của user hiện tại */
  async listPending(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const invitations =
        await this.invitationService.listPendingForUser(userId);

      res.json({
        success: true,
        data: invitations,
      });
    } catch (error) {
      next(error);
    }
  }
}

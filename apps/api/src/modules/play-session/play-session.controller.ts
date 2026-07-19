import { Request, Response, NextFunction } from 'express';
import { PlaySessionService } from './play-session.service';

export class PlaySessionController {
  private service: PlaySessionService;

  constructor() {
    this.service = new PlaySessionService();
  }

  /** POST /api/v1/accs/:id/status/play */
  async play(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const accId = req.params.id;

      const result = await this.service.startPlay(userId, accId);

      res.json({
        success: true,
        message: 'Đã đăng ký chơi',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/v1/accs/:id/status/end */
  async end(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const accId = req.params.id;

      const result = await this.service.endPlay(userId, accId);

      res.json({
        success: true,
        message: `Đã kết thúc phiên. Vui lòng xác nhận đã đăng xuất ${result.acc.name}.`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/v1/accs/:id/status/confirm-logout */
  async confirmLogout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const accId = req.params.id;

      const result = await this.service.confirmLogout(userId, accId);

      res.json({
        success: true,
        message: `Đã đăng xuất ${result.acc.name}. Acc trở về trạng thái rảnh.`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/v1/accs/:id/status/force-reset */
  async forceReset(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const accId = req.params.id;

      const result = await this.service.forceReset(userId, accId);

      res.json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

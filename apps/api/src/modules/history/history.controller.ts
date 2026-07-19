import { Request, Response, NextFunction } from 'express';
import { HistoryService } from './history.service';
import { listHistoryQuerySchema } from './history.schemas';

export class HistoryController {
  private historyService: HistoryService;

  constructor() {
    this.historyService = new HistoryService();
  }

  /** GET /api/v1/history?acc_id=&limit=&days= */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const query = listHistoryQuerySchema.parse(req.query);

      const history = await this.historyService.listForUser(userId, {
        accId: query.acc_id,
        limit: query.limit,
        days: query.days,
      });

      res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  }
}

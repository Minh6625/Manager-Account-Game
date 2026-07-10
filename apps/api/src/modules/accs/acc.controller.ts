import { Request, Response, NextFunction } from 'express';
import { AccService } from './acc.service';
import { createAccSchema } from './acc.schemas';

export class AccController {
  private accService: AccService;

  constructor() {
    this.accService = new AccService();
  }

  async getAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { filter, search } = req.query;

      const accounts = await this.accService.getAccounts(
        userId,
        filter as string | undefined,
        search as string | undefined
      );

      res.json({
        success: true,
        data: accounts,
      });
    } catch (error) {
      next(error);
    }
  }

  async createAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const validatedData = createAccSchema.parse(req.body);

      const account = await this.accService.createAccount(userId, validatedData);

      res.status(201).json({
        success: true,
        data: account,
        message: 'Tạo tài khoản thành công',
      });
    } catch (error) {
      next(error);
    }
  }
}

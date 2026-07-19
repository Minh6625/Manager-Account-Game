import { Request, Response, NextFunction } from 'express';
import { AccService } from './acc.service';
import { createAccSchema, updateAccSchema } from './acc.schemas';

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

  async getAccountById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const account = await this.accService.getAccountById(id, userId);

      res.json({
        success: true,
        data: account,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const validatedData = updateAccSchema.parse(req.body);

      const account = await this.accService.updateAccount(
        userId,
        id,
        validatedData
      );

      res.json({
        success: true,
        data: account,
        message: 'Cập nhật tài khoản thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const result = await this.accService.deleteAccount(userId, id);

      res.json({
        success: true,
        data: result,
        message: 'Xóa tài khoản thành công',
      });
    } catch (error) {
      next(error);
    }
  }
}

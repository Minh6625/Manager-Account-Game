import { Request, Response, NextFunction } from 'express';
import { config } from '@/app/config';
import { AuthService } from '@/modules/auth/auth.service';
import { UnauthorizedError } from '@/shared/errors/AppError';

const authService = new AuthService();

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Lấy JWT từ cookie — tên lấy từ config (single source of truth)
    const token = req.cookies?.[config.cookie.name] as string | undefined;

    if (!token) {
      throw new UnauthorizedError('Vui lòng đăng nhập');
    }

    // Verify token
    const decoded = authService.verifyToken(token);

    // Attach user info vào request
    (req as any).user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

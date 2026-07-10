import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/modules/auth/auth.service';
import { UnauthorizedError } from '@/shared/errors/AppError';

const authService = new AuthService();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Lấy token từ cookie
    const token = req.cookies.token;

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

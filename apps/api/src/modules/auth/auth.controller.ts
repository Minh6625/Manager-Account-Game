import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();

export class AuthController {
  // POST /api/v1/auth/signup
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, displayName } = req.body;

      // Validation
      if (!email || !password || !displayName) {
        return res.status(400).json({
          success: false,
          message: 'Email, password và displayName là bắt buộc',
        });
      }

      const user = await authService.signup({ email, password, displayName });

      return res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/auth/login
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email và password là bắt buộc',
        });
      }

      const result = await authService.login({ email, password });

      // Set httpOnly cookie (7 ngày)
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      });

      return res.json({
        success: true,
        message: 'Đăng nhập thành công',
        data: {
          user: result.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/auth/logout
  async logout(_req: Request, res: Response) {
    // Clear cookie
    res.clearCookie('token');

    return res.json({
      success: true,
      message: 'Đăng xuất thành công',
    });
  }

  // GET /api/v1/auth/me
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      // req.user được set bởi auth middleware
      const userId = (req as any).user.userId;

      const user = await authService.getUserById(userId);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

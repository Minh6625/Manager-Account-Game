import { Request, Response, NextFunction } from 'express';
import { authCookieOptions, config } from '@/app/config';
import { AuthService } from './auth.service';

const authService = new AuthService();

export class AuthController {
  // POST /api/v1/auth/signup
  async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password, displayName } = req.body;

      // Validation
      if (!email || !password || !displayName) {
        res.status(400).json({
          success: false,
          message: 'Email, password và displayName là bắt buộc',
        });
        return;
      }

      const user = await authService.signup({ email, password, displayName });

      res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/auth/login
  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email và password là bắt buộc',
        });
        return;
      }

      const result = await authService.login({ email, password });

      // Set httpOnly cookie from config (single source of truth)
      res.cookie(config.cookie.name, result.token, authCookieOptions);

      res.json({
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
  async logout(_req: Request, res: Response): Promise<void> {
    // Clear with same options as set (required by some browsers)
    res.clearCookie(config.cookie.name, {
      httpOnly: authCookieOptions.httpOnly,
      secure: authCookieOptions.secure,
      sameSite: authCookieOptions.sameSite,
    });

    res.json({
      success: true,
      message: 'Đăng xuất thành công',
    });
  }

  // GET /api/v1/auth/me
  async getMe(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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

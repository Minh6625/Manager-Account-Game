import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SESSION_DAYS } from '@manager-acc/shared';
import { BadRequestError, UnauthorizedError } from '@/shared/errors/AppError';
import { config } from '@/app/config';

const prisma = new PrismaClient();

interface SignupDto {
  email: string;
  password: string;
  displayName: string;
}

interface LoginDto {
  email: string;
  password: string;
}

interface JwtPayload {
  userId: string;
  email: string;
}

export class AuthService {
  // Đăng ký user mới
  async signup(data: SignupDto) {
    // Check email đã tồn tại
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestError('Email đã được sử dụng');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Tạo user mới
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        displayName: data.displayName,
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        createdAt: true,
      },
    });

    return user;
  }

  // Đăng nhập
  async login(data: LoginDto) {
    // Tìm user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedError('Email hoặc mật khẩu không đúng');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Email hoặc mật khẩu không đúng');
    }

    // Generate JWT token (7 ngày)
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      },
      token,
    };
  }

  // Generate JWT token
  private generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: `${SESSION_DAYS}d`,
    });
  }

  // Verify JWT token
  verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      return decoded;
    } catch (error) {
      throw new UnauthorizedError('Token không hợp lệ hoặc đã hết hạn');
    }
  }

  // Get user by ID
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('User không tồn tại');
    }

    return user;
  }
}

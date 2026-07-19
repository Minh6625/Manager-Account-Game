import { config as dotenvConfig } from 'dotenv'
import { SESSION_DAYS } from '@manager-acc/shared'

dotenvConfig()

const smtpHost = process.env.SMTP_HOST || ''
const emailEnabledEnv = process.env.EMAIL_ENABLED

/** Default: send when SMTP_HOST set; override with EMAIL_ENABLED=true|false */
const emailEnabled =
  emailEnabledEnv === 'true'
    ? true
    : emailEnabledEnv === 'false'
      ? false
      : Boolean(smtpHost)

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  database: {
    url: process.env.DATABASE_URL || '',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-this',
    expiresIn: `${SESSION_DAYS}d` as const,
  },

  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },

  /**
   * Single source of truth for auth cookie.
   * Used by login (set), logout (clear), and authMiddleware (read).
   */
  cookie: {
    name: 'token',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
  },

  /**
   * SMTP email (invitation + welcome).
   * Best-effort from domain services; see EmailService.
   */
  email: {
    enabled: emailEnabled,
    from:
      process.env.MAIL_FROM ||
      'Manager Account Liên Quân <noreply@localhost>',
    smtp: {
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  },
} as const

/** Options shared by res.cookie / res.clearCookie (must match for reliable clear). */
export const authCookieOptions = {
  httpOnly: config.cookie.httpOnly,
  secure: config.cookie.secure,
  sameSite: config.cookie.sameSite,
  maxAge: config.cookie.maxAge,
} as const

// Validate required environment variables
if (!config.database.url) {
  throw new Error('DATABASE_URL is required')
}

if (config.nodeEnv === 'production' && config.jwt.secret === 'your-secret-key-change-this') {
  throw new Error('JWT_SECRET must be set in production')
}

if (
  config.nodeEnv === 'production' &&
  config.email.enabled &&
  !config.email.smtp.host
) {
  console.warn(
    '[config] Production email enabled but SMTP_HOST is missing — emails will be logged only'
  )
}

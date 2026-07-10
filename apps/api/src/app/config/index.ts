import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL || '',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-this',
    expiresIn: '7d', // 7 days as per requirements
  },
  
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  
  cookie: {
    name: 'auth_token',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  },
} as const

// Validate required environment variables
if (!config.database.url) {
  throw new Error('DATABASE_URL is required')
}

if (config.nodeEnv === 'production' && config.jwt.secret === 'your-secret-key-change-this') {
  throw new Error('JWT_SECRET must be set in production')
}

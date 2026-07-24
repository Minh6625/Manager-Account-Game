import express, { Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from './config'
import { errorHandler } from './middleware/errorHandler'
import { prisma } from '../infra/db/prisma'
import authRoutes from '../modules/auth/auth.routes'
import accRoutes from '../modules/accs/acc.routes'
import historyRoutes from '../modules/history/history.routes'
import invitationMineRoutes from '../modules/invitations/invitation.mine.routes'

const app = express()

// ========== MIDDLEWARE ==========
app.use(cors(config.cors))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ========== ROUTES ==========

// Health check. `/api/health` is useful on Vercel; `/health` stays for local API.
app.get(['/health', '/api/health'], async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`

    res.json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      database: 'connected',
    })
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Service unavailable',
      database: 'disconnected',
    })
  }
})

app.get(['/api/v1', '/v1'], (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Manager Account Liên Quân API v1',
    version: '1.0.0',
  })
})

// Auth routes
app.use(['/api/v1/auth', '/v1/auth'], authRoutes)

// Account routes
app.use(['/api/v1/accs', '/v1/accs'], accRoutes)

// History routes (domain module - GET /api/v1/history?acc_id=)
app.use(['/api/v1/history', '/v1/history'], historyRoutes)

// Invitations for current user (pending list)
app.use(['/api/v1/invitations', '/v1/invitations'], invitationMineRoutes)

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// ========== ERROR HANDLER ==========
app.use(errorHandler)

export default app

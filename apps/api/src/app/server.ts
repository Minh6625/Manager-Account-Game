import express, { Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from './config'
import { errorHandler } from './middleware/errorHandler'
import { prisma } from '../infra/db/prisma'

const app = express()

// ========== MIDDLEWARE ==========
app.use(cors(config.cors))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ========== ROUTES ==========

// Health check
app.get('/health', async (_req: Request, res: Response) => {
  try {
    // Test database connection
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

// API routes
import authRoutes from '../modules/auth/auth.routes'
import accRoutes from '../modules/accs/acc.routes'
import historyRoutes from '../modules/history/history.routes'
import invitationMineRoutes from '../modules/invitations/invitation.mine.routes'

app.get('/api/v1', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Manager Account Liên Quân API v1',
    version: '1.0.0',
  })
})

// Auth routes
app.use('/api/v1/auth', authRoutes)

// Account routes
app.use('/api/v1/accs', accRoutes)

// History routes (domain module — GET /api/v1/history?acc_id=)
app.use('/api/v1/history', historyRoutes)

// Invitations for current user (pending list)
app.use('/api/v1/invitations', invitationMineRoutes)

// Background: email reminder if still PENDING_LOGOUT after 5 minutes
import { logoutReminderJob } from '../modules/play-session/logout-reminder.job'
logoutReminderJob.start()

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// ========== ERROR HANDLER ==========
app.use(errorHandler)

// ========== START SERVER ==========
const PORT = config.port

app.listen(PORT, () => {
  console.log(`
🚀 Server is running!
📍 Port: ${PORT}
🌍 Environment: ${config.nodeEnv}
🔗 API: http://localhost:${PORT}
🏥 Health: http://localhost:${PORT}/health
  `)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server gracefully...')
  logoutReminderJob.stop()
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing server gracefully...')
  logoutReminderJob.stop()
  await prisma.$disconnect()
  process.exit(0)
})

export default app

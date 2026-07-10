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
app.get('/health', async (req: Request, res: Response) => {
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

app.get('/api/v1', (req: Request, res: Response) => {
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

// 404 handler
app.use((req: Request, res: Response) => {
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
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing server gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

export default app

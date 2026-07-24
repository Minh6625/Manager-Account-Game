import app from './app'
import { config } from './config'
import { prisma } from '../infra/db/prisma'

// Background: email reminder if still PENDING_LOGOUT after 5 minutes
import { logoutReminderJob } from '../modules/play-session/logout-reminder.job'
logoutReminderJob.start()

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

/**
 * Simple test endpoint to verify serverless function deployment
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  return res.json({
    success: true,
    message: 'Serverless function is working!',
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  })
}

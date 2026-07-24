/**
 * Vercel Serverless catch-all for Express API.
 * Handles: /api/v1/*, /api/health, etc.
 *
 * Must live at repo root `api/[...path].ts` (not under apps/web).
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import app from '../apps/api/src/app/app'

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Ensure Express sees a full path starting with /api/...
  if (typeof req.url === 'string') {
    // Vercel may pass "/v1/auth/login" or "/api/v1/auth/login" depending on routing
    if (!req.url.startsWith('/api') && !req.url.startsWith('/health')) {
      req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`
    }
  }

  return app(req, res)
}

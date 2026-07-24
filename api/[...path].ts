/**
 * Vercel Serverless catch-all for Express API.
 * Handles: /api/v1/*, /api/health, etc.
 *
 * Must live at repo root `api/[...path].ts` (not under apps/web).
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import app from '../apps/api/src/app/app'

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Vercel serverless functions receive the full path including /api/
  // E.g., request to /api/v1/auth/login -> req.url = "/api/v1/auth/login" or "/v1/auth/login"
  // Express routes are set up to handle both /api/v1/* and /v1/* patterns
  
  // Ensure the URL starts with /api for consistency with Express routes
  if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/health')) {
    req.url = '/api' + req.url
  }
  
  return app(req, res)
}

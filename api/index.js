/**
 * Vercel Serverless Function - Main API Handler
 * Routes all /api/* requests to the Express app
 */

// Cache the Express app instance
let app = null;

export default async function handler(req, res) {
  try {
    // Lazy load the Express app on first request
    if (!app) {
      const appModule = await import('../apps/api/dist/app/app.js');
      app = appModule.default;
    }

    // Vercel routes /api/* to this function
    // Express routes expect /api/v1/*, so ensure the path is correct
    // The req.url from Vercel will be the full path like /api/v1/auth/login
    
    return app(req, res);
  } catch (error) {
    console.error('[Serverless] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}

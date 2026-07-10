import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authMiddleware } from '@/app/middleware/authMiddleware';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/signup', (req, res, next) => authController.signup(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/logout', (req, res, next) => authController.logout(req, res));

// Protected routes
router.get('/me', authMiddleware, (req, res, next) => authController.getMe(req, res, next));

export default router;

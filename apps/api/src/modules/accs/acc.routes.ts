import { Router } from 'express';
import { AccController } from './acc.controller';
import { authMiddleware } from '@/app/middleware/authMiddleware';

const router = Router();
const accController = new AccController();

// All routes require authentication
router.use(authMiddleware);

// GET /api/v1/accs - List accounts
router.get('/', (req, res, next) => accController.getAccounts(req, res, next));

// POST /api/v1/accs - Create account
router.post('/', (req, res, next) => accController.createAccount(req, res, next));

export default router;

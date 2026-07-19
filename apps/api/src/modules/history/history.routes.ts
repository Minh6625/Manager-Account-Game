import { Router } from 'express';
import { authMiddleware } from '@/app/middleware/authMiddleware';
import { HistoryController } from './history.controller';

const router = Router();
const historyController = new HistoryController();

router.use(authMiddleware);

// GET /api/v1/history?acc_id=...
router.get('/', (req, res, next) => historyController.list(req, res, next));

export default router;

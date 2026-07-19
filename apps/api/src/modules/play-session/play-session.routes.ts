import { Router } from 'express';
import { PlaySessionController } from './play-session.controller';

/**
 * Nested under /api/v1/accs/:id/status
 * Parent router must apply authMiddleware.
 */
const router = Router({ mergeParams: true });
const controller = new PlaySessionController();

router.post('/play', (req, res, next) => controller.play(req, res, next));

router.post('/end', (req, res, next) => controller.end(req, res, next));

router.post('/confirm-logout', (req, res, next) =>
  controller.confirmLogout(req, res, next)
);

router.post('/force-reset', (req, res, next) =>
  controller.forceReset(req, res, next)
);

export default router;

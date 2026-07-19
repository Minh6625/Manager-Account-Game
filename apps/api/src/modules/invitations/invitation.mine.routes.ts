import { Router } from 'express';
import { authMiddleware } from '@/app/middleware/authMiddleware';
import { InvitationController } from './invitation.controller';

/**
 * Top-level invitation routes for the current user.
 * Mounted at /api/v1/invitations
 */
const router = Router();
const invitationController = new InvitationController();

router.use(authMiddleware);

router.get('/pending', (req, res, next) =>
  invitationController.listPending(req, res, next)
);

export default router;

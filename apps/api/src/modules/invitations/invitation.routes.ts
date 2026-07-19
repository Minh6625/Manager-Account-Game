import { Router } from 'express';
import { InvitationController } from './invitation.controller';

/**
 * Nested under /api/v1/accs/:id/invitations
 * Parent router must apply authMiddleware.
 */
const router = Router({ mergeParams: true });
const invitationController = new InvitationController();

router.get('/', (req, res, next) =>
  invitationController.listByAcc(req, res, next)
);

router.post('/', (req, res, next) =>
  invitationController.create(req, res, next)
);

router.post('/:invId/accept', (req, res, next) =>
  invitationController.accept(req, res, next)
);

router.post('/:invId/reject', (req, res, next) =>
  invitationController.reject(req, res, next)
);

export default router;

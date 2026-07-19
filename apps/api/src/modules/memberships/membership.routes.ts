import { Router } from 'express';
import { MembershipController } from './membership.controller';

/**
 * Nested under /api/v1/accs/:id/members
 * Parent router already applies authMiddleware.
 */
const router = Router({ mergeParams: true });
const membershipController = new MembershipController();

// DELETE /api/v1/accs/:id/members/:memberId — kick (owner only)
router.delete('/:memberId', (req, res, next) =>
  membershipController.kickMember(req, res, next)
);

export default router;

import { Router } from 'express';
import { AccController } from './acc.controller';
import { authMiddleware } from '@/app/middleware/authMiddleware';
import invitationRoutes from '@/modules/invitations/invitation.routes';
import playSessionRoutes from '@/modules/play-session/play-session.routes';
import membershipRoutes from '@/modules/memberships/membership.routes';

const router = Router();
const accController = new AccController();

// All routes require authentication
router.use(authMiddleware);

// GET /api/v1/accs - List accounts
router.get('/', (req, res, next) => accController.getAccounts(req, res, next));

// POST /api/v1/accs - Create account
router.post('/', (req, res, next) => accController.createAccount(req, res, next));

// Nested invitations: /api/v1/accs/:id/invitations/*
router.use('/:id/invitations', invitationRoutes);

// Nested play session: /api/v1/accs/:id/status/*
router.use('/:id/status', playSessionRoutes);

// Nested members: /api/v1/accs/:id/members/*
router.use('/:id/members', membershipRoutes);

// GET /api/v1/accs/:id - Get account detail
router.get('/:id', (req, res, next) => accController.getAccountById(req, res, next));

// PATCH /api/v1/accs/:id - Update account (owner only)
router.patch('/:id', (req, res, next) =>
  accController.updateAccount(req, res, next)
);

// DELETE /api/v1/accs/:id - Delete account (owner only)
router.delete('/:id', (req, res, next) =>
  accController.deleteAccount(req, res, next)
);

export default router;

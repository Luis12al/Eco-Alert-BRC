import { Router } from 'express';
import { UsersController } from './users.controller.js';
import { authenticate } from '../auth/auth.middleware.js';

const router = Router();

router.get('/profile', authenticate, UsersController.getProfile);
router.get('/reports', authenticate, UsersController.getMyReports);
router.patch('/profile', authenticate, UsersController.updateProfile);

export default router;
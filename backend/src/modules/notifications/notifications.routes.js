import { Router } from 'express';
import { NotificationsController } from './notifications.controller.js';
import { authenticate, authorize } from '../auth/auth.middleware.js';

const router = Router();

router.post('/subscribe', authenticate, NotificationsController.subscribe);
router.post('/unsubscribe', NotificationsController.unsubscribe);
router.post('/send', authenticate, authorize('admin', 'moderator'), NotificationsController.sendNotification);

export default router;
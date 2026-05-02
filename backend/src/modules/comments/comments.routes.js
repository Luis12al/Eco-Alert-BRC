import { Router } from 'express';
import { CommentsController } from './comments.controller.js';
import { authenticate } from '../auth/auth.middleware.js';

const router = Router({ mergeParams: true });

router.get('/', CommentsController.getByReport);
router.post('/', authenticate, CommentsController.create);
router.delete('/:id', authenticate, CommentsController.delete);

export default router;
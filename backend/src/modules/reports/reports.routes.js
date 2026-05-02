/**
 * Rutas del módulo de reportes
 */
import { Router } from 'express';
import { ReportsController } from './reports.controller.js';
import { authenticate, authorize } from '../auth/auth.middleware.js';
import { upload } from '../../shared/middleware/upload.js';
import { reportLimiter } from '../../shared/middleware/rateLimiter.js';

const router = Router();

// Público - consulta
router.get('/nearby', ReportsController.getNearby);
router.get('/stats', ReportsController.getStats);
router.get('/:id', ReportsController.getById);

// Protegido - creación
router.post(
  '/',
  authenticate,
  reportLimiter,
  upload.single('image'),
  ReportsController.create
);

// Solo moderadores y admins
router.patch(
  '/:id/moderate',
  authenticate,
  authorize('moderator', 'admin'),
  ReportsController.moderate
);

// Solo admins - listado completo
router.get(
  '/',
  authenticate,
  authorize('admin'),
  ReportsController.getAll
);

export default router;
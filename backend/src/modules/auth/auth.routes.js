/**
 * Definición de rutas del módulo Auth
 */
import { Router } from 'express';
import passport from 'passport';
import { AuthController } from './auth.controller.js';
import { registerValidation, loginValidation } from './auth.validator.js';
import { validateRequest } from '../../shared/middleware/validateRequest.js';
import { authenticate } from './auth.middleware.js';
import { authLimiter } from '../../shared/middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, validateRequest(registerValidation), AuthController.register);
router.post('/login', authLimiter, validateRequest(loginValidation), AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', authenticate, AuthController.logout);
router.get('/me', authenticate, AuthController.getMe);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  AuthController.googleCallback
);

export default router;
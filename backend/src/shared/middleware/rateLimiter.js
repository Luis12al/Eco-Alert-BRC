/**
 * Rate limiting para prevenir abuso de la API
 */
import rateLimit from 'express-rate-limit';
import { ApiError } from '../utils/ApiError.js';

export const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
      next(ApiError.badRequest(message || 'Demasiadas peticiones, intenta más tarde'));
    },
  });
};

// Límites específicos por endpoint
export const authLimiter = createRateLimiter(15 * 60 * 1000, 5, 'Demasiados intentos de login. Intenta en 15 minutos.');
export const reportLimiter = createRateLimiter(60 * 60 * 1000, 10, 'Límite de reportes por hora alcanzado.');
export const apiLimiter = createRateLimiter(15 * 60 * 1000, 100);
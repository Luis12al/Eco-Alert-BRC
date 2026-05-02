/**
 * Middleware de autenticación JWT
 */
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { ApiError } from '../../shared/utils/ApiError.js';
import { query } from '../../config/database.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Token de autenticación requerido');
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Verificar que el usuario siga activo
    const result = await query(
      'SELECT id, email, name, role, reputation, is_active, created_at, avatar_url FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      throw ApiError.unauthorized('Usuario no encontrado o inactivo');
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(ApiError.unauthorized('Token inválido'));
    } else if (error.name === 'TokenExpiredError') {
      next(ApiError.unauthorized('Token expirado'));
    } else {
      next(error);
    }
  }
};

// Middleware de autorización por roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(ApiError.forbidden('No tienes permisos para esta acción'));
    } else {
      next();
    }
  };
};
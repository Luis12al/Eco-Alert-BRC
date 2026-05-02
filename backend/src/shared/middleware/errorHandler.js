/**
 * Middleware global de manejo de errores
 * Captura cualquier error y responde con formato consistente
 */
import { env } from '../../config/env.js';
import { logger } from '../utils/logger.js';
import { ApiError } from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Si no es un ApiError, convertirlo
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Error interno del servidor';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  // Log del error
  logger.error({
    message: error.message,
    statusCode: error.statusCode,
    path: req.path,
    method: req.method,
    stack: error.stack,
    ip: req.ip,
  });

  // Respuesta al cliente
  const response = {
    success: false,
    message: error.message,
    status: error.status,
    ...(env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  res.status(error.statusCode).json(response);
};

// Manejo de rutas no encontradas
export const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Ruta no encontrada: ${req.originalUrl}`));
};
/**
 * Middleware que valida request body/params/query usando express-validator
 */
import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

export const validateRequest = (validations) => {
  return async (req, res, next) => {
    // Ejecutar todas las validaciones
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    next(ApiError.badRequest('Error de validación', extractedErrors));
  };
};
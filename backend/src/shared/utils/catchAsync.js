/**
 * Wrapper para controllers async - captura errores automáticamente
 * Evita try/catch repetitivo en cada controller
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
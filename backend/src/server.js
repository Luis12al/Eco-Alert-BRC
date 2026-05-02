/**
 * Punto de entrada del servidor
 */
import app from './app.js';
import { env } from './config/env.js';
import { logger } from './shared/utils/logger.js';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Eco-Alert BRC API corriendo en puerto ${PORT} [${env.NODE_ENV}]`);
});

// Manejo graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`${signal} recibido. Cerrando servidor gracefully...`);
  server.close(() => {
    logger.info('Servidor cerrado. Saliendo...');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});
/**
 * Pool de conexiones PostgreSQL con PostGIS
 * Incluye manejo de reconexión y logging
 */
import pg from 'pg';
const { Pool } = pg;
import { env } from './env.js';
import { logger } from '../shared/utils/logger.js';

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  max: 20,                    // Máximo de conexiones simultáneas
  idleTimeoutMillis: 30000,   // Cerrar conexiones inactivas después de 30s
  connectionTimeoutMillis: 2000,
});

// Eventos del pool para monitoreo
pool.on('connect', () => {
  logger.info('Nueva conexión a PostgreSQL establecida');
});

pool.on('error', (err) => {
  logger.error('Error inesperado en el pool de PostgreSQL', err);
});

/**
 * Ejecuta una query con parámetros (previene SQL Injection)
 * @param {string} text - Query SQL
 * @param {Array} params - Parámetros
 */
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Query ejecutada', { text: text.substring(0, 50), duration, rows: result.rowCount });
    return result;
  } catch (error) {
    logger.error('Error en query', { text, error: error.message });
    throw error;
  }
};

/**
 * Obtiene una conexión del pool para transacciones
 */
export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

export default pool;
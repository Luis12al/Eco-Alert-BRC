/**
 * Capa de servicio: lógica de negocio de autenticación
 * Separa la lógica del controlador para facilitar testing
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { query, getClient } from '../../config/database.js';
import { ApiError } from '../../shared/utils/ApiError.js';
import { logger } from '../../shared/utils/logger.js';

const SALT_ROUNDS = 12;

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ userId, type: 'refresh' }, env.JWT_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
};

export const AuthService = {
  /**
   * Registro de nuevo usuario
   */
  async register({ email, password, name }) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // Verificar email único
      const existing = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );
      if (existing.rows.length > 0) {
        throw ApiError.conflict('El email ya está registrado');
      }

      // Hash de contraseña
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Crear usuario
      const result = await client.query(
        `INSERT INTO users (email, password_hash, name, role, reputation, created_at)
         VALUES ($1, $2, $3, 'citizen', 0, NOW())
         RETURNING id, email, name, role, reputation`,
        [email, hashedPassword, name]
      );

      const user = result.rows[0];
      const tokens = generateTokens(user.id);

      // Guardar refresh token
      await client.query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'30 days\')',
        [user.id, tokens.refreshToken]
      );

      await client.query('COMMIT');
      logger.info(`Usuario registrado: ${email}`);

      return { user, ...tokens };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Login con email y contraseña
   */
  async login({ email, password }) {
    const result = await query(
      'SELECT id, email, name, password_hash, role, reputation, is_active FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw ApiError.unauthorized('Credenciales inválidas');
    }

    const user = result.rows[0];

    if (!user.is_active) {
      throw ApiError.unauthorized('Cuenta desactivada');
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw ApiError.unauthorized('Credenciales inválidas');
    }

    // Eliminar password_hash del objeto
    const { password_hash, ...userWithoutPassword } = user;
    const tokens = generateTokens(user.id);

    // Guardar refresh token
    await query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'30 days\')',
      [user.id, tokens.refreshToken]
    );

    logger.info(`Login exitoso: ${email}`);

    return { user: userWithoutPassword, ...tokens };
  },

  /**
   * Login/Registro con Google OAuth
   */
  async googleAuth({ googleId, email, name, picture }) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // Buscar usuario por google_id o email
      let result = await client.query(
        'SELECT id, email, name, role, reputation, is_active FROM users WHERE google_id = $1 OR email = $2',
        [googleId, email]
      );

      let user;

      if (result.rows.length === 0) {
        // Crear nuevo usuario
        const newUser = await client.query(
          `INSERT INTO users (email, name, google_id, avatar_url, role, reputation, created_at)
           VALUES ($1, $2, $3, $4, 'citizen', 0, NOW())
           RETURNING id, email, name, role, reputation, avatar_url`,
          [email, name, googleId, picture]
        );
        user = newUser.rows[0];
        logger.info(`Usuario creado vía Google: ${email}`);
      } else {
        user = result.rows[0];
        if (!user.is_active) {
          throw ApiError.unauthorized('Cuenta desactivada');
        }
        // Actualizar google_id si es necesario
        if (!user.google_id) {
          await client.query('UPDATE users SET google_id = $1 WHERE id = $2', [googleId, user.id]);
        }
      }

      const tokens = generateTokens(user.id);
      await client.query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'30 days\')',
        [user.id, tokens.refreshToken]
      );

      await client.query('COMMIT');
      return { user, ...tokens };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Refrescar token de acceso
   */
  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_SECRET);
      
      if (decoded.type !== 'refresh') {
        throw ApiError.unauthorized('Token inválido');
      }

      // Verificar que el refresh token exista en BD
      const result = await query(
        'SELECT user_id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
        [refreshToken]
      );

      if (result.rows.length === 0) {
        throw ApiError.unauthorized('Token de refresco inválido o expirado');
      }

      const accessToken = jwt.sign({ userId: decoded.userId }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
      });

      return { accessToken };
    } catch (error) {
      throw ApiError.unauthorized('Token de refresco inválido');
    }
  },

  /**
   * Logout - invalidar refresh token
   */
  async logout(refreshToken) {
    await query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
    logger.info('Logout exitoso');
  },
};
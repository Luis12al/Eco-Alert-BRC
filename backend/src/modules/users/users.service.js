/**
 * Servicio de usuarios - gestión de perfiles y reputación
 */
import { query } from '../../config/database.js';
import { ApiError } from '../../shared/utils/ApiError.js';

export const UsersService = {
  async getProfile(userId) {
    const result = await query(
      `SELECT u.id, u.email, u.name, u.role, u.reputation, u.avatar_url, u.created_at,
        COUNT(r.id) as total_reports,
        COUNT(r.id) FILTER (WHERE r.status = 'approved') as approved_reports
       FROM users u
       LEFT JOIN reports r ON u.id = r.user_id
       WHERE u.id = $1
       GROUP BY u.id`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('Usuario no encontrado');
    }

    return result.rows[0];
  },

  async getUserReports(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const result = await query(
      `SELECT r.*,
        ST_X(r.location::geometry) as longitude,
        ST_Y(r.location::geometry) as latitude
       FROM reports r
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  },

  async updateProfile(userId, updates) {
    const allowedFields = ['name', 'avatar_url'];
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = $${paramIndex++}`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) {
      throw ApiError.badRequest('No hay campos válidos para actualizar');
    }

    values.push(userId);
    const result = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return result.rows[0];
  },
};
/**
 * Capa de repositorio: abstrae el acceso a datos
 * Facilita cambiar PostgreSQL por otra BD en el futuro
 */
import { query } from '../../config/database.js';

export const ReportsRepository = {
  async create(reportData) {
    const {
      userId, category, alertLevel, description,
      latitude, longitude, imageUrl, imagePublicId,
    } = reportData;

    const result = await query(
      `INSERT INTO reports 
        (user_id, category, alert_level, description, 
         location, image_url, image_public_id, status, created_at)
       VALUES ($1, $2, $3, $4, 
         ST_SetSRID(ST_MakePoint($5, $6), 4326), $7, $8, 'pending', NOW())
       RETURNING *`,
      [userId, category, alertLevel, description, longitude, latitude, imageUrl, imagePublicId]
    );

    return result.rows[0];
  },

  async findById(id) {
    const result = await query(
      `SELECT r.*, 
        u.name as reporter_name, u.reputation as reporter_reputation,
        ST_X(r.location::geometry) as longitude,
        ST_Y(r.location::geometry) as latitude
       FROM reports r
       JOIN users u ON r.user_id = u.id
       WHERE r.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async findNearby(latitude, longitude, radiusKm = 5, filters = {}) {
    let sql = `
      SELECT r.*, 
        u.name as reporter_name,
        ST_X(r.location::geometry) as longitude,
        ST_Y(r.location::geometry) as latitude,
        ST_Distance(
          r.location::geography,
          ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
        ) / 1000 as distance_km
      FROM reports r
      JOIN users u ON r.user_id = u.id
      WHERE ST_DWithin(
        r.location::geography,
        ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
        $3
      )
    `;
    
    const params = [latitude, longitude, radiusKm * 1000];
    let paramIndex = 4;

    if (filters.category) {
      sql += ` AND r.category = $${paramIndex++}`;
      params.push(filters.category);
    }
    if (filters.alertLevel) {
      sql += ` AND r.alert_level = $${paramIndex++}`;
      params.push(filters.alertLevel);
    }
    if (filters.dateFrom) {
      sql += ` AND r.created_at >= $${paramIndex++}`;
      params.push(filters.dateFrom);
    }
    if (filters.dateTo) {
      sql += ` AND r.created_at <= $${paramIndex++}`;
      params.push(filters.dateTo);
    }

    sql += ` ORDER BY distance_km ASC LIMIT $${paramIndex}`;
    params.push(filters.limit || 50);

    const result = await query(sql, params);
    return result.rows;
  },

  async findAll(filters = {}, pagination = { page: 1, limit: 20 }) {
    const offset = (pagination.page - 1) * pagination.limit;
    
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (filters.status) {
      whereClause += ` AND status = $${paramIndex++}`;
      params.push(filters.status);
    }
    if (filters.category) {
      whereClause += ` AND category = $${paramIndex++}`;
      params.push(filters.category);
    }
    if (filters.alertLevel) {
      whereClause += ` AND alert_level = $${paramIndex++}`;
      params.push(filters.alertLevel);
    }

    const countResult = await query(`SELECT COUNT(*) FROM reports ${whereClause}`, params);
    const total = parseInt(countResult.rows[0].count, 10);

    params.push(pagination.limit, offset);
    const result = await query(
      `SELECT r.*, u.name as reporter_name,
        ST_X(r.location::geometry) as longitude,
        ST_Y(r.location::geometry) as latitude
       FROM reports r
       JOIN users u ON r.user_id = u.id
       ${whereClause}
       ORDER BY r.created_at DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      params
    );

    return { data: result.rows, total };
  },

  async updateStatus(id, status, moderatorId) {
    const result = await query(
      `UPDATE reports 
       SET status = $1, moderated_by = $2, moderated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [status, moderatorId, id]
    );
    return result.rows[0] || null;
  },

  async getStats() {
    const result = await query(`
      SELECT 
        COUNT(*) as total_reports,
        COUNT(*) FILTER (WHERE alert_level = 'rojo') as red_alerts,
        COUNT(*) FILTER (WHERE alert_level = 'amarillo') as yellow_alerts,
        COUNT(*) FILTER (WHERE alert_level = 'verde') as green_alerts,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as last_24h
      FROM reports
      WHERE status = 'approved'
    `);
    return result.rows[0];
  },
};
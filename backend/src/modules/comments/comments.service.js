import { query } from '../../config/database.js';
import { ApiError } from '../../shared/utils/ApiError.js';

export const CommentsService = {
  async create({ reportId, userId, content }) {
    // Verificar que el reporte existe
    const reportExists = await query(
      'SELECT id FROM reports WHERE id = $1',
      [reportId]
    );
    
    if (reportExists.rows.length === 0) {
      throw ApiError.notFound('Reporte no encontrado');
    }

    const result = await query(
      `INSERT INTO comments (report_id, user_id, content, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *, (SELECT name FROM users WHERE id = $2) as author_name`,
      [reportId, userId, content]
    );

    return result.rows[0];
  },

  async getByReport(reportId) {
    const result = await query(
      `SELECT c.*, u.name as author_name, u.avatar_url as author_avatar
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.report_id = $1
       ORDER BY c.created_at DESC`,
      [reportId]
    );
    return result.rows;
  },

  async delete(commentId, userId) {
    // Verificar que el comentario pertenece al usuario o es admin
    const comment = await query(
      'SELECT user_id FROM comments WHERE id = $1',
      [commentId]
    );

    if (comment.rows.length === 0) {
      throw ApiError.notFound('Comentario no encontrado');
    }

    if (comment.rows[0].user_id !== userId) {
      throw ApiError.forbidden('No puedes eliminar este comentario');
    }

    await query('DELETE FROM comments WHERE id = $1', [commentId]);
  },
};
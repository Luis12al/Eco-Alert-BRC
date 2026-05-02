/**
 * Capa de servicio: lógica de negocio de reportes
 */
import { ReportsRepository } from './reports.repository.js';
import { uploadImage } from '../../config/cloudinary.js';
import { ApiError } from '../../shared/utils/ApiError.js';
import { ReportCategory } from '../../shared/enums/reportCategories.js';
import { AlertLevel } from '../../shared/enums/alertLevels.js';
import { query } from '../../config/database.js';
import { logger } from '../../shared/utils/logger.js';

export const ReportsService = {
  async createReport(reportData, imageBuffer, userId) {
    // Validar categoría
    if (!Object.values(ReportCategory).includes(reportData.category)) {
      throw ApiError.badRequest('Categoría de reporte inválida');
    }

    // Validar nivel de alerta
    if (!Object.values(AlertLevel).includes(reportData.alertLevel)) {
      throw ApiError.badRequest('Nivel de alerta inválido');
    }

    // Validar coordenadas (Barrancabermeja aprox)
    const { latitude, longitude } = reportData;
    if (latitude < 6.5 || latitude > 7.5 || longitude < -74.5 || longitude > -73.5) {
      throw ApiError.badRequest('Ubicación fuera del área permitida (Barrancabermeja)');
    }

    // Verificar reputación del usuario (anti-spam)
    const userResult = await query('SELECT reputation FROM users WHERE id = $1', [userId]);
    const reputation = userResult.rows[0]?.reputation || 0;
    
    // Usuarios con reputación muy baja tienen límites más estrictos
    if (reputation < -10) {
      const recentReports = await query(
        'SELECT COUNT(*) FROM reports WHERE user_id = $1 AND created_at > NOW() - INTERVAL \'1 hour\'',
        [userId]
      );
      if (parseInt(recentReports.rows[0].count) >= 2) {
        throw ApiError.forbidden('Has alcanzado el límite de reportes por hora debido a tu reputación');
      }
    }

    // Subir imagen a Cloudinary
    let imageUrl = null;
    let imagePublicId = null;
    
    if (imageBuffer) {
      const uploadResult = await uploadImage(imageBuffer, 'eco-alert-brc/reports');
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    // Crear reporte
    const report = await ReportsRepository.create({
      userId,
      category: reportData.category,
      alertLevel: reportData.alertLevel,
      description: reportData.description,
      latitude,
      longitude,
      imageUrl,
      imagePublicId,
    });

    // Actualizar reputación del usuario (+1 por reporte)
    await query(
      'UPDATE users SET reputation = reputation + 1 WHERE id = $1',
      [userId]
    );

    logger.info(`Reporte creado: ${report.id} por usuario ${userId}`);

    return report;
  },

  async getNearbyReports(latitude, longitude, radiusKm, filters) {
    const reports = await ReportsRepository.findNearby(
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(radiusKm) || 5,
      {
        category: filters.category,
        alertLevel: filters.alertLevel,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        limit: parseInt(filters.limit) || 50,
      }
    );

    return reports.map((r) => ({
      ...r,
      distance_km: parseFloat(r.distance_km).toFixed(2),
    }));
  },

  async getReportById(id) {
    const report = await ReportsRepository.findById(id);
    if (!report) {
      throw ApiError.notFound('Reporte no encontrado');
    }
    return report;
  },

  async getAllReports(filters, pagination) {
    return ReportsRepository.findAll(filters, pagination);
  },

  async moderateReport(reportId, status, moderatorId) {
    const validStatuses = ['approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw ApiError.badRequest('Estado de moderación inválido');
    }

    const report = await ReportsRepository.updateStatus(reportId, status, moderatorId);
    if (!report) {
      throw ApiError.notFound('Reporte no encontrado');
    }

    // Si se rechaza, penalizar reputación del usuario
    if (status === 'rejected') {
      await query(
        'UPDATE users SET reputation = GREATEST(reputation - 5, -50) WHERE id = $1',
        [report.user_id]
      );
    }

    logger.info(`Reporte ${reportId} ${status} por moderador ${moderatorId}`);

    return report;
  },

  async getDashboardStats() {
    return ReportsRepository.getStats();
  },
};
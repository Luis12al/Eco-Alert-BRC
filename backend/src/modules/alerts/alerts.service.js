import { query } from '../../config/database.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { logger } from '../../shared/utils/logger.js';

export const AlertsService = {
  /**
   * Detecta patrones de reportes concentrados y envía alertas
   */
  async checkConcentratedReports() {
    // Buscar zonas con 3+ reportes en las últimas 24 horas
    const result = await query(
      `SELECT 
        ST_X(ST_Centroid(ST_Collect(location::geometry))) as longitude,
        ST_Y(ST_Centroid(ST_Collect(location::geometry))) as latitude,
        COUNT(*) as report_count,
        array_agg(DISTINCT category) as categories,
        array_agg(DISTINCT alert_level) as alert_levels
       FROM reports
       WHERE created_at > NOW() - INTERVAL '24 hours'
         AND status = 'approved'
       GROUP BY ST_SnapToGrid(location::geometry, 0.01)
       HAVING COUNT(*) >= 3`
    );

    for (const cluster of result.rows) {
      // Determinar nivel de alerta del cluster
      const hasRed = cluster.alert_levels.includes('rojo');
      const hasYellow = cluster.alert_levels.includes('amarillo');
      
      const alertLevel = hasRed ? 'CRÍTICA' : hasYellow ? 'ALTA' : 'MEDIA';
      
      // Enviar notificación a usuarios cercanos
      await NotificationsService.sendToNearbyUsers(
        cluster.latitude,
        cluster.longitude,
        5, // 5km radius
        {
          title: `🚨 Alerta ${alertLevel} Ambiental`,
          body: `Se han detectado ${cluster.report_count} reportes en tu zona. Revisa el mapa para más detalles.`,
          url: `/mapa?lat=${cluster.latitude}&lng=${cluster.longitude}`,
        }
      );

      logger.info(`Alerta automática enviada: ${cluster.report_count} reportes en [${cluster.latitude}, ${cluster.longitude}]`);
    }

    return result.rows;
  },

  /**
   * Programar verificación periódica (ejecutar cada hora via cron)
   */
  scheduleChecks() {
    // Usar node-cron o similar
    setInterval(() => {
      this.checkConcentratedReports().catch(console.error);
    }, 60 * 60 * 1000); // Cada hora
  },
};
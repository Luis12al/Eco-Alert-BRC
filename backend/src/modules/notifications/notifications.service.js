import { query } from '../../config/database.js';
import { env } from '../../config/env.js';
import { logger } from '../../shared/utils/logger.js';

let webpush = null;

// Solo inicializar web-push si las claves VAPID están configuradas
if (env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY) {
  try {
    const webPushModule = await import('web-push');
    webpush = webPushModule.default || webPushModule;
    
    webpush.setVapidDetails(
      'mailto:admin@ecoalert-brc.com',
      env.VAPID_PUBLIC_KEY,
      env.VAPID_PRIVATE_KEY
    );
    
    logger.info('✅ Notificaciones push inicializadas correctamente');
  } catch (error) {
    logger.warn('⚠️ No se pudieron inicializar las notificaciones push:', error.message);
  }
} else {
  logger.warn('⚠️ Claves VAPID no configuradas. Las notificaciones push están desactivadas.');
}

export const NotificationsService = {
  async saveSubscription(userId, subscription) {
    await query(
      `INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (endpoint) DO UPDATE SET
         user_id = $1,
         p256dh = $3,
         auth = $4,
         updated_at = NOW()`,
      [userId, subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth]
    );
  },

  async removeSubscription(endpoint) {
    await query('DELETE FROM push_subscriptions WHERE endpoint = $1', [endpoint]);
  },

  async sendToUsers(userIds, payload) {
    if (!webpush) {
      logger.warn('Notificaciones push desactivadas - no hay claves VAPID configuradas');
      return;
    }

    const result = await query(
      'SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = ANY($1)',
      [userIds]
    );

    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      url: payload.url || '/mapa',
    });

    await Promise.all(
      result.rows.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            notificationPayload
          );
        } catch (error) {
          if (error.statusCode === 410) {
            await this.removeSubscription(sub.endpoint);
          } else {
            logger.error('Error sending push notification:', error);
          }
        }
      })
    );
  },

  async sendToNearbyUsers(latitude, longitude, radiusKm, payload) {
    if (!webpush) {
      logger.warn('Notificaciones push desactivadas');
      return;
    }

    const result = await query(
      `SELECT DISTINCT ps.endpoint, ps.p256dh, ps.auth
       FROM push_subscriptions ps
       JOIN users u ON ps.user_id = u.id
       WHERE u.location IS NOT NULL
         AND ST_DWithin(
           u.location::geography,
           ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
           $3 * 1000
         )`,
      [latitude, longitude, radiusKm]
    );

    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      url: payload.url || `/mapa?lat=${latitude}&lng=${longitude}`,
    });

    await Promise.all(
      result.rows.map((sub) =>
        webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          notificationPayload
        ).catch((error) => {
          if (error.statusCode === 410) {
            this.removeSubscription(sub.endpoint);
          }
        })
      )
    );
  },
};
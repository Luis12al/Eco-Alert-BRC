import { NotificationsService } from './notifications.service.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { successResponse } from '../../shared/utils/response.js';

export const NotificationsController = {
  subscribe: catchAsync(async (req, res) => {
    const subscription = req.body;
    await NotificationsService.saveSubscription(req.user.id, subscription);
    successResponse(res, null, 'Suscripción guardada', 201);
  }),

  unsubscribe: catchAsync(async (req, res) => {
    const { endpoint } = req.body;
    await NotificationsService.removeSubscription(endpoint);
    successResponse(res, null, 'Suscripción eliminada');
  }),

  sendNotification: catchAsync(async (req, res) => {
    const { title, body, userIds } = req.body;
    await NotificationsService.sendToUsers(userIds, { title, body });
    successResponse(res, null, 'Notificaciones enviadas');
  }),
};
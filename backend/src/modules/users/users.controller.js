import { UsersService } from './users.service.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { successResponse } from '../../shared/utils/response.js';

export const UsersController = {
  getProfile: catchAsync(async (req, res) => {
    const profile = await UsersService.getProfile(req.user.id);
    successResponse(res, profile, 'Perfil obtenido');
  }),

  getMyReports: catchAsync(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const reports = await UsersService.getUserReports(req.user.id, page, limit);
    successResponse(res, reports, 'Reportes del usuario obtenidos');
  }),

  updateProfile: catchAsync(async (req, res) => {
    const updated = await UsersService.updateProfile(req.user.id, req.body);
    successResponse(res, updated, 'Perfil actualizado');
  }),
};
/**
 * Capa de controlador: maneja HTTP requests/responses
 * Delega lógica de negocio al service
 */
import { AuthService } from './auth.service.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { successResponse } from '../../shared/utils/response.js';

export const AuthController = {
  register: catchAsync(async (req, res) => {
    const result = await AuthService.register(req.body);
    successResponse(res, result, 'Usuario registrado exitosamente', 201);
  }),

  login: catchAsync(async (req, res) => {
    const result = await AuthService.login(req.body);
    successResponse(res, result, 'Login exitoso');
  }),

  googleCallback: catchAsync(async (req, res) => {
    // Este controller se usa después de que Passport procesa el callback de Google
    const { user } = req;
    const result = await AuthService.googleAuth(user);
    successResponse(res, result, 'Autenticación con Google exitosa');
  }),

  refresh: catchAsync(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await AuthService.refreshToken(refreshToken);
    successResponse(res, result, 'Token refrescado');
  }),

  logout: catchAsync(async (req, res) => {
    const { refreshToken } = req.body;
    await AuthService.logout(refreshToken);
    successResponse(res, null, 'Logout exitoso');
  }),

  getMe: catchAsync(async (req, res) => {
    // req.user viene del middleware authenticate
    // Asegurar que created_at esté incluido
    const userWithDates = {
      ...req.user,
      created_at: req.user.created_at || new Date().toISOString(),
    };
    successResponse(res, userWithDates, 'Perfil obtenido');
  }),
};
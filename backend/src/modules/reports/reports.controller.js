/**
 * Controlador de reportes
 */
import { ReportsService } from './reports.service.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { successResponse, paginatedResponse } from '../../shared/utils/response.js';

export const ReportsController = {
  create: catchAsync(async (req, res) => {
    const reportData = {
      category: req.body.category,
      alertLevel: req.body.alertLevel,
      description: req.body.description,
      latitude: parseFloat(req.body.latitude),
      longitude: parseFloat(req.body.longitude),
    };

    const imageBuffer = req.file?.buffer;
    const report = await ReportsService.createReport(reportData, imageBuffer, req.user.id);
    
    successResponse(res, report, 'Reporte creado exitosamente', 201);
  }),

  getNearby: catchAsync(async (req, res) => {
    const { lat, lng, radius, ...filters } = req.query;
    
    const reports = await ReportsService.getNearbyReports(lat, lng, radius, filters);
    successResponse(res, reports, 'Reportes cercanos obtenidos');
  }),

  getById: catchAsync(async (req, res) => {
    const report = await ReportsService.getReportById(req.params.id);
    successResponse(res, report, 'Reporte obtenido');
  }),

  getAll: catchAsync(async (req, res) => {
    const filters = {
      status: req.query.status,
      category: req.query.category,
      alertLevel: req.query.alertLevel,
    };

    const pagination = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 20,
    };

    const result = await ReportsService.getAllReports(filters, pagination);
    paginatedResponse(res, result.data, { ...pagination, total: result.total });
  }),

  moderate: catchAsync(async (req, res) => {
    const { status } = req.body;
    const report = await ReportsService.moderateReport(
      req.params.id,
      status,
      req.user.id
    );
    successResponse(res, report, `Reporte ${status === 'approved' ? 'aprobado' : 'rechazado'}`);
  }),

  getStats: catchAsync(async (req, res) => {
    const stats = await ReportsService.getDashboardStats();
    successResponse(res, stats, 'Estadísticas obtenidas');
  }),
};
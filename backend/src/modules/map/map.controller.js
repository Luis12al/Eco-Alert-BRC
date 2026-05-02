import { MapService } from './map.service.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { successResponse } from '../../shared/utils/response.js';

export const MapController = {
  getHeatmapData: catchAsync(async (req, res) => {
    const { north, south, east, west } = req.query;
    const data = await MapService.getHeatmapData({
      north: parseFloat(north),
      south: parseFloat(south),
      east: parseFloat(east),
      west: parseFloat(west),
    });
    successResponse(res, data, 'Datos de heatmap obtenidos');
  }),

  getClusteredReports: catchAsync(async (req, res) => {
    const { zoom, bounds } = req.query;
    const data = await MapService.getClusteredReports(
      parseInt(zoom),
      JSON.parse(bounds || '{}')
    );
    successResponse(res, data, 'Reportes clusterizados obtenidos');
  }),
};
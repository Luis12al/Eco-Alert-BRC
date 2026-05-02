import { MapRepository } from './map.repository.js';

export const MapService = {
  async getHeatmapData(bounds) {
    return MapRepository.getHeatmapData(bounds);
  },

  async getClusteredReports(zoom, bounds) {
    // Implementar lógica de clustering según nivel de zoom
    const gridSize = zoom > 15 ? 0.001 : zoom > 12 ? 0.01 : 0.1;
    return MapRepository.getClusteredByGrid(bounds, gridSize);
  },
};
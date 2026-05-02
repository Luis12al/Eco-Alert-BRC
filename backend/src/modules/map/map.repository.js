import { query } from '../../config/database.js';

export const MapRepository = {
  async getHeatmapData({ north, south, east, west }) {
    const result = await query(
      `SELECT 
        ST_X(location::geometry) as longitude,
        ST_Y(location::geometry) as latitude,
        alert_level,
        COUNT(*) as intensity
       FROM reports
       WHERE status = 'approved'
         AND ST_Within(
           location::geometry,
           ST_MakeEnvelope($1, $2, $3, $4, 4326)
         )
       GROUP BY ST_SnapToGrid(location::geometry, 0.01), alert_level`,
      [west, south, east, north]
    );
    return result.rows;
  },

  async getClusteredByGrid(bounds, gridSize) {
    const result = await query(
      `SELECT 
        COUNT(*) as count,
        ST_X(ST_Centroid(ST_Collect(location::geometry))) as longitude,
        ST_Y(ST_Centroid(ST_Collect(location::geometry))) as latitude,
        array_agg(DISTINCT alert_level) as alert_levels
       FROM reports
       WHERE status = 'approved'
         AND ST_Within(
           location::geometry,
           ST_MakeEnvelope($1, $2, $3, $4, 4326)
         )
       GROUP BY ST_SnapToGrid(location::geometry, $5)`,
      [bounds.west, bounds.south, bounds.east, bounds.north, gridSize]
    );
    return result.rows;
  },
};
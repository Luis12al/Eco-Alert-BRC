import { Router } from 'express';
import { MapController } from './map.controller.js';

const router = Router();

router.get('/heatmap', MapController.getHeatmapData);
router.get('/clusters', MapController.getClusteredReports);

export default router;
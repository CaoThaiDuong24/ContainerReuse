import express from 'express';
import {
  getDriversByCompany,
  refreshDrivers,
  getCacheStats
} from '../controllers/driverController';

const router = express.Router();

// GET /api/drivers/cache-stats - Get cache statistics
router.get('/cache-stats', getCacheStats);

// POST /api/drivers/refresh/:transportCompanyId - Refresh cache for a specific company
router.post('/refresh/:transportCompanyId', refreshDrivers);

// GET /api/drivers/company/:transportCompanyId - Get drivers by transport company
router.get('/company/:transportCompanyId', getDriversByCompany);

export default router;

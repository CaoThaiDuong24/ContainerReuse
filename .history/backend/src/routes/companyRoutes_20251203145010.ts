import express from 'express';
import {
  getAllCompanies,
  getCompanyById,
  refreshCompanies,
  getCacheStats
} from '../controllers/companyController';

const router = express.Router();

// GET /api/companies/cache-stats - Get cache statistics
router.get('/cache-stats', getCacheStats);

// POST /api/companies/refresh - Refresh cache
router.post('/refresh', refreshCompanies);

// GET /api/companies/:companyId - Get specific company by ID
router.get('/:companyId', getCompanyById);

// GET /api/companies - Get all companies
router.get('/', getAllCompanies);

export default router;

import express from 'express';
import {
  getAllCompanies,
  getCompanyById,
  getCompanyByUserId,
  refreshCompanies,
  getCacheStats,
  testHRMSUserProfile
} from '../controllers/companyController';

const router = express.Router();

// GET /api/companies/test-hrms-userprofile - Test HRMS_UserProfile API
router.get('/test-hrms-userprofile', testHRMSUserProfile);

// GET /api/companies/cache-stats - Get cache statistics
router.get('/cache-stats', getCacheStats);

// POST /api/companies/refresh - Refresh cache
router.post('/refresh', refreshCompanies);

// GET /api/companies/by-user/:accuserkey - Get company by user ID
router.get('/by-user/:accuserkey', getCompanyByUserId);

// GET /api/companies/:companyId - Get specific company by ID
router.get('/:companyId', getCompanyById);

// GET /api/companies - Get all companies
router.get('/', getAllCompanies);

export default router;

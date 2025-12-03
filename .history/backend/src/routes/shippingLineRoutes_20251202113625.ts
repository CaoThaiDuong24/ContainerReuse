import express from 'express';
import {
  getShippingLines,
  getShippingLineById,
  getShippingLineByCode,
  getShippingLineStatistics,
  searchShippingLines,
  getCountries,
  refreshShippingLines,
  createShippingLine,
  updateShippingLine,
  deleteShippingLine
} from '../controllers/shippingLineController';

const router = express.Router();

// GET /api/iContainerHub_HangTau/statistics - Get statistics (must be before /:id)
router.get('/statistics', getShippingLineStatistics);

// GET /api/iContainerHub_HangTau/countries - Get all countries
router.get('/countries', getCountries);

// GET /api/iContainerHub_HangTau/search - Search shipping lines
router.get('/search', searchShippingLines);

// POST /api/iContainerHub_HangTau/refresh - Refresh cache
router.post('/refresh', refreshShippingLines);

// GET /api/iContainerHub_HangTau/code/:code - Get shipping line by code
router.get('/code/:code', getShippingLineByCode);

// GET /api/iContainerHub_HangTau - Get all shipping lines with filters
router.get('/', getShippingLines);

// GET /api/iContainerHub_HangTau/:id - Get shipping line by ID
router.get('/:id', getShippingLineById);

// POST /api/iContainerHub_HangTau - Create new shipping line
router.post('/', createShippingLine);

// PUT /api/iContainerHub_HangTau/:id - Update shipping line
router.put('/:id', updateShippingLine);

// DELETE /api/iContainerHub_HangTau/:id - Delete shipping line
router.delete('/:id', deleteShippingLine);

export default router;

import express from 'express';
import {
  getContainerTypes,
  getActiveContainerTypes,
  getContainerTypeById,
  getContainerTypeByCode,
  refreshContainerTypesCache,
  getContainerTypesStatistics,
  searchContainerTypes
} from '../controllers/containerTypeController';

const router = express.Router();

/**
 * Container Type Routes
 * Base path: /api/container-types
 */

// GET /api/container-types/statistics - Get statistics (must be before /:id)
router.get('/statistics', getContainerTypesStatistics);

// GET /api/container-types/active - Get active container types
router.get('/active', getActiveContainerTypes);

// GET /api/container-types/search - Search container types
router.get('/search', searchContainerTypes);

// POST /api/container-types/refresh - Refresh cache
router.post('/refresh', refreshContainerTypesCache);

// GET /api/container-types/code/:code - Get container type by code
router.get('/code/:code', getContainerTypeByCode);

// GET /api/container-types/:id - Get container type by ID
router.get('/:id', getContainerTypeById);

// GET /api/container-types - Get all container types
router.get('/', getContainerTypes);

export default router;

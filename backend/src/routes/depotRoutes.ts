import express from 'express';
import {
  getDepots,
  getDepotById,
  getDepotStatistics,
  getProvinces,
  createDepot,
  updateDepot,
  deleteDepot
} from '../controllers/depotController';

const router = express.Router();

// GET /api/iContainerHub_Depot/statistics - Get statistics (must be before /:id)
router.get('/statistics', getDepotStatistics);

// GET /api/iContainerHub_Depot/provinces - Get all provinces
router.get('/provinces', getProvinces);

// GET /api/iContainerHub_Depot - Get all depots with filters
router.get('/', getDepots);

// GET /api/iContainerHub_Depot/:id - Get depot by ID
router.get('/:id', getDepotById);

// POST /api/iContainerHub_Depot - Create new depot
router.post('/', createDepot);

// PUT /api/iContainerHub_Depot/:id - Update depot
router.put('/:id', updateDepot);

// DELETE /api/iContainerHub_Depot/:id - Delete depot
router.delete('/:id', deleteDepot);

export default router;

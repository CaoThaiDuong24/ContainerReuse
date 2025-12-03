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

// GET /api/containerHub_Depot/statistics - Get statistics (must be before /:id)
router.get('/statistics', getDepotStatistics);

// GET /api/containerHub_Depot/provinces - Get all provinces
router.get('/provinces', getProvinces);

// GET /api/containerHub_Depot - Get all depots with filters
router.get('/', getDepots);

// GET /api/containerHub_Depot/:id - Get depot by ID
router.get('/:id', getDepotById);

// POST /api/containerHub_Depot - Create new depot
router.post('/', createDepot);

// PUT /api/containerHub_Depot/:id - Update depot
router.put('/:id', updateDepot);

// DELETE /api/containerHub_Depot/:id - Delete depot
router.delete('/:id', deleteDepot);

export default router;

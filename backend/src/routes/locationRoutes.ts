import express from 'express';
import { 
  getLocations, 
  getLocationByCode, 
  refreshLocations 
} from '../controllers/locationController';

const router = express.Router();

// GET /api/locations - Get all locations
router.get('/', getLocations);

// GET /api/locations/:code - Get location by code
router.get('/:code', getLocationByCode);

// POST /api/locations/refresh - Refresh location cache
router.post('/refresh', refreshLocations);

export default router;

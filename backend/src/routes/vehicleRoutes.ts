import express from 'express';
import {
  getVehiclesByCompany,
  getDriversByVehicle
} from '../controllers/vehicleController';

const router = express.Router();

// GET /api/vehicles/:vehiclePlate/drivers - Get drivers by vehicle plate
router.get('/:vehiclePlate/drivers', getDriversByVehicle);

// GET /api/vehicles/company/:transportCompanyId - Get vehicles by transport company
router.get('/company/:transportCompanyId', getVehiclesByCompany);

export default router;

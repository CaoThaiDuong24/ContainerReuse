import express from 'express';
import {
  getOrderStatuses,
  getOrderStatusById,
  clearOrderStatusCache
} from '../controllers/orderStatusController';

const router = express.Router();

// POST /api/order-statuses/clear-cache - Clear cache (must be before /:id)
router.post('/clear-cache', clearOrderStatusCache);

// GET /api/order-statuses - Get all order statuses
router.get('/', getOrderStatuses);

// GET /api/order-statuses/:id - Get order status by ID or code
router.get('/:id', getOrderStatusById);

export default router;

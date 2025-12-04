import express from 'express';
import {
  getGoods,
  getActiveGoods,
  getGoodsById,
  getGoodsByCode,
  refreshGoodsCache,
  getGoodsStatistics,
  searchGoods
} from '../controllers/goodsController';

const router = express.Router();

/**
 * Goods Routes
 * Base path: /api/goods
 */

// GET /api/goods/statistics - Get statistics (must be before /:id)
router.get('/statistics', getGoodsStatistics);

// GET /api/goods/active - Get active goods
router.get('/active', getActiveGoods);

// GET /api/goods/search - Search goods
router.get('/search', searchGoods);

// POST /api/goods/refresh - Refresh cache
router.post('/refresh', refreshGoodsCache);

// GET /api/goods/code/:code - Get goods by code
router.get('/code/:code', getGoodsByCode);

// GET /api/goods/:id - Get goods by ID
router.get('/:id', getGoodsById);

// GET /api/goods - Get all goods
router.get('/', getGoods);

export default router;

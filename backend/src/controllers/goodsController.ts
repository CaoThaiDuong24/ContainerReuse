import { Request, Response } from 'express';
import goodsApiService from '../services/goodsApiService';

/**
 * GET /api/goods
 * Get all goods with optional filters
 */
export const getGoods = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    let goods = await goodsApiService.fetchGoods();
    
    if (!goods || goods.length === 0) {
      return res.status(503).json({
        success: false,
        message: 'Unable to fetch goods data from external API',
        count: 0,
        data: []
      });
    }
    
    // Apply filters
    if (status) {
      goods = goods.filter(g => g.status === status);
    }
    
    if (search) {
      const term = (search as string).toLowerCase();
      goods = goods.filter(g => 
        g.name.toLowerCase().includes(term) ||
        (g.code && g.code.toLowerCase().includes(term)) ||
        (g.description && g.description.toLowerCase().includes(term))
      );
    }
    
    return res.json({
      success: true,
      count: goods.length,
      data: goods
    });
  } catch (error) {
    console.error('❌ Error in getGoods:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting goods',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/goods/active
 * Get all active goods
 */
export const getActiveGoods = async (_req: Request, res: Response) => {
  try {
    const goods = await goodsApiService.getActiveGoods();
    
    return res.json({
      success: true,
      count: goods.length,
      data: goods
    });
  } catch (error) {
    console.error('❌ Error in getActiveGoods:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting active goods',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/goods/:id
 * Get goods by ID
 */
export const getGoodsById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const goods = await goodsApiService.getGoodsById(id);
    
    if (!goods) {
      return res.status(404).json({
        success: false,
        message: 'Goods not found'
      });
    }
    
    return res.json({
      success: true,
      data: goods
    });
  } catch (error) {
    console.error('❌ Error in getGoodsById:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting goods',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/goods/code/:code
 * Get goods by code
 */
export const getGoodsByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const goods = await goodsApiService.getGoodsByCode(code);
    
    if (!goods) {
      return res.status(404).json({
        success: false,
        message: 'Goods not found'
      });
    }
    
    return res.json({
      success: true,
      data: goods
    });
  } catch (error) {
    console.error('❌ Error in getGoodsByCode:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting goods',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * POST /api/goods/refresh
 * Refresh goods cache
 */
export const refreshGoodsCache = async (_req: Request, res: Response) => {
  try {
    console.log('🔄 Cache refresh requested');
    const goods = await goodsApiService.refreshCache();
    const stats = goodsApiService.getCacheStats();
    
    return res.json({
      success: true,
      message: 'Cache refreshed successfully',
      count: goods.length,
      data: goods,
      cacheStats: stats
    });
  } catch (error) {
    console.error('❌ Error in refreshGoodsCache:', error);
    return res.status(500).json({
      success: false,
      message: 'Error refreshing cache',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/goods/statistics
 * Get goods statistics
 */
export const getGoodsStatistics = async (_req: Request, res: Response) => {
  try {
    const goods = await goodsApiService.fetchGoods();
    const stats = goodsApiService.getCacheStats();
    
    const activeCount = goods.filter(g => g.status === 'active').length;
    const inactiveCount = goods.filter(g => g.status === 'inactive').length;
    
    return res.json({
      success: true,
      data: {
        total: goods.length,
        active: activeCount,
        inactive: inactiveCount,
        cache: stats
      }
    });
  } catch (error) {
    console.error('❌ Error in getGoodsStatistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/goods/search
 * Search goods
 */
export const searchGoods = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }
    
    const goods = await goodsApiService.searchGoods(q as string);
    
    return res.json({
      success: true,
      count: goods.length,
      data: goods
    });
  } catch (error) {
    console.error('❌ Error in searchGoods:', error);
    return res.status(500).json({
      success: false,
      message: 'Error searching goods',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

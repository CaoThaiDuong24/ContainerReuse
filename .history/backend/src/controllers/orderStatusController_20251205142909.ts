import { Request, Response } from 'express';
import orderStatusApiService from '../services/orderStatusApiService';

/**
 * Get all order statuses
 * GET /api/order-statuses
 */
export const getOrderStatuses = async (_req: Request, res: Response) => {
  try {
    console.log('📋 Fetching order statuses...');
    
    const statuses = await orderStatusApiService.fetchOrderStatuses();
    
    if (!statuses || statuses.length === 0) {
      return res.status(503).json({
        success: false,
        message: 'Unable to fetch order status data from external API',
        count: 0,
        data: []
      });
    }
    
    return res.json({
      success: true,
      message: 'Order statuses retrieved successfully',
      count: statuses.length,
      data: statuses
    });
  } catch (error) {
    console.error('❌ Error in getOrderStatuses:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting order statuses',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get order status by ID or code
 * GET /api/order-statuses/:id
 */
export const getOrderStatusById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    console.log(`🔍 Fetching order status: ${id}`);
    
    const status = await orderStatusApiService.getOrderStatusById(id);
    
    if (!status) {
      return res.status(404).json({
        success: false,
        message: 'Order status not found'
      });
    }
    
    return res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('❌ Error in getOrderStatusById:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting order status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Clear order status cache
 * POST /api/order-statuses/clear-cache
 */
export const clearOrderStatusCache = async (_req: Request, res: Response) => {
  try {
    orderStatusApiService.clearCache();
    
    return res.json({
      success: true,
      message: 'Order status cache cleared successfully'
    });
  } catch (error) {
    console.error('❌ Error in clearOrderStatusCache:', error);
    return res.status(500).json({
      success: false,
      message: 'Error clearing cache',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

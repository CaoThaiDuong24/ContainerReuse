import { Request, Response } from 'express';
import driverApiService from '../services/driverApiService';

/**
 * GET /api/drivers/company/:transportCompanyId
 * Get all drivers for a specific transport company
 */
export const getDriversByCompany = async (req: Request, res: Response) => {
  try {
    const { transportCompanyId } = req.params;

    if (!transportCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Transport company ID is required'
      });
    }

    const drivers = await driverApiService.fetchDriversByCompany(transportCompanyId);
    
    if (!drivers) {
      return res.status(503).json({
        success: false,
        message: 'Unable to fetch driver data from external API',
        count: 0,
        data: []
      });
    }
    
    return res.json({
      success: true,
      count: drivers.length,
      data: drivers
    });
  } catch (error) {
    console.error('❌ Error in getDriversByCompany:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting drivers',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * POST /api/drivers/refresh/:transportCompanyId
 * Refresh driver cache for a specific company
 */
export const refreshDrivers = async (req: Request, res: Response) => {
  try {
    const { transportCompanyId } = req.params;

    if (!transportCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Transport company ID is required'
      });
    }

    // Clear cache for this company
    driverApiService.clearCache(transportCompanyId);
    
    // Fetch fresh data
    const drivers = await driverApiService.fetchDriversByCompany(transportCompanyId);
    
    return res.json({
      success: true,
      message: 'Driver cache refreshed successfully',
      count: drivers.length,
      data: drivers
    });
  } catch (error) {
    console.error('❌ Error in refreshDrivers:', error);
    return res.status(500).json({
      success: false,
      message: 'Error refreshing driver cache',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/drivers/cache-stats
 * Get driver cache statistics
 */
export const getCacheStats = async (_req: Request, res: Response) => {
  try {
    const stats = driverApiService.getCacheStats();
    
    return res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Error in getCacheStats:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting cache stats',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

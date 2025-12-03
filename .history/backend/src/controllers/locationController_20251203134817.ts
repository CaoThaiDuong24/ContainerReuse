import { Request, Response } from 'express';
import locationApiService from '../services/locationApiService';

/**
 * GET /api/locations - Get all locations (provinces/cities)
 */
export const getLocations = async (_req: Request, res: Response) => {
  try {
    console.log('📡 GET /api/locations - Starting...');
    const locations = await locationApiService.fetchLocations();
    
    if (!locations || locations.length === 0) {
      return res.status(503).json({
        success: false,
        message: 'Unable to fetch location data from external API',
        count: 0,
        data: []
      });
    }
    
    return res.json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    console.error('❌ Error getting locations:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting locations',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/locations/:code - Get location name by code
 */
export const getLocationByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const name = await locationApiService.getLocationName(code);
    
    return res.json({
      success: true,
      data: {
        code,
        name
      }
    });
  } catch (error) {
    console.error('❌ Error getting location by code:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting location',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * POST /api/locations/refresh - Clear cache and refresh location data
 */
export const refreshLocations = async (_req: Request, res: Response) => {
  try {
    console.log('🔄 Refreshing location cache...');
    locationApiService.clearCache();
    const locations = await locationApiService.fetchLocations();
    
    return res.json({
      success: true,
      message: 'Location cache refreshed successfully',
      count: locations.length,
      data: locations
    });
  } catch (error) {
    console.error('❌ Error refreshing locations:', error);
    return res.status(500).json({
      success: false,
      message: 'Error refreshing locations',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

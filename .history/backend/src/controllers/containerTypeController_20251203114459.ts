import { Request, Response } from 'express';
import containerTypeApiService from '../services/containerTypeApiService';

/**
 * GET /api/container-types
 * Get all container types with optional filters
 */
export const getContainerTypes = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    let containerTypes = await containerTypeApiService.fetchContainerTypes();
    
    if (!containerTypes || containerTypes.length === 0) {
      return res.status(503).json({
        success: false,
        message: 'Unable to fetch container type data from external API',
        count: 0,
        data: []
      });
    }
    
    // Apply filters
    if (status) {
      containerTypes = containerTypes.filter(ct => ct.status === status);
    }
    
    if (search) {
      const term = (search as string).toLowerCase();
      containerTypes = containerTypes.filter(ct => 
        ct.name.toLowerCase().includes(term) ||
        ct.code.toLowerCase().includes(term) ||
        (ct.description && ct.description.toLowerCase().includes(term))
      );
    }
    
    return res.json({
      success: true,
      count: containerTypes.length,
      data: containerTypes
    });
  } catch (error) {
    console.error('❌ Error in getContainerTypes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting container types',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/container-types/active
 * Get all active container types
 */
export const getActiveContainerTypes = async (_req: Request, res: Response) => {
  try {
    const containerTypes = await containerTypeApiService.getActiveContainerTypes();
    
    return res.json({
      success: true,
      count: containerTypes.length,
      data: containerTypes
    });
  } catch (error) {
    console.error('❌ Error in getActiveContainerTypes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting active container types',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/container-types/:id
 * Get container type by ID
 */
export const getContainerTypeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const containerType = await containerTypeApiService.getContainerTypeById(id);
    
    if (!containerType) {
      return res.status(404).json({
        success: false,
        message: 'Container type not found'
      });
    }
    
    return res.json({
      success: true,
      data: containerType
    });
  } catch (error) {
    console.error('❌ Error in getContainerTypeById:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting container type',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/container-types/code/:code
 * Get container type by code
 */
export const getContainerTypeByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const containerType = await containerTypeApiService.getContainerTypeByCode(code);
    
    if (!containerType) {
      return res.status(404).json({
        success: false,
        message: 'Container type not found'
      });
    }
    
    return res.json({
      success: true,
      data: containerType
    });
  } catch (error) {
    console.error('❌ Error in getContainerTypeByCode:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting container type',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * POST /api/container-types/refresh
 * Refresh container types cache
 */
export const refreshContainerTypesCache = async (_req: Request, res: Response) => {
  try {
    console.log('🔄 Cache refresh requested');
    const containerTypes = await containerTypeApiService.refreshCache();
    const stats = containerTypeApiService.getCacheStats();
    
    return res.json({
      success: true,
      message: 'Cache refreshed successfully',
      count: containerTypes.length,
      data: containerTypes,
      cacheStats: stats
    });
  } catch (error) {
    console.error('❌ Error in refreshContainerTypesCache:', error);
    return res.status(500).json({
      success: false,
      message: 'Error refreshing cache',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/container-types/statistics
 * Get container types statistics
 */
export const getContainerTypesStatistics = async (_req: Request, res: Response) => {
  try {
    const containerTypes = await containerTypeApiService.fetchContainerTypes();
    const stats = containerTypeApiService.getCacheStats();
    
    const activeCount = containerTypes.filter(ct => ct.status === 'active').length;
    const inactiveCount = containerTypes.filter(ct => ct.status === 'inactive').length;
    
    return res.json({
      success: true,
      data: {
        total: containerTypes.length,
        active: activeCount,
        inactive: inactiveCount,
        cache: stats
      }
    });
  } catch (error) {
    console.error('❌ Error in getContainerTypesStatistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/container-types/search
 * Search container types
 */
export const searchContainerTypes = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }
    
    const containerTypes = await containerTypeApiService.searchContainerTypes(q as string);
    
    return res.json({
      success: true,
      count: containerTypes.length,
      data: containerTypes
    });
  } catch (error) {
    console.error('❌ Error in searchContainerTypes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error searching container types',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

import { Request, Response } from 'express';
import shippingLineApiService from '../services/shippingLineApiService';

/**
 * GET /api/iContainerHub_HangTau
 * Get all shipping lines with optional filters
 */
export const getShippingLines = async (req: Request, res: Response) => {
  try {
    const { status, country, search } = req.query;
    let shippingLines = await shippingLineApiService.fetchShippingLines();
    
    if (!shippingLines || shippingLines.length === 0) {
      return res.status(503).json({
        success: false,
        message: 'Unable to fetch shipping line data from external API',
        count: 0,
        data: []
      });
    }
    
    // Apply filters
    if (status) {
      shippingLines = shippingLines.filter(line => line.status === status);
    }
    
    if (country && country !== 'all') {
      shippingLines = shippingLines.filter(line => line.country === country);
    }
    
    if (search) {
      const term = (search as string).toLowerCase();
      shippingLines = shippingLines.filter(line => 
        line.name.toLowerCase().includes(term) ||
        line.code.toLowerCase().includes(term) ||
        line.fullName.toLowerCase().includes(term) ||
        (line.scacCode && line.scacCode.toLowerCase().includes(term))
      );
    }
    
    return res.json({
      success: true,
      count: shippingLines.length,
      data: shippingLines
    });
  } catch (error) {
    console.error('❌ Error in getShippingLines:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting shipping lines',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/iContainerHub_HangTau/:id
 * Get shipping line by ID
 */
export const getShippingLineById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const shippingLine = await shippingLineApiService.getShippingLineById(id);
    
    if (!shippingLine) {
      return res.status(404).json({
        success: false,
        message: 'Shipping line not found'
      });
    }
    
    return res.json({
      success: true,
      data: shippingLine
    });
  } catch (error) {
    console.error('❌ Error in getShippingLineById:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting shipping line',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/iContainerHub_HangTau/code/:code
 * Get shipping line by code
 */
export const getShippingLineByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const shippingLine = await shippingLineApiService.getShippingLineByCode(code);
    
    if (!shippingLine) {
      return res.status(404).json({
        success: false,
        message: 'Shipping line not found'
      });
    }
    
    return res.json({
      success: true,
      data: shippingLine
    });
  } catch (error) {
    console.error('❌ Error in getShippingLineByCode:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting shipping line',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/iContainerHub_HangTau/statistics
 * Get shipping line statistics
 */
export const getShippingLineStatistics = async (req: Request, res: Response) => {
  try {
    const stats = await shippingLineApiService.getStatistics();
    
    return res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Error in getShippingLineStatistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting shipping line statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/iContainerHub_HangTau/search
 * Search shipping lines
 */
export const searchShippingLines = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const results = await shippingLineApiService.searchShippingLines(q);
    
    return res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('❌ Error in searchShippingLines:', error);
    return res.status(500).json({
      success: false,
      message: 'Error searching shipping lines',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/iContainerHub_HangTau/countries
 * Get list of countries
 */
export const getCountries = async (req: Request, res: Response) => {
  try {
    const shippingLines = await shippingLineApiService.fetchShippingLines();
    const countries = [...new Set(shippingLines.map(line => line.country).filter(Boolean))].sort();
    
    return res.json({
      success: true,
      count: countries.length,
      data: countries
    });
  } catch (error) {
    console.error('❌ Error in getCountries:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting countries',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * POST /api/iContainerHub_HangTau/refresh
 * Clear cache and refresh data
 */
export const refreshShippingLines = async (req: Request, res: Response) => {
  try {
    shippingLineApiService.clearCache();
    const shippingLines = await shippingLineApiService.fetchShippingLines();
    
    return res.json({
      success: true,
      message: 'Shipping line data refreshed successfully',
      count: shippingLines.length,
      data: shippingLines
    });
  } catch (error) {
    console.error('❌ Error in refreshShippingLines:', error);
    return res.status(500).json({
      success: false,
      message: 'Error refreshing shipping line data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * POST /api/iContainerHub_HangTau
 * Create new shipping line (placeholder - would need API endpoint)
 */
export const createShippingLine = async (req: Request, res: Response) => {
  try {
    // TODO: Implement create shipping line logic with real API
    const shippingLineData = req.body;
    
    return res.status(201).json({
      success: true,
      message: 'Shipping line created successfully (not implemented)',
      data: shippingLineData
    });
  } catch (error) {
    console.error('❌ Error in createShippingLine:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating shipping line',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * PUT /api/iContainerHub_HangTau/:id
 * Update shipping line (placeholder - would need API endpoint)
 */
export const updateShippingLine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // TODO: Implement update shipping line logic with real API
    
    return res.json({
      success: true,
      message: 'Shipping line updated successfully (not implemented)',
      data: { id, ...updateData }
    });
  } catch (error) {
    console.error('❌ Error in updateShippingLine:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating shipping line',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * DELETE /api/iContainerHub_HangTau/:id
 * Delete shipping line (placeholder - would need API endpoint)
 */
export const deleteShippingLine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // TODO: Implement delete shipping line logic with real API
    
    return res.json({
      success: true,
      message: 'Shipping line deleted successfully (not implemented)',
      data: { id }
    });
  } catch (error) {
    console.error('❌ Error in deleteShippingLine:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting shipping line',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

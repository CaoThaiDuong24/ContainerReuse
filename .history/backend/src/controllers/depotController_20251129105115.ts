import { Request, Response } from 'express';
import depotApiService from '../services/depotApiService';

// GET /api/iContainerHub_Depot - Get all depots with optional filters
export const getDepots = async (req: Request, res: Response) => {
  try {
    const { province, search, status } = req.query;
    let depots = await depotApiService.fetchDepots();
    
    if (!depots || depots.length === 0) {
      return res.status(503).json({
        success: false,
        message: 'Unable to fetch depot data from external API',
        count: 0,
        data: []
      });
    }
    
    // Apply filters
    if (province && province !== 'all') {
      depots = depots.filter(d => d.province === province);
    }
    if (status) {
      depots = depots.filter(d => d.status === status);
    }
    if (search) {
      const term = (search as string).toLowerCase();
      depots = depots.filter(d => 
        d.name.toLowerCase().includes(term) ||
        d.address.toLowerCase().includes(term) ||
        d.location.toLowerCase().includes(term)
      );
    }
    
    res.json({
      success: true,
      count: depots.length,
      data: depots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting depots',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// GET /api/iContainerHub_Depot/:id - Get depot by ID
export const getDepotById = async (req: Request, res: Response) => {
  try {
    const depots = await depotApiService.fetchDepots();
    const depot = depots.find(d => d.id === req.params.id);
    
    if (!depot) {
      return res.status(404).json({
        success: false,
        message: 'Depot not found'
      });
    }
    
    res.json({
      success: true,
      data: depot
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting depot',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// GET /api/iContainerHub_Depot/statistics - Get depot statistics
export const getDepotStatistics = async (_req: Request, res: Response) => {
  try {
    const statistics = await depotApiService.getStatistics();
    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// GET /api/iContainerHub_Depot/provinces - Get all provinces
export const getProvinces = async (_req: Request, res: Response) => {
  try {
    const provinces = await depotApiService.getProvinces();
    res.json({
      success: true,
      count: provinces.length,
      data: provinces
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting provinces',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// POST /api/iContainerHub_Depot - Create new depot
export const createDepot = async (_req: Request, res: Response) => {
  res.status(501).json({
    success: false,
    message: 'Create depot feature not implemented with external API'
  });
};

// PUT /api/iContainerHub_Depot/:id - Update depot
export const updateDepot = async (_req: Request, res: Response) => {
  res.status(501).json({
    success: false,
    message: 'Update depot feature not implemented with external API'
  });
};

// DELETE /api/iContainerHub_Depot/:id - Delete depot
export const deleteDepot = async (_req: Request, res: Response) => {
  res.status(501).json({
    success: false,
    message: 'Delete depot feature not implemented with external API'
  });
};

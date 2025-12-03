import { Request, Response } from 'express';

// GET /api/containers - Get all containers (reuse containers)
export const getContainers = async (req: Request, res: Response) => {
  try {
    const { ContainerApiService } = require('../services/containerApiService.js');
    const containerApiService = new ContainerApiService();
    const data = await containerApiService.getListReUseNow();
    
    if (!data) {
      return res.status(503).json({
        success: false,
        message: 'Unable to fetch container data from external API',
        count: 0,
        data: []
      });
    }
    
    res.json({
      success: true,
      count: Array.isArray(data) ? data.length : 0,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting containers',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// GET /api/containers/reuse-now - Get list of reuse containers
export const getListReUseNow = async (req: Request, res: Response) => {
  try {
    const { ContainerApiService } = require('../services/containerApiService.js');
    const containerApiService = new ContainerApiService();
    const data = await containerApiService.getListReUseNow();
    
    if (!data) {
      return res.status(503).json({
        success: false,
        message: 'Unable to fetch container data from external API',
        count: 0,
        data: []
      });
    }
    
    res.json({
      success: true,
      message: 'Get reuse container list successfully',
      count: Array.isArray(data) ? data.length : 0,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting reuse container list',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// GET /api/containers/:id - Get container by ID
export const getContainerById = async (req: Request, res: Response) => {
  try {
    const { ContainerApiService } = require('../services/containerApiService.js');
    const containerApiService = new ContainerApiService();
    const data = await containerApiService.getListReUseNow();
    
    if (!data || !Array.isArray(data)) {
      return res.status(503).json({
        success: false,
        message: 'Unable to fetch container data'
      });
    }
    
    const container = data.find((c: any) => c.id === req.params.id || c.containerId === req.params.id);
    
    if (!container) {
      return res.status(404).json({
        success: false,
        message: 'Container not found'
      });
    }
    
    res.json({
      success: true,
      data: container
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting container',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// POST /api/containers - Create new container
export const createContainer = async (req: Request, res: Response) => {
  try {
    // TODO: Implement create container logic with real API
    const containerData = req.body;
    
    res.status(201).json({
      success: true,
      message: 'Container created successfully',
      data: containerData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating container',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// PUT /api/containers/:id - Update container
export const updateContainer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // TODO: Implement update container logic with real API
    
    res.json({
      success: true,
      message: 'Container updated successfully',
      data: { id, ...updateData }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating container',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// DELETE /api/containers/:id - Delete container
export const deleteContainer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // TODO: Implement delete container logic with real API
    
    res.json({
      success: true,
      message: 'Container deleted successfully',
      data: { id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting container',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
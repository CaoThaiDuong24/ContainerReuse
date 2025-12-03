import { Request, Response } from 'express';
import depotApiService from '../services/depotApiService';

// Depot Interface
interface Depot {
  id: string;
  name: string;
  location: string;
  address: string;
  image: string;
  containerCount: number;
  capacity: number;
  status: 'active' | 'inactive';
  province: string;
}

// GET /api/iContainerHub_Depot - Get all depots with optional filters
export const getDepots = async (req: Request, res: Response) => {
  try {
    const { province, search, status } = req.query;
    
    console.log('🔍 Fetching depots from external API...');
    
    // Lấy dữ liệu từ API thực
    let allDepots = await depotApiService.fetchDepots();
    
    // Kiểm tra nếu không có dữ liệu
    if (!allDepots || allDepots.length === 0) {
      console.log('⚠️ No data from API');
      return res.status(503).json({
        success: false,
        message: 'Unable to fetch depot data from external API',
        count: 0,
        data: []
      });
    }
    
    let filteredDepots = [...allDepots];
    
    // Filter by province
    if (province && province !== 'all') {
      filteredDepots = filteredDepots.filter(depot => depot.province === province);
    }
    
    // Filter by status
    if (status) {
      filteredDepots = filteredDepots.filter(depot => depot.status === status);
    }
    
    // Search filter
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredDepots = filteredDepots.filter(depot => 
        depot.name.toLowerCase().includes(searchTerm) ||
        depot.address.toLowerCase().includes(searchTerm) ||
        depot.location.toLowerCase().includes(searchTerm)
      );
    }
    
    res.json({
      success: true,
      count: filteredDepots.length,
      data: filteredDepots,
      source: 'api'
    });
  } catch (error) {
    console.error('❌ Error in getDepots:', error);
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
    const { id } = req.params;
    
    // Lấy dữ liệu từ API thực
    const allDepots = await depotApiService.fetchDepots();
    
    // Kiểm tra nếu không có dữ liệu
    if (!allDepots || allDepots.length === 0) {
      return res.status(503).json({
        success: false,
        message: 'Unable to fetch depot data from external API'
      });
    }
    
    const depot = allDepots.find(d => d.id === id);
    
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
    // Lấy thống kê từ API thực
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
    // Lấy danh sách tỉnh từ API thực
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
export const createDepot = async (req: Request, res: Response) => {
  try {
    // Chức năng này cần được implement với API thực
    res.status(501).json({
      success: false,
      message: 'Create depot feature not implemented with external API'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating depot',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// PUT /api/iContainerHub_Depot/:id - Update depot
export const updateDepot = async (req: Request, res: Response) => {
  try {
    // Chức năng này cần được implement với API thực
    res.status(501).json({
      success: false,
      message: 'Update depot feature not implemented with external API'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating depot',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// DELETE /api/iContainerHub_Depot/:id - Delete depot
export const deleteDepot = async (_req: Request, res: Response) => {
  try {
    // Chức năng này cần được implement với API thực
    res.status(501).json({
      success: false,
      message: 'Delete depot feature not implemented with external API'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting depot',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

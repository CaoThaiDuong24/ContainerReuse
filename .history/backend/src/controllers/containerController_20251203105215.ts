import { Request, Response } from 'express';
import { storageService } from '../utils/storageService';

// GET /api/containers - Get all containers (reuse containers)
export const getContainers = async (req: Request, res: Response) => {
  try {
    const { ContainerApiService } = require('../services/containerApiService.js');
    const containerApiService = new ContainerApiService();
    let containers = await containerApiService.getListReUseGroupNow();
    
    if (!containers || !Array.isArray(containers)) {
      return res.status(503).json({
        success: false,
        message: 'Unable to fetch container data from external API',
        count: 0,
        data: []
      });
    }
    
    // Apply filters from query params
    const { depotId, type, size, status } = req.query;
    
    if (depotId) {
      console.log(`🔍 Filtering containers by depotId: ${depotId}`);
      containers = containers.filter(c => c.depotId === String(depotId));
    }
    
    if (type && type !== 'all') {
      containers = containers.filter(c => c.type === type);
    }
    
    if (size && size !== 'all') {
      containers = containers.filter(c => c.size === size);
    }
    
    if (status && status !== 'all') {
      containers = containers.filter(c => c.status === status);
    }
    
    console.log(`✅ Returning ${containers.length} containers after filters`);
    
    return res.json({
      success: true,
      count: containers.length,
      data: containers
    });
  } catch (error) {
    console.error('Error in getContainers:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting containers',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// GET /api/containers/reuse-now - Get list of reuse containers
export const getListReUseNow = async (_req: Request, res: Response) => {
  try {
    const { ContainerApiService } = require('../services/containerApiService.js');
    const containerApiService = new ContainerApiService();
    const containers = await containerApiService.getListReUseGroupNow();
    
    if (!containers || !Array.isArray(containers)) {
      return res.status(503).json({
        success: false,
        message: 'Unable to fetch container data from external API',
        count: 0,
        data: []
      });
    }
    
    return res.json({
      success: true,
      message: 'Get reuse container list successfully',
      count: containers.length,
      data: containers
    });
  } catch (error) {
    console.error('Error in getListReUseNow:', error);
    return res.status(500).json({
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
    const containers = await containerApiService.getListReUseGroupNow();
    
    if (!containers || !Array.isArray(containers)) {
      return res.status(503).json({
        success: false,
        message: 'Unable to fetch container data'
      });
    }
    
    const container = containers.find((c: any) => c.id === req.params.id || c.containerId === req.params.id);
    
    if (!container) {
      return res.status(404).json({
        success: false,
        message: 'Container not found'
      });
    }
    
    return res.json({
      success: true,
      data: container
    });
  } catch (error) {
    console.error('Error in getContainerById:', error);
    return res.status(500).json({
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
    
    return res.status(201).json({
      success: true,
      message: 'Container created successfully',
      data: containerData
    });
  } catch (error) {
    return res.status(500).json({
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
    
    return res.json({
      success: true,
      message: 'Container updated successfully',
      data: { id, ...updateData }
    });
  } catch (error) {
    return res.status(500).json({
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
    
    return res.json({
      success: true,
      message: 'Container deleted successfully',
      data: { id }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting container',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// POST /api/containers/gate-out - Create gate out for container
export const createGateOut = async (req: Request, res: Response) => {
  try {
    const gateOutData = req.body;
    
    console.log('\\n========================================');
    console.log('📝 GATE OUT REQUEST RECEIVED');
    console.log('========================================');
    console.log('Request Body:', JSON.stringify(gateOutData, null, 2));
    
    // Validate required fields
    const requiredFields = [
      'HangTauID',
      'ContTypeSizeID',
      'SoChungTuNhapBai',
      'DonViVanTaiID',
      'SoXe',
      'NguoiTao',
      'CongTyInHoaDon_PhiHaTang',
      'CongTyInHoaDon',
      'DepotID',
      'SoLuongCont',
      'HangHoa'
    ];
    
    const missingFields = requiredFields.filter(field => {
      const value = gateOutData[field];
      // Check for undefined, null, empty string, or NaN
      return value === undefined || 
             value === null || 
             value === '' ||
             (typeof value === 'number' && isNaN(value));
    });
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      console.log('Provided fields:', Object.keys(gateOutData));
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields: missingFields,
        providedFields: Object.keys(gateOutData)
      });
    }
    
    console.log('✅ All required fields present');
    
    const { ContainerApiService } = require('../services/containerApiService.js');
    const containerApiService = new ContainerApiService();
    const result = await containerApiService.createGateOut(gateOutData);
    
    console.log('\n📤 SERVICE RESULT:');
    console.log(JSON.stringify(result, null, 2));
    console.log('========================================\n');
    
    if (result.success) {
      // Save registered container to storage
      try {
        const userId = gateOutData.NguoiTao;
        const registeredContainer = storageService.addRegisteredContainer(
          userId,
          result.data,
          gateOutData
        );
        console.log('✅ Container registration saved:', registeredContainer.id);
      } catch (storageError) {
        console.error('⚠️ Failed to save registration:', storageError);
        // Don't fail the request if storage fails
      }
      
      return res.status(201).json({
        success: true,
        message: 'Gate out created successfully',
        data: result.data
      });
    } else {
      // Return detailed error information
      const errorMessage = result.error || 'Failed to create gate out';
      const errorDetails: any = {
        success: false,
        message: errorMessage
      };
      
      // Include additional error details if available
      if (result.errorCode) {
        errorDetails.errorCode = result.errorCode;
      }
      if (result.statusCode) {
        errorDetails.statusCode = result.statusCode;
      }
      if (result.apiResponse) {
        errorDetails.apiResponse = result.apiResponse;
      }
      if (result.attemptedReqid) {
        errorDetails.attemptedReqid = result.attemptedReqid;
      }
      
      // Provide helpful suggestions based on error
      if (errorMessage.includes('Invalid token') || result.errorCode === '404' || result.statusCode === 400) {
        errorDetails.suggestion = 'The API endpoint may require special authentication. Please verify:\\n' +
          '1. The endpoint Create_GateOut_Reuse exists and is accessible\\n' +
          '2. Your API credentials have permission for this operation\\n' +
          '3. The reqid \"Create_GateOut_Reuse\" is correct\\n' +
          '4. All data fields match the expected format';
      }
      
      console.error('❌ Gate out creation failed:', errorDetails);
      
      // Return appropriate status code
      const statusCode = result.statusCode || (result.errorCode === '404' ? 400 : 500);
      return res.status(statusCode).json(errorDetails);
    }
  } catch (error) {
    console.error('❌ Error in createGateOut controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while creating gate out',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// GET /api/containers/registered - Get registered containers for user
export const getRegisteredContainers = async (req: Request, res: Response) => {
  try {
    // Get userId from query params or body (in production, get from auth token)
    const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
    
    console.log('📋 Getting registered containers for user:', userId || 'all users');
    
    // Get registered containers from storage
    let registeredContainers;
    if (userId) {
      registeredContainers = storageService.getRegisteredContainersByUser(userId);
    } else {
      // If no userId specified, return all (for admin or testing)
      registeredContainers = storageService.getAllRegisteredContainers();
    }
    
    // Format the data for frontend
    const formattedContainers = registeredContainers.map((record) => {
      const containerData = record.containerData || {};
      const gateOutData = record.gateOutData || {};
      
      return {
        id: record.id,
        containerId: containerData.MaPhieuXuat || containerData.id || record.id,
        containerNumber: gateOutData.SoChungTuNhapBai || 'N/A',
        type: containerData.ContainerType || 'Container',
        size: containerData.ContainerSize || gateOutData.ContTypeSizeID?.toString() || 'N/A',
        status: 'Đã đăng ký',
        depot: containerData.DepotName || gateOutData.DepotID?.toString() || 'N/A',
        registeredAt: record.registeredAt,
        location: containerData.Location || containerData.ViTri || '',
        vehicleNumber: gateOutData.SoXe || '',
        shippingLine: gateOutData.HangTauID?.toString() || '',
        userId: record.userId,
        rawData: {
          containerData,
          gateOutData
        }
      };
    });
    
    return res.json({
      success: true,
      message: 'Get registered containers successfully',
      count: formattedContainers.length,
      data: formattedContainers
    });
  } catch (error) {
    console.error('Error in getRegisteredContainers:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting registered containers',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
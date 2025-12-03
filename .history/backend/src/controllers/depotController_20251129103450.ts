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

// Mock Data for Depots
const mockDepots: Depot[] = [
  {
    id: "DEPOT001",
    name: "LONG GIANG (TIỀN GIANG)",
    location: "Long Giang",
    address: "ấp 7, Xã Tâm Hiệp, Huyện Châu Thành, Tỉnh Tiền Giang (cách chân cầu cao tốc 500m, cách KCN Long Giang 2km)",
    image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&q=80",
    containerCount: 127,
    capacity: 500,
    status: "active",
    province: "Tiền Giang"
  },
  {
    id: "DEPOT002",
    name: "DEPOT PHƯỚC ĐÔNG",
    location: "Phước Đông",
    address: "Số 2 Đường Nông Trường, KCN Phước Đông, Gò Dầu, Tây Ninh",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80",
    containerCount: 284,
    capacity: 450,
    status: "active",
    province: "Tây Ninh"
  },
  {
    id: "DEPOT003",
    name: "DEPOT PHÚ MỸ",
    location: "Phú Mỹ",
    address: "KCN Phú Mỹ 3, Phường Phước Hòa, Thị Xã Phú Mỹ, Bà Rịa - Vũng Tàu",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    containerCount: 456,
    capacity: 600,
    status: "active",
    province: "Bà Rịa - Vũng Tàu"
  },
  {
    id: "DEPOT004",
    name: "DEPOT CÁI MÉP",
    location: "Cái Mép",
    address: "Khu Cảng Cái Mép, Phường Phước Hòa, Thị Xã Phú Mỹ, Bà Rịa - Vũng Tàu",
    image: "https://images.unsplash.com/photo-1605745341075-2c0a57d8e9b7?w=800&q=80",
    containerCount: 672,
    capacity: 800,
    status: "active",
    province: "Bà Rịa - Vũng Tàu"
  },
  {
    id: "DEPOT005",
    name: "DEPOT BÌNH DƯƠNG",
    location: "Bình Dương",
    address: "KCN Việt Nam - Singapore II, Phường Bình Hòa, Thành phố Thuận An, Bình Dương",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80",
    containerCount: 398,
    capacity: 550,
    status: "active",
    province: "Bình Dương"
  },
  {
    id: "DEPOT006",
    name: "DEPOT ĐỒNG NAI",
    location: "Đồng Nai",
    address: "KCN Biên Hòa 2, Đường Võ Thị Sáu, Phường Long Bình Tân, TP Biên Hòa, Đồng Nai",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    containerCount: 521,
    capacity: 700,
    status: "active",
    province: "Đồng Nai"
  },
  {
    id: "DEPOT007",
    name: "DEPOT CÁT LÁI",
    location: "Cát Lái",
    address: "Khu Cảng Cát Lái, Đường Nguyễn Thị Định, Phường Cát Lái, Quận 2, TP.HCM",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80",
    containerCount: 891,
    capacity: 1000,
    status: "active",
    province: "TP. Hồ Chí Minh"
  },
  {
    id: "DEPOT008",
    name: "DEPOT HIỆP PHƯỚC",
    location: "Hiệp Phước",
    address: "Khu Cảng Hiệp Phước, Xã Hiệp Phước, Huyện Nhà Bè, TP.HCM",
    image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&q=80",
    containerCount: 612,
    capacity: 750,
    status: "active",
    province: "TP. Hồ Chí Minh"
  },
  {
    id: "DEPOT009",
    name: "DEPOT TÂN CẢNG",
    location: "Tân Cảng",
    address: "156 Nguyễn Tất Thành, Phường 12, Quận 4, TP.HCM",
    image: "https://images.unsplash.com/photo-1605745341075-2c0a57d8e9b7?w=800&q=80",
    containerCount: 734,
    capacity: 850,
    status: "active",
    province: "TP. Hồ Chí Minh"
  },
  {
    id: "DEPOT010",
    name: "DEPOT LONG AN",
    location: "Long An",
    address: "KCN Tân Đức, Xã Đức Hòa Hạ, Huyện Đức Hòa, Long An",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    containerCount: 189,
    capacity: 400,
    status: "active",
    province: "Long An"
  },
  {
    id: "DEPOT011",
    name: "DEPOT VĨNH PHƯỚC",
    location: "Vĩnh Phước",
    address: "KCN Vĩnh Phước, Phường Vĩnh Phước, Thành phố Nha Trang, Khánh Hòa",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    containerCount: 143,
    capacity: 350,
    status: "active",
    province: "Khánh Hòa"
  },
  {
    id: "DEPOT012",
    name: "DEPOT HẢI PHÒNG",
    location: "Hải Phòng",
    address: "Cảng Hải Phòng, Đường Hoàng Văn Thụ, Quận Ngô Quyền, Hải Phòng",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80",
    containerCount: 567,
    capacity: 700,
    status: "active",
    province: "Hải Phòng"
  }
];

// GET /api/iContainerHub_Depot - Get all depots with optional filters
export const getDepots = async (req: Request, res: Response) => {
  try {
    const { province, search, status } = req.query;
    
    let filteredDepots = [...mockDepots];
    
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
      data: filteredDepots
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
    const { id } = req.params;
    const depot = mockDepots.find(d => d.id === id);
    
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
export const getDepotStatistics = async (req: Request, res: Response) => {
  try {
    const totalCapacity = mockDepots.reduce((sum, depot) => sum + depot.capacity, 0);
    const totalContainers = mockDepots.reduce((sum, depot) => sum + depot.containerCount, 0);
    const activeDepots = mockDepots.filter(depot => depot.status === 'active').length;
    const utilizationRate = Math.round((totalContainers / totalCapacity) * 100);
    
    const statistics = {
      totalCapacity,
      totalContainers,
      activeDepots,
      utilizationRate,
      totalDepots: mockDepots.length,
      availableSpace: totalCapacity - totalContainers
    };
    
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
export const getProvinces = async (req: Request, res: Response) => {
  try {
    const provinces = Array.from(new Set(mockDepots.map(depot => depot.province)));
    
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
    const newDepot: Depot = {
      id: `DEPOT${String(mockDepots.length + 1).padStart(3, '0')}`,
      ...req.body
    };
    
    mockDepots.push(newDepot);
    
    res.status(201).json({
      success: true,
      message: 'Depot created successfully',
      data: newDepot
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
    const { id } = req.params;
    const depotIndex = mockDepots.findIndex(d => d.id === id);
    
    if (depotIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Depot not found'
      });
    }
    
    mockDepots[depotIndex] = {
      ...mockDepots[depotIndex],
      ...req.body,
      id // Ensure ID doesn't change
    };
    
    res.json({
      success: true,
      message: 'Depot updated successfully',
      data: mockDepots[depotIndex]
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
export const deleteDepot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const depotIndex = mockDepots.findIndex(d => d.id === id);
    
    if (depotIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Depot not found'
      });
    }
    
    const deletedDepot = mockDepots.splice(depotIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'Depot deleted successfully',
      data: deletedDepot
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting depot',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

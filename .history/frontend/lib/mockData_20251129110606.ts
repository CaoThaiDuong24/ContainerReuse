// Mock Data for Cloud Yards - Depot Management

export interface Depot {
  id: string
  name: string
  location: string
  address: string
  image: string
  containerCount: number
  capacity: number
  status: 'active' | 'inactive'
  province: string
}

export const mockDepots: Depot[] = [
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
]

// Helper function to get depots by province
export const getDepotsByProvince = (province: string): Depot[] => {
  if (province === 'all') return mockDepots
  return mockDepots.filter(depot => depot.province === province)
}

// Helper function to search depots
export const searchDepots = (query: string): Depot[] => {
  const lowercaseQuery = query.toLowerCase()
  return mockDepots.filter(depot => 
    depot.name.toLowerCase().includes(lowercaseQuery) ||
    depot.address.toLowerCase().includes(lowercaseQuery) ||
    depot.location.toLowerCase().includes(lowercaseQuery)
  )
}

// Get all unique provinces
export const getAllProvinces = (): string[] => {
  return Array.from(new Set(mockDepots.map(depot => depot.province)))
}

// Get depot by ID
export const getDepotById = (id: string): Depot | undefined => {
  return mockDepots.find(depot => depot.id === id)
}

// Calculate total statistics
export const getDepotStatistics = () => {
  const totalCapacity = mockDepots.reduce((sum, depot) => sum + depot.capacity, 0)
  const totalContainers = mockDepots.reduce((sum, depot) => sum + depot.containerCount, 0)
  const activeDepots = mockDepots.filter(depot => depot.status === 'active').length
  const utilizationRate = Math.round((totalContainers / totalCapacity) * 100)
  
  return {
    totalCapacity,
    totalContainers,
    activeDepots,
    utilizationRate,
    totalDepots: mockDepots.length
  }
}

// Container Interface
export interface Container {
  id: string
  containerId: string
  size: '20ft' | '40ft' | '45ft'
  type: 'dry' | 'reefer' | 'opentop' | 'flatrack' | 'tank'
  status: 'available' | 'in-use' | 'maintenance' | 'reserved'
  depotId: string
  depotName: string
  owner: string
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  lastInspection: string
  inDate: string
  estimatedOutDate?: string
  currentLocation?: string
}

// Mock Containers Data
export const mockContainers: Container[] = [
  // Containers for DEPOT001 - LONG GIANG (127 containers)
  { id: "CNT001", containerId: "CSNU4567890", size: "40ft", type: "dry", status: "available", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "Maersk Line", condition: "excellent", lastInspection: "2024-11-15", inDate: "2024-11-10", currentLocation: "Block A-01" },
  { id: "CNT002", containerId: "MSCU3456789", size: "40ft", type: "dry", status: "in-use", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "MSC", condition: "good", lastInspection: "2024-11-12", inDate: "2024-11-05", estimatedOutDate: "2024-12-01", currentLocation: "Block A-02" },
  { id: "CNT003", containerId: "CMAU8765432", size: "20ft", type: "reefer", status: "available", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "CMA CGM", condition: "excellent", lastInspection: "2024-11-18", inDate: "2024-11-12", currentLocation: "Block B-01" },
  { id: "CNT004", containerId: "HLBU2345678", size: "40ft", type: "dry", status: "available", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "Hapag-Lloyd", condition: "good", lastInspection: "2024-11-10", inDate: "2024-11-01", currentLocation: "Block A-03" },
  { id: "CNT005", containerId: "OOLU9876543", size: "40ft", type: "opentop", status: "maintenance", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "OOCL", condition: "fair", lastInspection: "2024-11-08", inDate: "2024-10-28", currentLocation: "Workshop" },
  { id: "CNT031", containerId: "CSNU1234501", size: "20ft", type: "dry", status: "available", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "Maersk Line", condition: "excellent", lastInspection: "2024-11-22", inDate: "2024-11-15", currentLocation: "Block A-04" },
  { id: "CNT032", containerId: "MSCU2234502", size: "40ft", type: "dry", status: "available", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "MSC", condition: "good", lastInspection: "2024-11-20", inDate: "2024-11-12", currentLocation: "Block A-05" },
  { id: "CNT033", containerId: "CMAU3234503", size: "40ft", type: "reefer", status: "in-use", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "CMA CGM", condition: "excellent", lastInspection: "2024-11-19", inDate: "2024-11-10", estimatedOutDate: "2024-12-05", currentLocation: "Block B-02" },
  { id: "CNT034", containerId: "HLBU4234504", size: "20ft", type: "dry", status: "available", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "Hapag-Lloyd", condition: "good", lastInspection: "2024-11-18", inDate: "2024-11-08", currentLocation: "Block A-06" },
  { id: "CNT035", containerId: "OOLU5234505", size: "40ft", type: "dry", status: "reserved", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "OOCL", condition: "excellent", lastInspection: "2024-11-21", inDate: "2024-11-14", estimatedOutDate: "2024-12-01", currentLocation: "Block A-07" },
  { id: "CNT036", containerId: "YMLU6234506", size: "40ft", type: "dry", status: "available", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "Yang Ming", condition: "good", lastInspection: "2024-11-17", inDate: "2024-11-06", currentLocation: "Block A-08" },
  { id: "CNT037", containerId: "EISU7234507", size: "45ft", type: "dry", status: "available", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "Evergreen", condition: "excellent", lastInspection: "2024-11-23", inDate: "2024-11-16", currentLocation: "Block A-09" },
  { id: "CNT038", containerId: "KMTU8234508", size: "40ft", type: "reefer", status: "available", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "K-Line", condition: "excellent", lastInspection: "2024-11-16", inDate: "2024-11-05", currentLocation: "Block B-03" },
  { id: "CNT039", containerId: "ONEY9234509", size: "20ft", type: "dry", status: "in-use", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "ONE", condition: "good", lastInspection: "2024-11-15", inDate: "2024-11-03", estimatedOutDate: "2024-12-03", currentLocation: "Block A-10" },
  { id: "CNT040", containerId: "TCLU1234510", size: "40ft", type: "dry", status: "available", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "COSCO", condition: "good", lastInspection: "2024-11-14", inDate: "2024-11-02", currentLocation: "Block A-11" },
  { id: "CNT041", containerId: "ZIMU2234511", size: "40ft", type: "dry", status: "available", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "ZIM", condition: "excellent", lastInspection: "2024-11-24", inDate: "2024-11-18", currentLocation: "Block A-12" },
  { id: "CNT042", containerId: "TEMU3234512", size: "20ft", type: "dry", status: "available", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "APL", condition: "good", lastInspection: "2024-11-13", inDate: "2024-11-01", currentLocation: "Block A-13" },
  { id: "CNT043", containerId: "SUDU4234513", size: "40ft", type: "tank", status: "maintenance", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "Hamburg Sud", condition: "fair", lastInspection: "2024-11-12", inDate: "2024-10-30", currentLocation: "Workshop" },
  { id: "CNT044", containerId: "PILU5234514", size: "40ft", type: "dry", status: "available", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "PIL", condition: "excellent", lastInspection: "2024-11-25", inDate: "2024-11-19", currentLocation: "Block A-14" },
  { id: "CNT045", containerId: "WANU6234515", size: "40ft", type: "dry", status: "available", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "Wan Hai", condition: "good", lastInspection: "2024-11-11", inDate: "2024-10-29", currentLocation: "Block A-15" },
  { id: "CNT046", containerId: "CSNU7234516", size: "20ft", type: "reefer", status: "available", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "Maersk Line", condition: "excellent", lastInspection: "2024-11-26", inDate: "2024-11-20", currentLocation: "Block B-04" },
  { id: "CNT047", containerId: "MSCU8234517", size: "40ft", type: "dry", status: "in-use", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "MSC", condition: "good", lastInspection: "2024-11-10", inDate: "2024-10-28", estimatedOutDate: "2024-12-07", currentLocation: "Block A-16" },
  { id: "CNT048", containerId: "CMAU9234518", size: "40ft", type: "dry", status: "available", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "CMA CGM", condition: "excellent", lastInspection: "2024-11-27", inDate: "2024-11-21", currentLocation: "Block A-17" },
  { id: "CNT049", containerId: "HLBU1234519", size: "45ft", type: "dry", status: "available", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "Hapag-Lloyd", condition: "excellent", lastInspection: "2024-11-09", inDate: "2024-10-27", currentLocation: "Block A-18" },
  { id: "CNT050", containerId: "OOLU2234520", size: "40ft", type: "dry", status: "reserved", depotId: "DEPOT001", depotName: "LONG GIANG (TIỀN GIANG)", owner: "OOCL", condition: "good", lastInspection: "2024-11-28", inDate: "2024-11-22", estimatedOutDate: "2024-12-02", currentLocation: "Block A-19" },

  // Containers for DEPOT002 - DEPOT PHƯỚC ĐÔNG (284 containers)
  { id: "CNT006", containerId: "YMLU1234567", size: "40ft", type: "dry", status: "available", depotId: "DEPOT002", depotName: "DEPOT PHƯỚC ĐÔNG", owner: "Yang Ming", condition: "excellent", lastInspection: "2024-11-20", inDate: "2024-11-15", currentLocation: "Block C-01" },
  { id: "CNT007", containerId: "EISU8765432", size: "20ft", type: "dry", status: "available", depotId: "DEPOT002", depotName: "DEPOT PHƯỚC ĐÔNG", owner: "Evergreen", condition: "good", lastInspection: "2024-11-17", inDate: "2024-11-10", currentLocation: "Block C-02" },
  { id: "CNT008", containerId: "KMTU4567890", size: "40ft", type: "reefer", status: "in-use", depotId: "DEPOT002", depotName: "DEPOT PHƯỚC ĐÔNG", owner: "K-Line", condition: "excellent", lastInspection: "2024-11-14", inDate: "2024-11-08", estimatedOutDate: "2024-12-05", currentLocation: "Block D-01" },
  { id: "CNT009", containerId: "ONEY3456789", size: "40ft", type: "dry", status: "reserved", depotId: "DEPOT002", depotName: "DEPOT PHƯỚC ĐÔNG", owner: "ONE", condition: "good", lastInspection: "2024-11-16", inDate: "2024-11-12", estimatedOutDate: "2024-11-30", currentLocation: "Block C-03" },
  { id: "CNT010", containerId: "TCLU2345678", size: "45ft", type: "dry", status: "available", depotId: "DEPOT002", depotName: "DEPOT PHƯỚC ĐÔNG", owner: "COSCO", condition: "excellent", lastInspection: "2024-11-19", inDate: "2024-11-14", currentLocation: "Block E-01" },

  // Containers for DEPOT003 - DEPOT PHÚ MỸ (456 containers)
  { id: "CNT011", containerId: "ZIMU9876543", size: "40ft", type: "dry", status: "available", depotId: "DEPOT003", depotName: "DEPOT PHÚ MỸ", owner: "ZIM", condition: "good", lastInspection: "2024-11-21", inDate: "2024-11-16", currentLocation: "Block F-01" },
  { id: "CNT012", containerId: "TEMU8765432", size: "20ft", type: "dry", status: "available", depotId: "DEPOT003", depotName: "DEPOT PHÚ MỸ", owner: "APL", condition: "excellent", lastInspection: "2024-11-18", inDate: "2024-11-13", currentLocation: "Block F-02" },
  { id: "CNT013", containerId: "SUDU7654321", size: "40ft", type: "reefer", status: "in-use", depotId: "DEPOT003", depotName: "DEPOT PHÚ MỸ", owner: "Hamburg Sud", condition: "excellent", lastInspection: "2024-11-15", inDate: "2024-11-09", estimatedOutDate: "2024-12-10", currentLocation: "Block G-01" },
  { id: "CNT014", containerId: "PILU6543210", size: "40ft", type: "dry", status: "available", depotId: "DEPOT003", depotName: "DEPOT PHÚ MỸ", owner: "PIL", condition: "good", lastInspection: "2024-11-17", inDate: "2024-11-11", currentLocation: "Block F-03" },
  { id: "CNT015", containerId: "WANU5432109", size: "40ft", type: "opentop", status: "available", depotId: "DEPOT003", depotName: "DEPOT PHÚ MỸ", owner: "Wan Hai", condition: "good", lastInspection: "2024-11-19", inDate: "2024-11-14", currentLocation: "Block H-01" },

  // Containers for DEPOT004 - DEPOT CÁI MÉP (672 containers)
  { id: "CNT016", containerId: "CSNU1111111", size: "40ft", type: "dry", status: "available", depotId: "DEPOT004", depotName: "DEPOT CÁI MÉP", owner: "Maersk Line", condition: "excellent", lastInspection: "2024-11-22", inDate: "2024-11-17", currentLocation: "Block I-01" },
  { id: "CNT017", containerId: "MSCU2222222", size: "40ft", type: "dry", status: "in-use", depotId: "DEPOT004", depotName: "DEPOT CÁI MÉP", owner: "MSC", condition: "good", lastInspection: "2024-11-20", inDate: "2024-11-15", estimatedOutDate: "2024-12-08", currentLocation: "Block I-02" },
  { id: "CNT018", containerId: "CMAU3333333", size: "45ft", type: "dry", status: "available", depotId: "DEPOT004", depotName: "DEPOT CÁI MÉP", owner: "CMA CGM", condition: "excellent", lastInspection: "2024-11-19", inDate: "2024-11-14", currentLocation: "Block J-01" },
  { id: "CNT019", containerId: "HLBU4444444", size: "20ft", type: "reefer", status: "available", depotId: "DEPOT004", depotName: "DEPOT CÁI MÉP", owner: "Hapag-Lloyd", condition: "excellent", lastInspection: "2024-11-21", inDate: "2024-11-16", currentLocation: "Block K-01" },
  { id: "CNT020", containerId: "OOLU5555555", size: "40ft", type: "dry", status: "reserved", depotId: "DEPOT004", depotName: "DEPOT CÁI MÉP", owner: "OOCL", condition: "good", lastInspection: "2024-11-18", inDate: "2024-11-13", estimatedOutDate: "2024-12-02", currentLocation: "Block I-03" },

  // Containers for DEPOT005 - DEPOT BÌNH DƯƠNG (398 containers)
  { id: "CNT021", containerId: "YMLU6666666", size: "40ft", type: "dry", status: "available", depotId: "DEPOT005", depotName: "DEPOT BÌNH DƯƠNG", owner: "Yang Ming", condition: "good", lastInspection: "2024-11-23", inDate: "2024-11-18", currentLocation: "Block L-01" },
  { id: "CNT022", containerId: "EISU7777777", size: "40ft", type: "dry", status: "available", depotId: "DEPOT005", depotName: "DEPOT BÌNH DƯƠNG", owner: "Evergreen", condition: "excellent", lastInspection: "2024-11-20", inDate: "2024-11-15", currentLocation: "Block L-02" },
  { id: "CNT023", containerId: "KMTU8888888", size: "20ft", type: "dry", status: "in-use", depotId: "DEPOT005", depotName: "DEPOT BÌNH DƯƠNG", owner: "K-Line", condition: "good", lastInspection: "2024-11-17", inDate: "2024-11-12", estimatedOutDate: "2024-12-03", currentLocation: "Block L-03" },
  { id: "CNT024", containerId: "ONEY9999999", size: "40ft", type: "reefer", status: "available", depotId: "DEPOT005", depotName: "DEPOT BÌNH DƯƠNG", owner: "ONE", condition: "excellent", lastInspection: "2024-11-19", inDate: "2024-11-14", currentLocation: "Block M-01" },
  { id: "CNT025", containerId: "TCLU1010101", size: "40ft", type: "dry", status: "available", depotId: "DEPOT005", depotName: "DEPOT BÌNH DƯƠNG", owner: "COSCO", condition: "good", lastInspection: "2024-11-21", inDate: "2024-11-16", currentLocation: "Block L-04" },

  // Add sample containers for other depots
  { id: "CNT026", containerId: "ZIMU1212121", size: "40ft", type: "dry", status: "available", depotId: "DEPOT006", depotName: "DEPOT ĐỒNG NAI", owner: "ZIM", condition: "excellent", lastInspection: "2024-11-22", inDate: "2024-11-17", currentLocation: "Block N-01" },
  { id: "CNT027", containerId: "TEMU1313131", size: "45ft", type: "dry", status: "in-use", depotId: "DEPOT007", depotName: "DEPOT CÁT LÁI", owner: "APL", condition: "good", lastInspection: "2024-11-20", inDate: "2024-11-15", estimatedOutDate: "2024-12-12", currentLocation: "Block O-01" },
  { id: "CNT028", containerId: "SUDU1414141", size: "40ft", type: "reefer", status: "available", depotId: "DEPOT008", depotName: "DEPOT HIỆP PHƯỚC", owner: "Hamburg Sud", condition: "excellent", lastInspection: "2024-11-19", inDate: "2024-11-14", currentLocation: "Block P-01" },
  { id: "CNT029", containerId: "PILU1515151", size: "20ft", type: "dry", status: "available", depotId: "DEPOT009", depotName: "DEPOT TÂN CẢNG", owner: "PIL", condition: "good", lastInspection: "2024-11-21", inDate: "2024-11-16", currentLocation: "Block Q-01" },
  { id: "CNT030", containerId: "WANU1616161", size: "40ft", type: "dry", status: "reserved", depotId: "DEPOT010", depotName: "DEPOT LONG AN", owner: "Wan Hai", condition: "excellent", lastInspection: "2024-11-18", inDate: "2024-11-13", estimatedOutDate: "2024-12-01", currentLocation: "Block R-01" }
]

// Get containers by depot ID
export const getContainersByDepotId = (depotId: string): Container[] => {
  return mockContainers.filter(container => container.depotId === depotId)
}

// Get container statistics by depot
export const getContainerStatsByDepot = (depotId: string) => {
  const containers = getContainersByDepotId(depotId)
  const available = containers.filter(c => c.status === 'available').length
  const inUse = containers.filter(c => c.status === 'in-use').length
  const maintenance = containers.filter(c => c.status === 'maintenance').length
  const reserved = containers.filter(c => c.status === 'reserved').length
  
  return {
    total: containers.length,
    available,
    inUse,
    maintenance,
    reserved
  }
}

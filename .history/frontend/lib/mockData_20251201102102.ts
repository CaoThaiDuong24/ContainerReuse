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

export const mockDepots: Depot[] = []

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
  rawApiData?: {
    HangTauID: string
    ContTypeSizeID: string
    DepotID: string
  }
}

// Mock Containers Data - Gắn với depot ID từ API thực tế
export const mockContainers: Container[] = [
  // Containers for D001 - Depot Long Giang
  { id: "CNT001", containerId: "CSNU4567890", size: "40ft", type: "dry", status: "available", depotId: "D001", depotName: "Depot Long Giang", owner: "Maersk Line", condition: "excellent", lastInspection: "2024-11-15", inDate: "2024-11-10", currentLocation: "Block A-01" },
  { id: "CNT002", containerId: "MSCU3456789", size: "40ft", type: "dry", status: "in-use", depotId: "D001", depotName: "Depot Long Giang", owner: "MSC", condition: "good", lastInspection: "2024-11-12", inDate: "2024-11-05", estimatedOutDate: "2024-12-01", currentLocation: "Block A-02" },
  { id: "CNT003", containerId: "CMAU8765432", size: "20ft", type: "reefer", status: "available", depotId: "D001", depotName: "Depot Long Giang", owner: "CMA CGM", condition: "excellent", lastInspection: "2024-11-18", inDate: "2024-11-12", currentLocation: "Block B-01" },
  { id: "CNT004", containerId: "HLBU2345678", size: "40ft", type: "dry", status: "available", depotId: "D001", depotName: "Depot Long Giang", owner: "Hapag-Lloyd", condition: "good", lastInspection: "2024-11-10", inDate: "2024-11-01", currentLocation: "Block A-03" },
  { id: "CNT005", containerId: "OOLU9876543", size: "40ft", type: "opentop", status: "maintenance", depotId: "D001", depotName: "Depot Long Giang", owner: "OOCL", condition: "fair", lastInspection: "2024-11-08", inDate: "2024-10-28", currentLocation: "Workshop" },

  // Containers for D007 - Depot Phước Đông
  { id: "CNT006", containerId: "YMLU1234567", size: "40ft", type: "dry", status: "available", depotId: "D007", depotName: "Depot Phước Đông", owner: "Yang Ming", condition: "excellent", lastInspection: "2024-11-20", inDate: "2024-11-15", currentLocation: "Block C-01" },
  { id: "CNT007", containerId: "EISU8765432", size: "20ft", type: "dry", status: "available", depotId: "D007", depotName: "Depot Phước Đông", owner: "Evergreen", condition: "good", lastInspection: "2024-11-17", inDate: "2024-11-10", currentLocation: "Block C-02" },
  { id: "CNT008", containerId: "KMTU4567890", size: "40ft", type: "reefer", status: "in-use", depotId: "D007", depotName: "Depot Phước Đông", owner: "K-Line", condition: "excellent", lastInspection: "2024-11-14", inDate: "2024-11-08", estimatedOutDate: "2024-12-05", currentLocation: "Block D-01" },
  { id: "CNT009", containerId: "ONEY3456789", size: "40ft", type: "dry", status: "reserved", depotId: "D007", depotName: "Depot Phước Đông", owner: "ONE", condition: "good", lastInspection: "2024-11-16", inDate: "2024-11-12", estimatedOutDate: "2024-11-30", currentLocation: "Block C-03" },
  { id: "CNT010", containerId: "TCLU2345678", size: "45ft", type: "dry", status: "available", depotId: "D007", depotName: "Depot Phước Đông", owner: "COSCO", condition: "excellent", lastInspection: "2024-11-19", inDate: "2024-11-14", currentLocation: "Block E-01" },

  // Containers for D008 - Depot Phú Mỹ
  { id: "CNT011", containerId: "ZIMU9876543", size: "40ft", type: "dry", status: "available", depotId: "D008", depotName: "Depot Phú Mỹ", owner: "ZIM", condition: "good", lastInspection: "2024-11-21", inDate: "2024-11-16", currentLocation: "Block F-01" },
  { id: "CNT012", containerId: "TEMU8765432", size: "20ft", type: "dry", status: "available", depotId: "D008", depotName: "Depot Phú Mỹ", owner: "APL", condition: "excellent", lastInspection: "2024-11-18", inDate: "2024-11-13", currentLocation: "Block F-02" },
  { id: "CNT013", containerId: "SUDU7654321", size: "40ft", type: "reefer", status: "in-use", depotId: "D008", depotName: "Depot Phú Mỹ", owner: "Hamburg Sud", condition: "excellent", lastInspection: "2024-11-15", inDate: "2024-11-09", estimatedOutDate: "2024-12-10", currentLocation: "Block G-01" },
  { id: "CNT014", containerId: "PILU6543210", size: "40ft", type: "dry", status: "available", depotId: "D008", depotName: "Depot Phú Mỹ", owner: "PIL", condition: "good", lastInspection: "2024-11-17", inDate: "2024-11-11", currentLocation: "Block F-03" },
  { id: "CNT015", containerId: "WANU5432109", size: "40ft", type: "opentop", status: "available", depotId: "D008", depotName: "Depot Phú Mỹ", owner: "Wan Hai", condition: "good", lastInspection: "2024-11-19", inDate: "2024-11-14", currentLocation: "Block H-01" },

  // Containers for D009 - Depot Cái Mép
  { id: "CNT016", containerId: "CSNU1111111", size: "40ft", type: "dry", status: "available", depotId: "D009", depotName: "Depot Cái Mép", owner: "Maersk Line", condition: "excellent", lastInspection: "2024-11-22", inDate: "2024-11-17", currentLocation: "Block I-01" },
  { id: "CNT017", containerId: "MSCU2222222", size: "40ft", type: "dry", status: "in-use", depotId: "D009", depotName: "Depot Cái Mép", owner: "MSC", condition: "good", lastInspection: "2024-11-20", inDate: "2024-11-15", estimatedOutDate: "2024-12-08", currentLocation: "Block I-02" },
  { id: "CNT018", containerId: "CMAU3333333", size: "45ft", type: "dry", status: "available", depotId: "D009", depotName: "Depot Cái Mép", owner: "CMA CGM", condition: "excellent", lastInspection: "2024-11-19", inDate: "2024-11-14", currentLocation: "Block J-01" },
  { id: "CNT019", containerId: "HLBU4444444", size: "20ft", type: "reefer", status: "available", depotId: "D009", depotName: "Depot Cái Mép", owner: "Hapag-Lloyd", condition: "excellent", lastInspection: "2024-11-21", inDate: "2024-11-16", currentLocation: "Block K-01" },
  { id: "CNT020", containerId: "OOLU5555555", size: "40ft", type: "dry", status: "reserved", depotId: "D009", depotName: "Depot Cái Mép", owner: "OOCL", condition: "good", lastInspection: "2024-11-18", inDate: "2024-11-13", estimatedOutDate: "2024-12-02", currentLocation: "Block I-03" },

  // Containers for D010 - Depot Hiệp Phước
  { id: "CNT021", containerId: "YMLU6666666", size: "40ft", type: "dry", status: "available", depotId: "D010", depotName: "Depot Hiệp Phước", owner: "Yang Ming", condition: "good", lastInspection: "2024-11-23", inDate: "2024-11-18", currentLocation: "Block L-01" },
  { id: "CNT022", containerId: "EISU7777777", size: "40ft", type: "dry", status: "available", depotId: "D010", depotName: "Depot Hiệp Phước", owner: "Evergreen", condition: "excellent", lastInspection: "2024-11-20", inDate: "2024-11-15", currentLocation: "Block L-02" },
  { id: "CNT023", containerId: "KMTU8888888", size: "20ft", type: "dry", status: "in-use", depotId: "D010", depotName: "Depot Hiệp Phước", owner: "K-Line", condition: "good", lastInspection: "2024-11-17", inDate: "2024-11-12", estimatedOutDate: "2024-12-03", currentLocation: "Block L-03" },
  { id: "CNT024", containerId: "ONEY9999999", size: "40ft", type: "reefer", status: "available", depotId: "D010", depotName: "Depot Hiệp Phước", owner: "ONE", condition: "excellent", lastInspection: "2024-11-19", inDate: "2024-11-14", currentLocation: "Block M-01" },
  { id: "CNT025", containerId: "TCLU1010101", size: "40ft", type: "dry", status: "available", depotId: "D010", depotName: "Depot Hiệp Phước", owner: "COSCO", condition: "good", lastInspection: "2024-11-21", inDate: "2024-11-16", currentLocation: "Block L-04" },

  // Containers for D013 - Depot Bình Dương
  { id: "CNT026", containerId: "ZIMU1212121", size: "40ft", type: "dry", status: "available", depotId: "D013", depotName: "Depot Bình Dương", owner: "ZIM", condition: "excellent", lastInspection: "2024-11-22", inDate: "2024-11-17", currentLocation: "Block N-01" },
  { id: "CNT027", containerId: "TEMU1313131", size: "45ft", type: "dry", status: "in-use", depotId: "D013", depotName: "Depot Bình Dương", owner: "APL", condition: "good", lastInspection: "2024-11-20", inDate: "2024-11-15", estimatedOutDate: "2024-12-12", currentLocation: "Block O-01" },
  { id: "CNT028", containerId: "SUDU1414141", size: "40ft", type: "reefer", status: "available", depotId: "D013", depotName: "Depot Bình Dương", owner: "Hamburg Sud", condition: "excellent", lastInspection: "2024-11-19", inDate: "2024-11-14", currentLocation: "Block P-01" },
  { id: "CNT029", containerId: "PILU1515151", size: "20ft", type: "dry", status: "available", depotId: "D013", depotName: "Depot Bình Dương", owner: "PIL", condition: "good", lastInspection: "2024-11-21", inDate: "2024-11-16", currentLocation: "Block Q-01" },
  { id: "CNT030", containerId: "WANU1616161", size: "40ft", type: "dry", status: "reserved", depotId: "D013", depotName: "Depot Bình Dương", owner: "Wan Hai", condition: "excellent", lastInspection: "2024-11-18", inDate: "2024-11-13", estimatedOutDate: "2024-12-01", currentLocation: "Block R-01" },

  // Containers for D014 - Depot Đồng Nai
  { id: "CNT031", containerId: "CSNU2234521", size: "40ft", type: "dry", status: "available", depotId: "D014", depotName: "Depot Đồng Nai", owner: "Maersk Line", condition: "excellent", lastInspection: "2024-11-24", inDate: "2024-11-19", currentLocation: "Block S-01" },
  { id: "CNT032", containerId: "MSCU3234522", size: "20ft", type: "dry", status: "in-use", depotId: "D014", depotName: "Depot Đồng Nai", owner: "MSC", condition: "good", lastInspection: "2024-11-21", inDate: "2024-11-16", estimatedOutDate: "2024-12-06", currentLocation: "Block S-02" },
  { id: "CNT033", containerId: "CMAU4234523", size: "40ft", type: "dry", status: "available", depotId: "D014", depotName: "Depot Đồng Nai", owner: "CMA CGM", condition: "excellent", lastInspection: "2024-11-20", inDate: "2024-11-15", currentLocation: "Block S-03" },

  // Containers for D015 - Depot Long An
  { id: "CNT034", containerId: "HLBU5234524", size: "40ft", type: "dry", status: "available", depotId: "D015", depotName: "Depot Long An", owner: "Hapag-Lloyd", condition: "good", lastInspection: "2024-11-19", inDate: "2024-11-14", currentLocation: "Block T-01" },
  { id: "CNT035", containerId: "OOLU6234525", size: "45ft", type: "dry", status: "reserved", depotId: "D015", depotName: "Depot Long An", owner: "OOCL", condition: "excellent", lastInspection: "2024-11-22", inDate: "2024-11-17", estimatedOutDate: "2024-12-05", currentLocation: "Block T-02" },

  // Containers for D022 - LLC (Linh Xuân Logistics Center)
  { id: "CNT036", containerId: "YMLU7234526", size: "40ft", type: "dry", status: "available", depotId: "D022", depotName: "Linh Xuân Logistics Center (LLC)", owner: "Yang Ming", condition: "excellent", lastInspection: "2024-11-25", inDate: "2024-11-20", currentLocation: "Block U-01" },
  { id: "CNT037", containerId: "EISU8234527", size: "20ft", type: "reefer", status: "available", depotId: "D022", depotName: "Linh Xuân Logistics Center (LLC)", owner: "Evergreen", condition: "good", lastInspection: "2024-11-23", inDate: "2024-11-18", currentLocation: "Block U-02" },
  { id: "CNT038", containerId: "KMTU9234528", size: "40ft", type: "dry", status: "in-use", depotId: "D022", depotName: "Linh Xuân Logistics Center (LLC)", owner: "K-Line", condition: "excellent", lastInspection: "2024-11-21", inDate: "2024-11-16", estimatedOutDate: "2024-12-10", currentLocation: "Block U-03" },

  // Containers for D023 - SLD (Suối Tiên Long Thạnh Mỹ)
  { id: "CNT039", containerId: "ONEY1234529", size: "40ft", type: "dry", status: "available", depotId: "D023", depotName: "Suối Tiên Long Thạnh Mỹ", owner: "ONE", condition: "good", lastInspection: "2024-11-20", inDate: "2024-11-15", currentLocation: "Block V-01" },
  { id: "CNT040", containerId: "TCLU2234530", size: "40ft", type: "dry", status: "available", depotId: "D023", depotName: "Suối Tiên Long Thạnh Mỹ", owner: "COSCO", condition: "excellent", lastInspection: "2024-11-24", inDate: "2024-11-19", currentLocation: "Block V-02" },
  { id: "CNT041", containerId: "ZIMU3234531", size: "20ft", type: "dry", status: "maintenance", depotId: "D023", depotName: "Suối Tiên Long Thạnh Mỹ", owner: "ZIM", condition: "fair", lastInspection: "2024-11-18", inDate: "2024-11-13", currentLocation: "Workshop" },

  // Containers for D024 - CPD (Chân Thật Phú Thuận Depot)
  { id: "CNT042", containerId: "TEMU4234532", size: "40ft", type: "dry", status: "available", depotId: "D024", depotName: "Chân Thật Phú Thuận Depot", owner: "APL", condition: "excellent", lastInspection: "2024-11-26", inDate: "2024-11-21", currentLocation: "Block W-01" },
  { id: "CNT043", containerId: "SUDU5234533", size: "40ft", type: "reefer", status: "in-use", depotId: "D024", depotName: "Chân Thật Phú Thuận Depot", owner: "Hamburg Sud", condition: "good", lastInspection: "2024-11-22", inDate: "2024-11-17", estimatedOutDate: "2024-12-08", currentLocation: "Block W-02" },
  { id: "CNT044", containerId: "PILU6234534", size: "45ft", type: "dry", status: "available", depotId: "D024", depotName: "Chân Thật Phú Thuận Depot", owner: "PIL", condition: "excellent", lastInspection: "2024-11-25", inDate: "2024-11-20", currentLocation: "Block W-03" },
  { id: "CNT045", containerId: "WANU7234535", size: "40ft", type: "dry", status: "reserved", depotId: "D024", depotName: "Chân Thật Phú Thuận Depot", owner: "Wan Hai", condition: "good", lastInspection: "2024-11-23", inDate: "2024-11-18", estimatedOutDate: "2024-12-04", currentLocation: "Block W-04" }
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

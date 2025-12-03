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

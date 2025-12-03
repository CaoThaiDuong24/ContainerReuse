"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Search,
  Plus,
  MapPin,
  Download,
  Upload,
  Warehouse,
  ArrowDownUp
} from "lucide-react"

// Types
interface Depot {
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

export default function ContainersPage() {
  const [selectedDepot, setSelectedDepot] = useState<Depot | null>(null)
  const [showDepotDetail, setShowDepotDetail] = useState(false)
  const [showAddDepot, setShowAddDepot] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterProvince, setFilterProvince] = useState('all')

  // Mock depots data
  const depots: Depot[] = [
    {
      id: "DEPOT001",
      name: "LONG GIANG (TIỀN GIANG)",
      location: "Long Giang",
      address: "ấp 7, Xã Tâm Hiệp, Huyện Châu Thành, Tỉnh Tiền Giang ( cách chân cầu cao tốc 500m, cách KCN Long...",
      image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&q=80",
      containerCount: 0,
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
      containerCount: 0,
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
      containerCount: 0,
      capacity: 600,
      status: "active",
      province: "Bà Rịa - Vũng Tàu"
    },
    {
      id: "DEPOT004",
      name: "DEPOT CÁI MÉP",
      location: "Cái Mép",
      address: "KCN Cái Mép, Phường Phước Hòa, Thị Xã Phú Mỹ, Bà Rịa - Vũng Tàu",
      image: "https://images.unsplash.com/photo-1605745341075-2c0a57d8e9b7?w=800&q=80",
      containerCount: 0,
      capacity: 800,
      status: "active",
      province: "Bà Rịa - Vũng Tàu"
    },
    {
      id: "DEPOT005",
      name: "DEPOT BÌNH DƯƠNG",
      location: "Bình Dương",
      address: "KCN Việt Nam - Singapore, Thuận An, Bình Dương",
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80",
      containerCount: 0,
      capacity: 550,
      status: "active",
      province: "Bình Dương"
    },
    {
      id: "DEPOT006",
      name: "DEPOT ĐỒNG NAI",
      location: "Đồng Nai",
      address: "KCN Biên Hòa 2, Biên Hòa, Đồng Nai",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
      containerCount: 0,
      capacity: 700,
      status: "active",
      province: "Đồng Nai"
    }
  ]

  const filteredDepots = depots.filter(depot => {
    const matchesSearch = depot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          depot.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProvince = filterProvince === 'all' || depot.province === filterProvince
    return matchesSearch && matchesProvince
  })

  const totalCapacity = depots.reduce((sum, depot) => sum + depot.capacity, 0)
  const totalContainers = depots.reduce((sum, depot) => sum + depot.containerCount, 0)
  const activeDepots = depots.filter(d => d.status === 'active').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cloud Yards - Depot Management</h1>
          <p className="text-muted-foreground mt-1">Quản lý bãi lưu trữ container tạm thời</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowGateOut(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Gate Out
          </Button>
          <Button onClick={() => setShowGateIn(true)}>
            <Download className="h-4 w-4 mr-2" />
            Gate In
          </Button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sức chứa bãi</CardTitle>
            <Box className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateUtilization()}%</div>
            <p className="text-xs text-muted-foreground">{yardConfig.occupiedSlots}/{yardConfig.totalSlots} slots</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gate In hôm nay</CardTitle>
            <Download className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gateInToday}</div>
            <p className="text-xs text-muted-foreground">containers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gate Out hôm nay</CardTitle>
            <Upload className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gateOutToday}</div>
            <p className="text-xs text-muted-foreground">containers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tồn lâu</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{longStanding}</div>
            <p className="text-xs text-muted-foreground">&gt;15 ngày</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cần bảo trì</CardTitle>
            <Wrench className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{needsMaintenance}</div>
            <p className="text-xs text-muted-foreground">containers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reefer hoạt động</CardTitle>
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeReefers}</div>
            <p className="text-xs text-muted-foreground">đang cắm điện</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Filters */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bộ lọc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Trạng thái</Label>
                <div className="space-y-2">
                  {['empty', 'laden', 'reserved', 'damaged', 'available'].map(status => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox 
                        id={status}
                        checked={filterStatus.includes(status)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilterStatus([...filterStatus, status])
                          } else {
                            setFilterStatus(filterStatus.filter(s => s !== status))
                          }
                        }}
                      />
                      <label htmlFor={status} className="text-sm capitalize cursor-pointer">
                        {status === 'empty' && '🟩 Rỗng (Empty)'}
                        {status === 'laden' && '🟦 Có hàng (Laden)'}
                        {status === 'reserved' && '🟨 Đã đặt (Reserved)'}
                        {status === 'damaged' && '🟥 Hư hỏng (Damaged)'}
                        {status === 'available' && '⬜ Sẵn sàng (Available)'}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Loại Container</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="20ft">20ft</SelectItem>
                    <SelectItem value="40ft">40ft</SelectItem>
                    <SelectItem value="45ft">45ft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Danh mục</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="dry">Dry</SelectItem>
                    <SelectItem value="reefer">Reefer</SelectItem>
                    <SelectItem value="opentop">Open Top</SelectItem>
                    <SelectItem value="flatrack">Flat Rack</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Hãng tàu</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="cosco">COSCO</SelectItem>
                    <SelectItem value="maersk">Maersk</SelectItem>
                    <SelectItem value="cma">CMA CGM</SelectItem>
                    <SelectItem value="hapag">Hapag Lloyd</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" className="w-full" onClick={() => setFilterStatus([])}>
                Xóa bộ lọc
              </Button>
            </CardContent>
          </Card>

          {/* Yard Utilization Chart */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Sức chứa bãi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - calculateUtilization() / 100)}`}
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{calculateUtilization()}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Đã sử dụng:</span>
                  <span className="font-medium">{yardConfig.occupiedSlots}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Còn trống:</span>
                  <span className="font-medium">{yardConfig.totalSlots - yardConfig.occupiedSlots}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tổng slots:</span>
                  <span className="font-medium">{yardConfig.totalSlots}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main View Area */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Tìm theo số container, booking no..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'map' | 'list')} className="ml-4">
                  <TabsList>
                    <TabsTrigger value="map" className="gap-2">
                      <Grid3x3 className="h-4 w-4" />
                      Sơ đồ bãi
                    </TabsTrigger>
                    <TabsTrigger value="list" className="gap-2">
                      <List className="h-4 w-4" />
                      Danh sách
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'map' ? (
                <div className="space-y-6">
                  {yardConfig.zones.map(zone => (
                    <div key={zone} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">Zone {zone}</h3>
                      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${yardConfig.rowsPerZone}, minmax(0, 1fr))` }}>
                        {Array.from({ length: yardConfig.rowsPerZone }, (_, rowIndex) => {
                          const row = rowIndex + 1
                          return (
                            <div key={row} className="space-y-1">
                              <div className="text-xs text-center font-medium text-muted-foreground mb-1">
                                Row {row}
                              </div>
                              <div className="flex flex-col gap-1">
                                {Array.from({ length: yardConfig.tiersPerRow }, (_, tierIndex) => {
                                  const tier = tierIndex + 1
                                  const slot = yardSlots.find(s => s.zone === zone && s.row === row && s.tier === tier)
                                  const container = slot?.containerId ? containers.find(c => c.id === slot.containerId) : null
                                  
                                  return (
                                    <div
                                      key={tier}
                                      className={`h-8 rounded cursor-pointer transition-all hover:ring-2 hover:ring-primary ${getStatusColor(slot?.status || 'available')} ${container ? 'hover:scale-105' : ''}`}
                                      title={container ? `${container.id} - ${container.category} - ${container.dwellDays} days` : `${zone}-${row}-${tier} Empty`}
                                      onClick={() => container && setSelectedContainer(container)}
                                    >
                                      {container && (
                                        <div className="h-full flex items-center justify-center text-white text-[10px] font-medium px-1">
                                          {container.isReefer && <Zap className="h-3 w-3" />}
                                          {container.needsRepair && <Wrench className="h-3 w-3" />}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                  
                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span>Rỗng (Empty)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span>Có hàng (Laden)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span>Đã đặt (Reserved)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span>Hư hỏng (Damaged)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      <span>Trống (Empty Slot)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Container ID</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Loại</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Trạng thái</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Vị trí</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Ngày vào</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Số ngày</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Phí lưu bãi</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContainers.map((container) => (
                        <tr 
                          key={container.id} 
                          className="border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedContainer(container)}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="font-medium text-gray-900">{container.id}</div>
                                <div className="text-xs text-muted-foreground">{container.owner}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              <div>{container.type}</div>
                              <div className="text-xs text-muted-foreground">{container.category}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusBadge(container.status)} variant="outline">
                              {container.status}
                            </Badge>
                            <div className="flex gap-1 mt-1">
                              {container.isReefer && (
                                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                                  <Zap className="h-3 w-3 mr-1" />
                                  Reefer
                                </Badge>
                              )}
                              {container.needsRepair && (
                                <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                                  <Wrench className="h-3 w-3 mr-1" />
                                  Repair
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {container.position ? (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                {container.position.zone}-{container.position.row}-{container.position.tier}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              {container.gateInDate}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className={container.dwellDays > 15 ? 'text-orange-600 font-semibold' : ''}>
                                {container.dwellDays} ngày
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              {container.storageFee.toLocaleString('vi-VN')}đ
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedContainer(container) }}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Move className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Container Details Sheet */}
      {selectedContainer && (
        <Sheet open={!!selectedContainer} onOpenChange={() => setSelectedContainer(null)}>
          <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Chi tiết Container</SheetTitle>
              <SheetDescription>
                Thông tin và lịch sử container {selectedContainer.id}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Thông tin cơ bản</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Container ID:</span>
                    <p className="font-medium">{selectedContainer.id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Hãng tàu:</span>
                    <p className="font-medium">{selectedContainer.owner}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Loại:</span>
                    <p className="font-medium">{selectedContainer.type} {selectedContainer.category}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Trạng thái:</span>
                    <Badge className={getStatusBadge(selectedContainer.status)} variant="outline">
                      {selectedContainer.status}
                    </Badge>
                  </div>
                  {selectedContainer.position && (
                    <div>
                      <span className="text-muted-foreground">Vị trí:</span>
                      <p className="font-medium">
                        Zone {selectedContainer.position.zone} - Row {selectedContainer.position.row} - Tier {selectedContainer.position.tier}
                      </p>
                    </div>
                  )}
                  {selectedContainer.bookingNo && (
                    <div>
                      <span className="text-muted-foreground">Booking No:</span>
                      <p className="font-medium">{selectedContainer.bookingNo}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Gate Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Thông tin nhập bãi</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Ngày vào:</span>
                    <p className="font-medium">{selectedContainer.gateInDate}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Số ngày lưu:</span>
                    <p className={`font-medium ${selectedContainer.dwellDays > 15 ? 'text-orange-600' : ''}`}>
                      {selectedContainer.dwellDays} ngày
                    </p>
                  </div>
                  {selectedContainer.truckPlate && (
                    <>
                      <div>
                        <span className="text-muted-foreground">Biển số xe:</span>
                        <p className="font-medium">{selectedContainer.truckPlate}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tài xế:</span>
                        <p className="font-medium">{selectedContainer.driver}</p>
                      </div>
                    </>
                  )}
                  <div>
                    <span className="text-muted-foreground">Tình trạng vỏ:</span>
                    <p className="font-medium capitalize">{selectedContainer.condition}</p>
                  </div>
                </div>
              </div>

              {/* Services & Fees */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Dịch vụ & Phí</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phí lưu bãi:</span>
                    <span className="font-medium">{selectedContainer.storageFee.toLocaleString('vi-VN')}đ</span>
                  </div>
                  {selectedContainer.isReefer && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">PTI (Cắm điện):</span>
                      <span className="font-medium">
                        {selectedContainer.pluggedIn ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">Đang hoạt động</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700">Không</Badge>
                        )}
                      </span>
                    </div>
                  )}
                  {selectedContainer.needsRepair && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sửa chữa:</span>
                      <Badge variant="outline" className="bg-red-50 text-red-700">Cần sửa chữa</Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button className="w-full" onClick={() => setShowGateOut(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Tạo lệnh xuất bãi
                </Button>
                <Button variant="outline" className="w-full">
                  <Move className="h-4 w-4 mr-2" />
                  Di chuyển vị trí
                </Button>
                <Button variant="outline" className="w-full">
                  <Wrench className="h-4 w-4 mr-2" />
                  Báo cáo hư hỏng
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Gate In Dialog */}
      <Sheet open={showGateIn} onOpenChange={setShowGateIn}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Gate In - Nhập bãi Container</SheetTitle>
            <SheetDescription>
              Ghi nhận container mới vào bãi lưu trữ
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="containerId">Số Container *</Label>
              <Input id="containerId" placeholder="CSNU4567890" />
              <p className="text-xs text-muted-foreground">Check digit sẽ được tự động kiểm tra</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="containerType">Loại Container *</Label>
                <Select>
                  <SelectTrigger id="containerType">
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20ft">20ft</SelectItem>
                    <SelectItem value="40ft">40ft</SelectItem>
                    <SelectItem value="45ft">45ft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Danh mục *</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dry">Dry</SelectItem>
                    <SelectItem value="reefer">Reefer</SelectItem>
                    <SelectItem value="opentop">Open Top</SelectItem>
                    <SelectItem value="flatrack">Flat Rack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="owner">Hãng tàu *</Label>
              <Select>
                <SelectTrigger id="owner">
                  <SelectValue placeholder="Chọn hãng tàu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cosco">COSCO</SelectItem>
                  <SelectItem value="maersk">Maersk</SelectItem>
                  <SelectItem value="cma">CMA CGM</SelectItem>
                  <SelectItem value="hapag">Hapag Lloyd</SelectItem>
                  <SelectItem value="oocl">OOCL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="truckPlate">Biển số xe *</Label>
                <Input id="truckPlate" placeholder="51C-123.45" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="driver">Tài xế *</Label>
                <Input id="driver" placeholder="Nguyễn Văn A" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Tình trạng vỏ (EIR) *</Label>
              <Select>
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Chọn tình trạng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clean">Sạch (Clean)</SelectItem>
                  <SelectItem value="dirty">Bẩn (Dirty)</SelectItem>
                  <SelectItem value="damaged">Hư hỏng (Damaged)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Vị trí đỗ (Gợi ý tự động)</Label>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Zone A" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Zone A</SelectItem>
                    <SelectItem value="b">Zone B</SelectItem>
                    <SelectItem value="c">Zone C</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Row" className="w-20" />
                <Input placeholder="Tier" className="w-20" />
              </div>
              <p className="text-xs text-muted-foreground">💡 Gợi ý: A-3-1 (Gần cổng, dễ xuất)</p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="reefer" />
              <label htmlFor="reefer" className="text-sm font-medium">
                Container Reefer (cần cắm điện)
              </label>
            </div>

            <div className="space-y-2">
              <Label>Ảnh chụp container (EIR Digital)</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Tải ảnh lên
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Chụp 4 góc container</p>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1" onClick={() => setShowGateIn(false)}>
                <Download className="h-4 w-4 mr-2" />
                Xác nhận Gate In
              </Button>
              <Button variant="outline" onClick={() => setShowGateIn(false)}>
                Hủy
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Gate Out Dialog */}
      <Sheet open={showGateOut} onOpenChange={setShowGateOut}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Gate Out - Xuất bãi Container</SheetTitle>
            <SheetDescription>
              Tạo lệnh xuất container khỏi bãi
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="searchContainer">Tìm kiếm Container *</Label>
              <Input id="searchContainer" placeholder="Nhập số container hoặc booking no" />
            </div>

            {selectedContainer && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Container:</span>
                      <span className="font-medium">{selectedContainer.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vị trí:</span>
                      <span className="font-medium">
                        {selectedContainer.position && `${selectedContainer.position.zone}-${selectedContainer.position.row}-${selectedContainer.position.tier}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Số ngày lưu:</span>
                      <span className="font-medium">{selectedContainer.dwellDays} ngày</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phí lưu bãi:</span>
                      <span className="font-semibold text-green-600">
                        {selectedContainer.storageFee.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="outTruckPlate">Biển số xe *</Label>
                <Input id="outTruckPlate" placeholder="51C-123.45" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outDriver">Tài xế *</Label>
                <Input id="outDriver" placeholder="Nguyễn Văn B" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Điểm đến</Label>
              <Input id="destination" placeholder="Cảng Cát Lái" />
            </div>

            <div className="space-y-2">
              <Label>Thanh toán phí lưu bãi</Label>
              <div className="flex items-center space-x-2">
                <Checkbox id="paid" />
                <label htmlFor="paid" className="text-sm font-medium">
                  Đã thanh toán {selectedContainer?.storageFee.toLocaleString('vi-VN')}đ
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ảnh chụp container (EIR Out)</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Tải ảnh lên
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Ghi nhận tình trạng khi xuất</p>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1" onClick={() => setShowGateOut(false)}>
                <Upload className="h-4 w-4 mr-2" />
                Xác nhận Gate Out
              </Button>
              <Button variant="outline" onClick={() => setShowGateOut(false)}>
                Hủy
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

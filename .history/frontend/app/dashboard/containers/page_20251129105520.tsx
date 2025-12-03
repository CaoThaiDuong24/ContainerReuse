"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Search,
  Plus,
  MapPin,
  Download,
  Upload,
  Warehouse,
  AlertCircle,
  Eye
} from "lucide-react"

// Depot Interface
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

interface ApiResponse {
  success: boolean
  count: number
  data: Depot[]
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function ContainersPage() {
  const router = useRouter()
  const [selectedDepot, setSelectedDepot] = useState<Depot | null>(null)
  const [showAddDepot, setShowAddDepot] = useState(false)
  const [showPickupForm, setShowPickupForm] = useState(false)
  const [showDropoffForm, setShowDropoffForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterProvince, setFilterProvince] = useState('all')
  
  // API states
  const [depots, setDepots] = useState<Depot[]>([])
  const [provinces, setProvinces] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch depots from API
  useEffect(() => {
    fetchDepots()
    fetchProvinces()
  }, [])

  const fetchDepots = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('Fetching depots from:', `${API_BASE_URL}/api/iContainerHub_Depot`)
      
      const response = await fetch(`${API_BASE_URL}/api/iContainerHub_Depot`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result: ApiResponse = await response.json()
      console.log('Depot data received:', result)
      
      if (result.success && result.data) {
        setDepots(result.data)
        console.log('Depots set successfully:', result.data.length, 'depots')
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Error fetching depots:', err)
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu depot')
    } finally {
      setLoading(false)
    }
  }

  const fetchProvinces = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/iContainerHub_Depot/provinces`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success && result.data) {
        setProvinces(result.data)
      }
    } catch (err) {
      console.error('Error fetching provinces:', err)
    }
  }

  // Filter depots based on search and province
  const filteredDepots = depots.filter(depot => {
    const matchesSearch = depot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          depot.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProvince = filterProvince === 'all' || depot.province === filterProvince
    return matchesSearch && matchesProvince
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Cloud Yards</h1>
        <p className="text-muted-foreground text-lg">Depot lưu trữ Container tạm thời</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4"
              onClick={fetchDepots}
            >
              Thử lại
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm depot theo tên hoặc địa chỉ..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filterProvince} onValueChange={setFilterProvince}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Lọc theo tỉnh" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả tỉnh</SelectItem>
              {provinces.map(province => (
                <SelectItem key={province} value={province}>{province}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={() => setShowAddDepot(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm Depot
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner className="h-12 w-12 mb-4" />
          <p className="text-muted-foreground">Đang tải dữ liệu depot...</p>
        </div>
      ) : (
        <>
          {/* Depots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepots.map((depot) => (
              <Card key={depot.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Depot Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img 
                    src={depot.image} 
                    alt={depot.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-green-500 text-white">
                      {depot.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  {/* Depot Name */}
                  <div>
                    <h3 className="font-bold text-lg mb-2">{depot.name}</h3>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p className="line-clamp-2">{depot.address}</p>
                    </div>
                  </div>

                  {/* Province & ID */}
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        📍 {depot.province}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ID: {depot.id}
                      </Badge>
                    </div>
                  </div>

                  {/* Container Count & Capacity */}
                  <div className="space-y-3 pt-2 border-t">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Số lượng Container:</span>
                      <span className="font-semibold">
                        {depot.containerCount} / {depot.capacity || 'N/A'}
                      </span>
                    </div>
                    
                    {/* Utilization Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Tỷ lệ sử dụng</span>
                        <span>{utilizationRate.toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={utilizationRate} 
                        className="h-2"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleContainerAction(depot.id, 'pickup')}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Lấy container
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleContainerAction(depot.id, 'dropoff')}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Hạ container
                    </Button>
                  </div>

                  {/* View Containers Button */}
                  <div>
                    <Button 
                      className="w-full" 
                      variant="default"
                      onClick={() => router.push(`/dashboard/containers/${depot.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Xem danh sách container
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Summary */}
          {!loading && filteredDepots.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Tổng số Depot</p>
                <p className="text-2xl font-bold text-primary">{filteredDepots.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Tổng Container</p>
                <p className="text-2xl font-bold text-primary">
                  {filteredDepots.reduce((sum, d) => sum + d.containerCount, 0)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Tổng Capacity</p>
                <p className="text-2xl font-bold text-primary">
                  {filteredDepots.reduce((sum, d) => sum + d.capacity, 0)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Tỷ lệ sử dụng TB</p>
                <p className="text-2xl font-bold text-primary">
                  {Math.round(
                    (filteredDepots.reduce((sum, d) => sum + d.containerCount, 0) / 
                    filteredDepots.reduce((sum, d) => sum + d.capacity, 0)) * 100
                  )}%
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredDepots.length === 0 && !loading && (
            <div className="text-center py-12">
              <Warehouse className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Không tìm thấy depot</h3>
              <p className="text-muted-foreground">
                Không có depot nào phù hợp với tiêu chí tìm kiếm của bạn.
              </p>
            </div>
          )}
        </>
      )}

      {/* Pickup Form Sheet */}
      <Sheet open={showPickupForm} onOpenChange={setShowPickupForm}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Đăng ký lấy Container</SheetTitle>
            <SheetDescription>
              {selectedDepot && `Depot: ${selectedDepot.name}`}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pickupContainerId">Số Container *</Label>
              <Input id="pickupContainerId" placeholder="CSNU4567890" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupContainerSize">Kích thước *</Label>
                <Select>
                  <SelectTrigger id="pickupContainerSize">
                    <SelectValue placeholder="Chọn kích thước" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20ft">20ft</SelectItem>
                    <SelectItem value="40ft">40ft</SelectItem>
                    <SelectItem value="45ft">45ft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupContainerType">Loại *</Label>
                <Select>
                  <SelectTrigger id="pickupContainerType">
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dry">Dry</SelectItem>
                    <SelectItem value="reefer">Reefer</SelectItem>
                    <SelectItem value="opentop">Open Top</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupDate">Ngày dự kiến lấy *</Label>
              <Input id="pickupDate" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupTruck">Biển số xe *</Label>
              <Input id="pickupTruck" placeholder="51C-123.45" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupDriver">Tên tài xế *</Label>
              <Input id="pickupDriver" placeholder="Nguyễn Văn A" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupDriverPhone">Số điện thoại tài xế *</Label>
              <Input id="pickupDriverPhone" placeholder="0901234567" type="tel" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupNote">Ghi chú</Label>
              <Input id="pickupNote" placeholder="Thông tin bổ sung (nếu có)" />
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1" onClick={() => setShowPickupForm(false)}>
                <Download className="h-4 w-4 mr-2" />
                Xác nhận đăng ký
              </Button>
              <Button variant="outline" onClick={() => setShowPickupForm(false)}>
                Hủy
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Dropoff Form Sheet */}
      <Sheet open={showDropoffForm} onOpenChange={setShowDropoffForm}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Đăng ký hạ Container</SheetTitle>
            <SheetDescription>
              {selectedDepot && `Depot: ${selectedDepot.name}`}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dropoffContainerId">Số Container *</Label>
              <Input id="dropoffContainerId" placeholder="CSNU4567890" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dropoffContainerSize">Kích thước *</Label>
                <Select>
                  <SelectTrigger id="dropoffContainerSize">
                    <SelectValue placeholder="Chọn kích thước" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20ft">20ft</SelectItem>
                    <SelectItem value="40ft">40ft</SelectItem>
                    <SelectItem value="45ft">45ft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dropoffContainerType">Loại *</Label>
                <Select>
                  <SelectTrigger id="dropoffContainerType">
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dry">Dry</SelectItem>
                    <SelectItem value="reefer">Reefer</SelectItem>
                    <SelectItem value="opentop">Open Top</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dropoffCondition">Tình trạng container *</Label>
              <Select>
                <SelectTrigger id="dropoffCondition">
                  <SelectValue placeholder="Chọn tình trạng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empty">Rỗng (Empty)</SelectItem>
                  <SelectItem value="laden">Có hàng (Laden)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dropoffDate">Ngày dự kiến hạ *</Label>
              <Input id="dropoffDate" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dropoffTruck">Biển số xe *</Label>
              <Input id="dropoffTruck" placeholder="51C-123.45" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dropoffDriver">Tên tài xế *</Label>
              <Input id="dropoffDriver" placeholder="Nguyễn Văn A" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dropoffDriverPhone">Số điện thoại tài xế *</Label>
              <Input id="dropoffDriverPhone" placeholder="0901234567" type="tel" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dropoffOwner">Hãng tàu *</Label>
              <Select>
                <SelectTrigger id="dropoffOwner">
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

            <div className="space-y-2">
              <Label htmlFor="dropoffNote">Ghi chú</Label>
              <Input id="dropoffNote" placeholder="Thông tin bổ sung (nếu có)" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="needsInspection" />
              <label htmlFor="needsInspection" className="text-sm font-medium">
                Cần kiểm tra container trước khi nhận
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1" onClick={() => setShowDropoffForm(false)}>
                <Upload className="h-4 w-4 mr-2" />
                Xác nhận đăng ký
              </Button>
              <Button variant="outline" onClick={() => setShowDropoffForm(false)}>
                Hủy
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Depot Form Sheet */}
      <Sheet open={showAddDepot} onOpenChange={setShowAddDepot}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Thêm Depot Mới</SheetTitle>
            <SheetDescription>
              Thêm depot lưu trữ container mới vào hệ thống
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="depotName">Tên Depot *</Label>
              <Input id="depotName" placeholder="DEPOT ABC" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depotProvince">Tỉnh/Thành phố *</Label>
              <Select>
                <SelectTrigger id="depotProvince">
                  <SelectValue placeholder="Chọn tỉnh/thành phố" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tiengiang">Tiền Giang</SelectItem>
                  <SelectItem value="tayninh">Tây Ninh</SelectItem>
                  <SelectItem value="baria">Bà Rịa - Vũng Tàu</SelectItem>
                  <SelectItem value="binhduong">Bình Dương</SelectItem>
                  <SelectItem value="dongnai">Đồng Nai</SelectItem>
                  <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="depotAddress">Địa chỉ chi tiết *</Label>
              <Input id="depotAddress" placeholder="Số nhà, đường, phường/xã, quận/huyện" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depotCapacity">Sức chứa (containers) *</Label>
              <Input id="depotCapacity" type="number" placeholder="500" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depotImage">URL Hình ảnh</Label>
              <Input id="depotImage" type="url" placeholder="https://..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depotContact">Người liên hệ</Label>
              <Input id="depotContact" placeholder="Tên người liên hệ" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depotPhone">Số điện thoại liên hệ</Label>
              <Input id="depotPhone" type="tel" placeholder="0901234567" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="depotActive" defaultChecked />
              <label htmlFor="depotActive" className="text-sm font-medium">
                Kích hoạt depot ngay
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1" onClick={() => setShowAddDepot(false)}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm Depot
              </Button>
              <Button variant="outline" onClick={() => setShowAddDepot(false)}>
                Hủy
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

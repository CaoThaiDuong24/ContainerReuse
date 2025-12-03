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
  Warehouse
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
  const [showAddDepot, setShowAddDepot] = useState(false)
  const [showPickupForm, setShowPickupForm] = useState(false)
  const [showDropoffForm, setShowDropoffForm] = useState(false)
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

  const provinces = Array.from(new Set(depots.map(d => d.province)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Cloud Yards</h1>
        <p className="text-muted-foreground text-lg">Depot lưu trữ Container tạm thời</p>
      </div>

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

              {/* Container Count */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-sm">
                  <span className="text-muted-foreground">Số lượng Container:</span>
                  <span className="font-bold text-2xl ml-2 text-primary">{depot.containerCount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  variant="default"
                  onClick={() => {
                    setSelectedDepot(depot)
                    setShowPickupForm(true)
                  }}
                >
                  Đăng ký lấy container
                </Button>
                <Button 
                  className="flex-1" 
                  variant="outline"
                  onClick={() => {
                    setSelectedDepot(depot)
                    setShowDropoffForm(true)
                  }}
                >
                  Đăng ký hạ container
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredDepots.length === 0 && (
        <div className="text-center py-12">
          <Warehouse className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Không tìm thấy depot</h3>
          <p className="text-muted-foreground">
            Không có depot nào phù hợp với tiêu chí tìm kiếm của bạn.
          </p>
        </div>
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

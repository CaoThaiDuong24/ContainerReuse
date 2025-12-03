"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, Upload, X, Download, PackageCheck, FileText, User, Truck, DollarSign, Image as ImageIcon } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface PickupContainerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  containerId?: string
  depotName?: string
}

export function PickupContainerModal({ 
  open, 
  onOpenChange,
  containerId = "",
  depotName = ""
}: PickupContainerModalProps) {
  const [formData, setFormData] = useState({
    gateType: "",
    billNumber: "",
    depot: depotName,
    shipping: "",
    depotAddress: "",
    containerType: "",
    containerSize: "",
    transportType: "",
    vehicleNumber: "",
    cmndNumber: "",
    driverName: "",
    dateOfBirth: undefined as Date | undefined,
    phoneNumber: "",
    shippingCompanyMst: "",
    companyName: "",
    address: "",
    inspectionFee: "",
    liftFee: "",
    containerFee: "",
    totalAmount: "",
    orderStatus: "pending",
    creator: "Quản Trị GSOT"
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview("")
  }

  const handleSubmit = async () => {
    const requiredFields = [
      'billNumber', 'depot', 'shipping', 'containerType', 
      'transportType', 'vehicleNumber', 'cmndNumber', 'shippingCompanyMst'
    ]
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (missingFields.length > 0) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc (*)')
      return
    }

    if (!imageFile) {
      alert('Vui lòng chọn hình ảnh')
      return
    }

    console.log('Form data:', formData)
    console.log('Image file:', imageFile)
    
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      gateType: "",
      billNumber: "",
      depot: depotName,
      shipping: "",
      depotAddress: "",
      containerType: "",
      containerSize: "",
      transportType: "",
      vehicleNumber: "",
      cmndNumber: "",
      driverName: "",
      dateOfBirth: undefined,
      phoneNumber: "",
      shippingCompanyMst: "",
      companyName: "",
      address: "",
      inspectionFee: "",
      liftFee: "",
      containerFee: "",
      totalAmount: "",
      orderStatus: "pending",
      creator: "Quản Trị GSOT"
    })
    setImageFile(null)
    setImagePreview("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[90vw] !w-[90vw] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        {/* Header */}
        <div className="px-8 py-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 shrink-0">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                <Download className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                  Đăng ký lấy Container
                </DialogTitle>
                <DialogDescription className="text-base mt-1">
                  Điền đầy đủ thông tin để đăng ký lấy container <span className="font-semibold text-blue-600">{containerId}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-8">
            {/* Section 1: Thông tin đơn hàng */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2">
                <div className="h-1 w-1 rounded-full bg-blue-600"></div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Thông tin đơn hàng</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gateType" className="text-sm font-medium flex items-center gap-1">
                    <PackageCheck className="h-3.5 w-3.5 text-slate-500" />
                    Loại đơn hàng
                  </Label>
                  <Select value={formData.gateType} onValueChange={(value) => setFormData({...formData, gateType: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Gate OUT" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gate-out">Gate OUT</SelectItem>
                      <SelectItem value="gate-in">Gate IN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billNumber" className="text-sm font-medium flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-slate-500" />
                    Số B/L // số vận đơn <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="billNumber"
                    value={formData.billNumber}
                    onChange={(e) => setFormData({...formData, billNumber: e.target.value})}
                    placeholder="Nhập số B/L"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="depot" className="text-sm font-medium flex items-center gap-1">
                    <PackageCheck className="h-3.5 w-3.5 text-slate-500" />
                    Depot <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.depot} onValueChange={(value) => setFormData({...formData, depot: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Vui lòng chọn Depot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="depot-1">Depot 1</SelectItem>
                      <SelectItem value="depot-2">Depot 2</SelectItem>
                      <SelectItem value="depot-3">Depot 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping" className="text-sm font-medium flex items-center gap-1">
                    <PackageCheck className="h-3.5 w-3.5 text-slate-500" />
                    Hãng tàu <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.shipping} onValueChange={(value) => setFormData({...formData, shipping: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Vui lòng chọn Hãng tàu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maersk">Maersk</SelectItem>
                      <SelectItem value="msc">MSC</SelectItem>
                      <SelectItem value="cma-cgm">CMA CGM</SelectItem>
                      <SelectItem value="cosco">COSCO</SelectItem>
                      <SelectItem value="hapag-lloyd">Hapag-Lloyd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="depotAddress" className="text-sm font-medium">Địa chỉ Depot</Label>
                  <Input 
                    id="depotAddress"
                    value={formData.depotAddress}
                    onChange={(e) => setFormData({...formData, depotAddress: e.target.value})}
                    placeholder="Nhập địa chỉ depot"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="containerSize" className="text-sm font-medium">Loại cont</Label>
                  <Select value={formData.containerSize} onValueChange={(value) => setFormData({...formData, containerSize: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Vui lòng chọn Loại cont" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20ft">20ft</SelectItem>
                      <SelectItem value="40ft">40ft</SelectItem>
                      <SelectItem value="45ft">45ft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orderStatus" className="text-sm font-medium">Trạng thái đơn hàng</Label>
                  <Select value={formData.orderStatus} onValueChange={(value) => setFormData({...formData, orderStatus: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Đang chờ duyệt" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Đang chờ duyệt</SelectItem>
                      <SelectItem value="approved">Đã duyệt</SelectItem>
                      <SelectItem value="rejected">Từ chối</SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creator" className="text-sm font-medium flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-500" />
                    Người tạo
                  </Label>
                  <Select value={formData.creator} onValueChange={(value) => setFormData({...formData, creator: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Quản Trị GSOT" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Quản Trị GSOT">Quản Trị GSOT</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Section 2: Thông tin vận tải */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2">
                <div className="h-1 w-1 rounded-full bg-green-600"></div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Thông tin vận tải</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transportType" className="text-sm font-medium flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5 text-slate-500" />
                    Đơn vị vận tải <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.transportType} onValueChange={(value) => setFormData({...formData, transportType: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Vui lòng chọn Đơn vị vận tải" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company-a">Công ty A</SelectItem>
                      <SelectItem value="company-b">Công ty B</SelectItem>
                      <SelectItem value="company-c">Công ty C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber" className="text-sm font-medium flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5 text-slate-500" />
                    Số xe <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                    placeholder="Nhập số xe"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driverName" className="text-sm font-medium flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-500" />
                    Họ tên tài xế
                  </Label>
                  <Input 
                    id="driverName"
                    value={formData.driverName}
                    onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                    placeholder="Nhập họ tên tài xế"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cmndNumber" className="text-sm font-medium flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-slate-500" />
                    CMND / Số căn cước <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.cmndNumber} onValueChange={(value) => setFormData({...formData, cmndNumber: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Vui lòng chọn CMND / Số căn cước" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cmnd-1">CMND-001234567</SelectItem>
                      <SelectItem value="cmnd-2">CMND-987654321</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-sm font-medium flex items-center gap-1">
                    <CalendarIcon className="h-3.5 w-3.5 text-slate-500" />
                    Ngày sinh
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-11 justify-start text-left font-normal",
                          !formData.dateOfBirth && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dateOfBirth ? (
                          format(formData.dateOfBirth, "dd/MM/yyyy", { locale: vi })
                        ) : (
                          <span>29/11/2025</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.dateOfBirth}
                        onSelect={(date) => setFormData({...formData, dateOfBirth: date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium">Số điện thoại</Label>
                  <Input 
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    placeholder="Nhập số điện thoại"
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Section 3: Thông tin công ty */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2">
                <div className="h-1 w-1 rounded-full bg-purple-600"></div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Thông tin công ty</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingCompanyMst" className="text-sm font-medium flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-slate-500" />
                    Công ty in hóa đơn (MST) <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.shippingCompanyMst} onValueChange={(value) => setFormData({...formData, shippingCompanyMst: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Vui lòng chọn Công ty in hóa đơn (MST)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mst-001">MST-001</SelectItem>
                      <SelectItem value="mst-002">MST-002</SelectItem>
                      <SelectItem value="mst-003">MST-003</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm font-medium">Tên công ty</Label>
                  <Input 
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    placeholder="Nhập tên công ty"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">Địa chỉ</Label>
                  <Input 
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Nhập địa chỉ"
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Section 4: Phí và chi phí */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2">
                <div className="h-1 w-1 rounded-full bg-orange-600"></div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Phí và chi phí</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inspectionFee" className="text-sm font-medium flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-slate-500" />
                    Phí kiểm soát ra vào cổng
                  </Label>
                  <Input 
                    id="inspectionFee"
                    type="number"
                    value={formData.inspectionFee}
                    onChange={(e) => setFormData({...formData, inspectionFee: e.target.value})}
                    placeholder="0"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="liftFee" className="text-sm font-medium flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-slate-500" />
                    Phí nâng hạ
                  </Label>
                  <Input 
                    id="liftFee"
                    type="number"
                    value={formData.liftFee}
                    onChange={(e) => setFormData({...formData, liftFee: e.target.value})}
                    placeholder="0"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="containerFee" className="text-sm font-medium flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-slate-500" />
                    Phụ phí xe nâng
                  </Label>
                  <Input 
                    id="containerFee"
                    type="number"
                    value={formData.containerFee}
                    onChange={(e) => setFormData({...formData, containerFee: e.target.value})}
                    placeholder="0"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalAmount" className="text-sm font-medium flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-slate-500" />
                    Tổng tiền
                  </Label>
                  <Input 
                    id="totalAmount"
                    type="number"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                    placeholder="0"
                    className="h-11 font-semibold"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Section 5: Hình ảnh */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2">
                <div className="h-1 w-1 rounded-full bg-pink-600"></div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Hình ảnh <span className="text-red-500">*</span>
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700"></div>
              </div>
              
              {imagePreview ? (
                <div className="relative w-full max-w-2xl mx-auto">
                  <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-xl">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-4 right-4 h-10 w-10 rounded-full shadow-lg"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 text-center font-medium">
                    {imageFile?.name}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full max-w-2xl aspect-video border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:border-blue-400 dark:hover:border-blue-600 group"
                  >
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="mb-2 text-base font-semibold text-slate-700 dark:text-slate-300">
                        Chọn file hoặc kéo thả vào đây
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">PNG, JPG, GIF (MAX. 5MB)</p>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="text-red-500">*</span> Trường bắt buộc
          </p>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                onOpenChange(false)
                resetForm()
              }}
              className="h-11 px-6"
            >
              Hủy bỏ
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 h-11 px-8 shadow-lg shadow-blue-600/30"
            >
              <Download className="h-4 w-4 mr-2" />
              Xác nhận đăng ký
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

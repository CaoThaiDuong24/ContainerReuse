"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SlidersHorizontal, MapPin, Ship, Package, Filter, X } from "lucide-react"
import { Depot } from "@/lib/depotService"
import { ContainerType } from "@/lib/containerTypeService"

interface FilterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  
  // Filter states
  selectedProvince: string
  setSelectedProvince: (value: string) => void
  selectedDepot: string
  setSelectedDepot: (value: string) => void
  selectedShippingLine: string
  setSelectedShippingLine: (value: string) => void
  selectedSize: string
  setSelectedSize: (value: string) => void
  selectedType: string
  setSelectedType: (value: string) => void
  
  // Data
  provinces: string[]
  filteredDepots: Depot[]
  availableShippingLines: string[]
  containerTypes: ContainerType[]
  
  // Actions
  resetFilters: () => void
  hasActiveFilters: boolean
  filteredContainersCount: number
}

export function FilterSheet({
  open,
  onOpenChange,
  selectedProvince,
  setSelectedProvince,
  selectedDepot,
  setSelectedDepot,
  selectedShippingLine,
  setSelectedShippingLine,
  selectedSize,
  setSelectedSize,
  selectedType,
  setSelectedType,
  provinces,
  filteredDepots,
  availableShippingLines,
  containerTypes,
  resetFilters,
  hasActiveFilters,
  filteredContainersCount,
}: FilterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button 
          variant="outline"
          size="sm"
          className="hover:bg-blue-50 hover:text-blue-600 border-gray-300"
        >
          <SlidersHorizontal className="h-4 w-4 mr-1.5" />
          Lọc nâng cao
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1.5 px-1.5 h-5 min-w-5 bg-blue-600 text-white">
              {[selectedProvince, selectedDepot, selectedShippingLine, selectedSize, selectedType]
                .filter(v => v !== "all").length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[450px] p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <SlidersHorizontal className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <SheetTitle className="text-lg font-bold text-gray-900">
                Bộ lọc nâng cao
              </SheetTitle>
              <SheetDescription className="text-xs text-gray-500">
                Tùy chỉnh tiêu chí lọc container
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto px-6">
          <div className="py-6 space-y-6">
            {/* Location Filters */}
            <div className="space-y-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-600 rounded">
                  <MapPin className="h-3.5 w-3.5 text-white" />
                </div>
                <h3 className="font-semibold text-sm text-gray-900">Vị trí</h3>
              </div>
              
              {/* Province */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Tỉnh/Thành phố
                </label>
                <Select 
                  value={selectedProvince} 
                  onValueChange={(value) => {
                    setSelectedProvince(value)
                    setSelectedDepot("all")
                  }}
                >
                  <SelectTrigger className={`w-full ${selectedProvince !== "all" ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : "bg-white"}`}>
                    <SelectValue placeholder="Chọn tỉnh/thành phố" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả tỉnh/TP</SelectItem>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Depot */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Depot
                </label>
                <Select value={selectedDepot} onValueChange={setSelectedDepot}>
                  <SelectTrigger className={`w-full ${selectedDepot !== "all" ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : "bg-white"}`}>
                    <SelectValue placeholder="Chọn depot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả Depot</SelectItem>
                    {filteredDepots.map((depot) => (
                      <SelectItem key={depot.id} value={depot.id}>
                        {depot.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Shipping Line Filter */}
            <div className="space-y-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-600 rounded">
                  <Ship className="h-3.5 w-3.5 text-white" />
                </div>
                <h3 className="font-semibold text-sm text-gray-900">Hãng tàu</h3>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Chủ sở hữu
                </label>
                <Select value={selectedShippingLine} onValueChange={setSelectedShippingLine}>
                  <SelectTrigger className={`w-full ${selectedShippingLine !== "all" ? "border-green-500 bg-green-50 ring-2 ring-green-200" : "bg-white"}`}>
                    <SelectValue placeholder="Chọn hãng tàu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả hãng</SelectItem>
                    {availableShippingLines.map((line) => (
                      <SelectItem key={line} value={line}>
                        {line}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Container Specifications */}
            <div className="space-y-4 p-4 bg-purple-50/50 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-600 rounded">
                  <Package className="h-3.5 w-3.5 text-white" />
                </div>
                <h3 className="font-semibold text-sm text-gray-900">Quy cách Container</h3>
              </div>
              
              {/* Size */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Kích thước
                </label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className={`w-full ${selectedSize !== "all" ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200" : "bg-white"}`}>
                    <SelectValue placeholder="Chọn kích thước" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả kích thước</SelectItem>
                    {[...new Set(containerTypes.map(t => t.containerSize).filter(Boolean))].sort().map((size) => (
                      <SelectItem key={size} value={size}>
                        📦 {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Loại container
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className={`w-full ${selectedType !== "all" ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200" : "bg-white"}`}>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    {containerTypes.map((type) => (
                      <SelectItem key={type.id} value={type.code}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filter Summary */}
            {hasActiveFilters && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Filter className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-amber-900 mb-1">
                      Đang áp dụng {[selectedProvince, selectedDepot, selectedShippingLine, selectedSize, selectedType].filter(v => v !== "all").length} bộ lọc
                    </p>
                    <p className="text-xs text-amber-700">
                      Hiển thị {filteredContainersCount} container phù hợp
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="p-4 bg-white border-t shadow-lg shrink-0">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 border-gray-300 hover:bg-gray-50"
              onClick={resetFilters}
            >
              <X className="h-4 w-4 mr-2" />
              Xóa tất cả
            </Button>
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-md"
              onClick={() => onOpenChange(false)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Áp dụng
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

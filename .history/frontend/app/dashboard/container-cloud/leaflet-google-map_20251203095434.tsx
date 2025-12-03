"use client"

import { useEffect, useState, useRef } from "react"
import L from "leaflet"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { Depot } from "@/lib/depotService"
import { MapPin, Package, Navigation, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Fix for default marker icons in Leaflet with null check
if (typeof window !== 'undefined') {
  try {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    })
  } catch (error) {
    // Silently fail
  }
}

// Tọa độ các tỉnh/thành phố Việt Nam
const vietnamProvinces = [
  { name: "Hà Nội", lat: 21.0285, lng: 105.8542 },
  { name: "Hải Phòng", lat: 20.8449, lng: 106.6881 },
  { name: "Quảng Ninh", lat: 21.0064, lng: 107.2925 },
  { name: "Đà Nẵng", lat: 16.0544, lng: 108.2022 },
  { name: "Hồ Chí Minh", lat: 10.8231, lng: 106.6297 },
  { name: "Bà Rịa - Vũng Tàu", lat: 10.5417, lng: 107.2430 },
  { name: "Cần Thơ", lat: 10.0452, lng: 105.7469 },
]

// Hàm lấy tọa độ depot
const getDepotCoordinates = (depot: Depot) => {
  const province = vietnamProvinces.find(p => 
    depot.province?.includes(p.name) || depot.location?.includes(p.name) || depot.address?.includes(p.name)
  )
  if (province) {
    return {
      lat: province.lat + (Math.random() - 0.5) * 0.05,
      lng: province.lng + (Math.random() - 0.5) * 0.05
    }
  }
  return { lat: 10.8231, lng: 106.6297 }
}

interface MapComponentProps {
  depots: Depot[]
}

// Simplified Map controls component
function MapControls() {
  const map = useMap()
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!map || !mounted) return

    const timeoutId = setTimeout(() => {
      try {
        // Remove existing tile layers safely
        const layers: L.Layer[] = []
        map.eachLayer((layer) => {
          if (layer instanceof L.TileLayer) {
            layers.push(layer)
          }
        })
        
        layers.forEach(layer => {
          try {
            map.removeLayer(layer)
          } catch (e) {
            // Ignore removal errors
          }
        })

        // Add new tile layer based on map type
        let tileUrl = ''
        let attribution = ''

        switch (mapType) {
          case 'roadmap':
            tileUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=vi&gl=VN'
            attribution = '&copy; Google Maps'
            break
          case 'satellite':
            tileUrl = 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&hl=vi&gl=VN'
            attribution = '&copy; Google Satellite'
            break
          case 'hybrid':
            tileUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&hl=vi&gl=VN'
            attribution = '&copy; Google Hybrid'
            break
        }

        const newLayer = L.tileLayer(tileUrl, {
          maxZoom: 20,
          attribution: attribution,
        })

        newLayer.addTo(map)
      } catch (error) {
        // Silently handle errors
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [mapType, map, mounted])

  const resetView = () => {
    map.setView([16.0, 106.0], 6)
  }

  const cycleMapType = () => {
    setMapType(prev => {
      if (prev === 'roadmap') return 'satellite'
      if (prev === 'satellite') return 'hybrid'
      return 'roadmap'
    })
  }

  const getMapTypeLabel = () => {
    switch (mapType) {
      case 'roadmap': return 'Bản đồ'
      case 'satellite': return 'Vệ tinh'
      case 'hybrid': return 'Kết hợp'
    }
  }

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <Button
        size="sm"
        variant="secondary"
        className="bg-white hover:bg-gray-100 shadow-md"
        onClick={cycleMapType}
      >
        <Layers className="h-4 w-4 mr-2" />
        {getMapTypeLabel()}
      </Button>
      <Button
        size="sm"
        variant="secondary"
        className="bg-white hover:bg-gray-100 shadow-md"
        onClick={resetView}
      >
        <Navigation className="h-4 w-4 mr-2" />
        Đặt lại
      </Button>
    </div>
  )
}

// Component to fit bounds when depots change
function FitBounds({ depots }: MapComponentProps) {
  const map = useMap()

  useEffect(() => {
    if (depots.length > 0) {
      const bounds = L.latLngBounds(
        depots.map((depot) => {
          const coords = getDepotCoordinates(depot)
          return [coords.lat, coords.lng] as [number, number]
        })
      )
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
    }
  }, [depots, map])

  return null
}

export default function LeafletGoogleMap({ depots }: MapComponentProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-500">Đang tải bản đồ...</div>
        </div>
      </div>
    )
  }

  const vietnamCenter: [number, number] = [16.0, 106.0]

  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative shadow-lg">
      <MapContainer
        center={vietnamCenter}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
        scrollWheelZoom={true}
        zoomControl={true}
      >
        {/* Google Maps Roadmap tile layer - Vietnam region */}
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=vi&gl=VN"
          attribution='&copy; Google Maps Vietnam'
          maxZoom={20}
        />
        
        <MapControls />
        <FitBounds depots={depots} />

        {depots.map((depot) => {
          const coords = getDepotCoordinates(depot)
          return (
            <Marker
              key={depot.id}
              position={[coords.lat, coords.lng]}
            >
              <Popup className="custom-google-popup" closeButton={true} maxWidth={300}>
                <div className="p-3 min-w-[280px]">
                  {/* Depot Logo */}
                  {depot.logo && (
                    <div className="mb-3 h-16 rounded overflow-hidden bg-white border border-gray-200">
                      <img 
                        src={depot.logo} 
                        alt={depot.name}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-base text-gray-900">{depot.name}</h4>
                    <Badge
                      variant={depot.status === "active" ? "default" : "secondary"}
                      className="text-xs ml-2"
                    >
                      {depot.status === "active" ? "Hoạt động" : "Ngừng"}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{depot.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Package className="h-4 w-4 flex-shrink-0" />
                      <span>
                        <strong className="text-gray-900">{depot.containerCount}</strong> / {depot.capacity} containers
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${depot.status === "active" ? "bg-blue-600" : "bg-gray-400"}`}
                          style={{ width: `${Math.min((depot.containerCount / depot.capacity) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Công suất: {Math.round((depot.containerCount / depot.capacity) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Statistics Card - Google Maps style */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-[1000] max-w-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <h5 className="font-semibold text-sm">Thống kê Depot</h5>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-blue-50 rounded p-2">
            <div className="text-gray-600">Tổng depot</div>
            <div className="text-lg font-bold text-blue-600">{depots.length}</div>
          </div>
          <div className="bg-green-50 rounded p-2">
            <div className="text-gray-600">Hoạt động</div>
            <div className="text-lg font-bold text-green-600">
              {depots.filter(d => d.status === 'active').length}
            </div>
          </div>
          <div className="bg-purple-50 rounded p-2 col-span-2">
            <div className="text-gray-600">Tổng containers</div>
            <div className="text-lg font-bold text-purple-600">
              {depots.reduce((sum, d) => sum + d.containerCount, 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Map type legend */}
      <div className="absolute top-4 left-4 bg-white rounded shadow-md px-3 py-2 z-[1000] text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm border-2 border-white"></div>
            <span className="text-gray-700">Hoạt động</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-400 shadow-sm border-2 border-white"></div>
            <span className="text-gray-700">Ngừng</span>
          </div>
        </div>
      </div>
    </div>
  )
}

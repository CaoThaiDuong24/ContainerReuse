"use client"

import { useEffect, useState, useRef } from "react"
import L from "leaflet"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { Depot } from "@/lib/depotService"
import { MapPin, Package, Navigation, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

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

// Custom marker icon giống Google Maps
const createGoogleMapsIcon = (isActive: boolean) => {
  const color = isActive ? "#EA4335" : "#9CA3AF"
  const shadowColor = isActive ? "rgba(234, 67, 53, 0.4)" : "rgba(156, 163, 175, 0.4)"
  
  return L.divIcon({
    className: "custom-google-marker",
    html: `
      <div style="position: relative; width: 40px; height: 50px;">
        <!-- Shadow -->
        <div style="
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 8px;
          background: ${shadowColor};
          border-radius: 50%;
          filter: blur(3px);
        "></div>
        
        <!-- Pin marker -->
        <div style="
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          height: 42px;
        ">
          <!-- Pin shape -->
          <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26c0-8.837-7.163-16-16-16z" 
                  fill="${color}"/>
            <circle cx="16" cy="15" r="6" fill="white"/>
          </svg>
          
          <!-- Icon inside -->
          <div style="
            position: absolute;
            top: 8px;
            left: 50%;
            transform: translateX(-50%);
            width: 14px;
            height: 14px;
          ">
            <svg viewBox="0 0 24 24" fill="${color}">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
          </div>
        </div>
        
        <!-- Pulse effect cho depot hoạt động -->
        ${isActive ? `
        <div style="
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          height: 32px;
          background-color: ${color};
          border-radius: 50%;
          opacity: 0.3;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        "></div>
        ` : ''}
      </div>
      <style>
        @keyframes pulse {
          0%, 100% {
            transform: translateX(-50%) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateX(-50%) scale(1.5);
            opacity: 0;
          }
        }
      </style>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  })
}

interface MapComponentProps {
  depots: Depot[]
}

// Map controls component
function MapControls() {
  const map = useMap()
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap')
  const tileLayerRef = useRef<L.TileLayer | null>(null)

  useEffect(() => {
    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer)
      }
    })

    // Add new tile layer based on map type
    let tileUrl = ''
    let attribution = ''

    switch (mapType) {
      case 'roadmap':
        // Google Maps Roadmap style using Google's tile server for Vietnam
        tileUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=vi&gl=VN'
        attribution = '&copy; Google Maps Vietnam'
        break
      case 'satellite':
        // Google Satellite for Vietnam
        tileUrl = 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&hl=vi&gl=VN'
        attribution = '&copy; Google Satellite Vietnam'
        break
      case 'hybrid':
        // Google Hybrid (Satellite + Labels) for Vietnam
        tileUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&hl=vi&gl=VN'
        attribution = '&copy; Google Hybrid Vietnam'
        break
    }

    const newLayer = L.tileLayer(tileUrl, {
      maxZoom: 20,
      attribution: attribution,
    })

    newLayer.addTo(map)
    tileLayerRef.current = newLayer

    return () => {
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current)
      }
    }
  }, [mapType, map])

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
        zoomControl={false}
      >
        {/* Google Maps Roadmap tile layer - Vietnam region */}
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=vi&gl=VN"
          attribution='&copy; Google Maps Vietnam'
          maxZoom={20}
        />
        
        {/* Custom zoom control positioned at bottom right like Google Maps */}
        <div className="leaflet-bottom leaflet-right">
          <div className="leaflet-control leaflet-bar custom-zoom-control">
            <a 
              className="leaflet-control-zoom-in" 
              href="#" 
              title="Zoom in"
              role="button"
              onClick={(e) => {
                e.preventDefault()
              }}
            >+</a>
            <a 
              className="leaflet-control-zoom-out" 
              href="#" 
              title="Zoom out"
              role="button"
              onClick={(e) => {
                e.preventDefault()
              }}
            >−</a>
          </div>
        </div>
        
        <MapControls />
        <FitBounds depots={depots} />

        {depots.map((depot) => {
          const coords = getDepotCoordinates(depot)
          return (
            <Marker
              key={depot.id}
              position={[coords.lat, coords.lng]}
              icon={createGoogleMapsIcon(depot.status === "active")}
            >
              <Popup className="custom-google-popup" closeButton={true} maxWidth={300}>
                <div className="p-3 min-w-[280px]">
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

      <style jsx global>{`
        /* Google Maps style for Leaflet */
        .leaflet-container {
          font-family: 'Roboto', 'Arial', sans-serif;
          background: #e5e3df !important;
        }
        
        /* Google Maps style popup */
        .custom-google-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          padding: 0;
          box-shadow: 0 2px 7px rgba(0,0,0,0.3);
          border: 1px solid rgba(0,0,0,0.2);
          font-family: 'Roboto', 'Arial', sans-serif;
        }
        
        .custom-google-popup .leaflet-popup-content {
          margin: 0;
        }
        
        .custom-google-popup .leaflet-popup-tip-container {
          display: none;
        }
        
        /* Zoom control styling - Google Maps style */
        .custom-zoom-control {
          border: none !important;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3) !important;
          border-radius: 2px !important;
          overflow: hidden;
          margin-bottom: 20px !important;
          margin-right: 10px !important;
        }
        
        .custom-zoom-control a {
          width: 40px !important;
          height: 40px !important;
          line-height: 40px !important;
          font-size: 18px !important;
          font-weight: 500 !important;
          border: none !important;
          background-color: #fff !important;
          color: #666 !important;
          text-decoration: none !important;
          display: block !important;
          text-align: center !important;
        }
        
        .custom-zoom-control a:hover {
          background-color: #f4f4f4 !important;
          color: #000 !important;
        }
        
        .custom-zoom-control a:first-child {
          border-bottom: 1px solid #e6e6e6 !important;
        }
        
        /* Attribution - Google Maps style */
        .leaflet-control-attribution {
          background: rgba(255, 255, 255, 0.7) !important;
          font-size: 10px !important;
          padding: 2px 5px !important;
          font-family: 'Roboto', 'Arial', sans-serif !important;
        }
        
        /* Remove marker shadow for custom markers */
        .custom-google-marker {
          background: transparent !important;
          border: none !important;
        }
        
        /* Google Maps tiles attribution */
        .leaflet-bottom.leaflet-right {
          pointer-events: auto;
        }
      `}</style>
    </div>
  )
}

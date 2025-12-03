"use client"

import { useEffect, useState, useCallback } from "react"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api"
import { Depot } from "@/lib/depotService"
import { MapPin, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Google Maps API Key - Nên lưu trong .env
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBJk_qH3VjGHaVJqGqXKqHZqk_3xqE7rQo"

// Map container style
const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
}

// Center of Vietnam
const center = {
  lat: 16.0,
  lng: 106.0
}

// Map options
const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: true,
  rotateControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ]
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

// Hàm lấy tọa độ depot dựa trên tên tỉnh/thành
const getDepotCoordinates = (depot: Depot) => {
  const province = vietnamProvinces.find(p => 
    depot.province?.includes(p.name) || depot.location?.includes(p.name)
  )
  if (province) {
    // Thêm offset ngẫu nhiên nhỏ để tránh các depot trùng vị trí
    return {
      lat: province.lat + (Math.random() - 0.5) * 0.1,
      lng: province.lng + (Math.random() - 0.5) * 0.1
    }
  }
  // Mặc định về Hồ Chí Minh nếu không tìm thấy
  return { lat: 10.8231, lng: 106.6297 }
}

// Custom marker icons với style Google Maps
const createCustomIcon = (isActive: boolean) => {
  const color = isActive ? "#EA4335" : "#9CA3AF"
  const shadowColor = isActive ? "rgba(234, 67, 53, 0.4)" : "rgba(156, 163, 175, 0.4)"
  
  return L.divIcon({
    className: "custom-marker",
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
        
        <!-- Pulse effect -->
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
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets')

  const resetView = () => {
    map.setView([16.0, 106.0], 6)
  }

  const toggleMapType = () => {
    const newType = mapType === 'streets' ? 'satellite' : 'streets'
    setMapType(newType)
    
    // Change tile layer
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer)
      }
    })
    
    const newLayer = newType === 'streets' 
      ? L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      : L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}')
    
    newLayer.addTo(map)
  }

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <Button
        size="sm"
        variant="secondary"
        className="bg-white hover:bg-gray-100 shadow-md"
        onClick={toggleMapType}
      >
        <Layers className="h-4 w-4 mr-2" />
        {mapType === 'streets' ? 'Vệ tinh' : 'Bản đồ'}
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
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [depots, map])

  return null
}

export default function VietnamMap({ depots }: MapComponentProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-gray-500">Đang tải bản đồ...</div>
      </div>
    )
  }

  // Center of Vietnam
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
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        
        {/* Custom zoom control positioned like Google Maps */}
        <ZoomControl position="bottomright" />
        
        <MapControls />
        <FitBounds depots={depots} />

        {depots.map((depot) => {
          const coords = getDepotCoordinates(depot)
          return (
            <Marker
              key={depot.id}
              position={[coords.lat, coords.lng]}
              icon={createCustomIcon(depot.status === "active")}
            >
              <Popup className="custom-popup" closeButton={true}>
                <div className="p-3 min-w-[280px]">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-base">{depot.name}</h4>
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
                          className={`h-2 rounded-full ${depot.status === "active" ? "bg-blue-600" : "bg-gray-400"}`}
                          style={{ width: `${(depot.containerCount / depot.capacity) * 100}%` }}
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

      {/* Map type legend - positioned like Google Maps */}
      <div className="absolute bottom-4 right-4 bg-white rounded shadow-md px-3 py-2 z-[999] text-xs text-gray-600 mb-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
            <span>Hoạt động</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-400 shadow-sm"></div>
            <span>Ngừng</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Custom scrollbar */
        .leaflet-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #e5e3df !important;
        }
        
        /* Google Maps style popup */
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          padding: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          border: 1px solid rgba(0,0,0,0.1);
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .custom-popup .leaflet-popup-tip {
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        /* Zoom control styling */
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3) !important;
          border-radius: 2px !important;
        }
        
        .leaflet-control-zoom a {
          width: 40px !important;
          height: 40px !important;
          line-height: 40px !important;
          font-size: 22px !important;
          border: none !important;
          background-color: white !important;
          color: #666 !important;
        }
        
        .leaflet-control-zoom a:hover {
          background-color: #f4f4f4 !important;
          color: #000 !important;
        }
        
        .leaflet-control-zoom a:first-child {
          border-bottom: 1px solid #ddd !important;
        }
        
        /* Attribution */
        .leaflet-control-attribution {
          background: rgba(255, 255, 255, 0.8) !important;
          font-size: 10px !important;
          padding: 2px 5px !important;
        }
        
        /* Remove marker shadow for custom markers */
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  )
}

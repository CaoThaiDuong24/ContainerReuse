"use client"

import { useState, useCallback, useMemo } from "react"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api"
import { Depot } from "@/lib/depotService"
import { MapPin, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBJk_qH3VjGHaVJqGqXKqHZqk_3xqE7rQo"

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
}

const center = {
  lat: 16.0,
  lng: 106.0
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

interface GoogleMapComponentProps {
  depots: Depot[]
}

export default function GoogleMapComponent({ depots }: GoogleMapComponentProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    language: 'vi',
    region: 'VN'
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [selectedDepot, setSelectedDepot] = useState<Depot | null>(null)

  const onLoad = useCallback((map: google.maps.Map) => {
    // Fit bounds to show all depots
    if (depots.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      depots.forEach(depot => {
        const coords = getDepotCoordinates(depot)
        bounds.extend(new window.google.maps.LatLng(coords.lat, coords.lng))
      })
      map.fitBounds(bounds)
      
      // Limit zoom level
      const listener = window.google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom()! > 15) map.setZoom(15)
        window.google.maps.event.removeListener(listener)
      })
    }
    setMap(map)
  }, [depots])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const mapOptions: google.maps.MapOptions = useMemo(() => ({
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    clickableIcons: false,
    styles: [
      {
        featureType: "poi.business",
        stylers: [{ visibility: "off" }]
      }
    ]
  }), [])

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-500">Đang tải Google Maps...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative shadow-lg">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {depots.map((depot) => {
          const coords = getDepotCoordinates(depot)
          const isActive = depot.status === 'active'
          
          return (
            <Marker
              key={depot.id}
              position={coords}
              onClick={() => setSelectedDepot(depot)}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: isActive ? "#EA4335" : "#9CA3AF",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 3,
              }}
              animation={isActive ? window.google.maps.Animation.DROP : undefined}
            />
          )
        })}

        {selectedDepot && (
          <InfoWindow
            position={getDepotCoordinates(selectedDepot)}
            onCloseClick={() => setSelectedDepot(null)}
          >
            <div className="p-3 min-w-[280px]">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-base text-gray-900">{selectedDepot.name}</h4>
                <Badge
                  variant={selectedDepot.status === "active" ? "default" : "secondary"}
                  className="text-xs ml-2"
                >
                  {selectedDepot.status === "active" ? "Hoạt động" : "Ngừng"}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{selectedDepot.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Package className="h-4 w-4 flex-shrink-0" />
                  <span>
                    <strong className="text-gray-900">{selectedDepot.containerCount}</strong> / {selectedDepot.capacity} containers
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${selectedDepot.status === "active" ? "bg-blue-600" : "bg-gray-400"}`}
                      style={{ width: `${Math.min((selectedDepot.containerCount / selectedDepot.capacity) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Công suất: {Math.round((selectedDepot.containerCount / selectedDepot.capacity) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Statistics Card */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-[10] max-w-xs">
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

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white rounded shadow-md px-3 py-2 z-[10] text-xs">
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

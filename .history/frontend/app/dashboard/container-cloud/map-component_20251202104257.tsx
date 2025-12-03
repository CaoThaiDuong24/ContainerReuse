"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { Depot } from "@/lib/depotService"
import { MapPin, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

// Custom marker icons
const createCustomIcon = (isActive: boolean) => {
  const color = isActive ? "#3b82f6" : "#9ca3af"
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="position: relative;">
        <div style="
          width: 30px;
          height: 30px;
          background-color: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        </div>
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          width: 30px;
          height: 30px;
          background-color: ${color};
          border-radius: 50%;
          opacity: 0.3;
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
      </div>
      <style>
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      </style>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  })
}

interface MapComponentProps {
  depots: Depot[]
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

function MapComponent({ depots }: MapComponentProps) {
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
    <div className="w-full h-full rounded-lg overflow-hidden relative">
      <MapContainer
        center={vietnamCenter}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FitBounds depots={depots} />

        {depots.map((depot) => {
          const coords = getDepotCoordinates(depot)
          return (
            <Marker
              key={depot.id}
              position={[coords.lat, coords.lng]}
              icon={createCustomIcon(depot.status === "active")}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[250px]">
                  <h4 className="font-semibold text-lg mb-2">{depot.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-600" />
                      <span className="text-gray-700">{depot.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">
                        {depot.containerCount} / {depot.capacity} containers
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Badge
                        variant={depot.status === "active" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {depot.status === "active" ? "Hoạt động" : "Ngừng hoạt động"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-[1000]">
        <h5 className="font-semibold mb-2 text-sm">Chú thích</h5>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
            <span>Depot hoạt động</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-400 border-2 border-white"></div>
            <span>Depot ngừng hoạt động</span>
          </div>
          <div className="text-gray-600 mt-2 pt-2 border-t">
            Tổng: {depots.length} depot
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          padding: 0;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
        }
        .leaflet-container {
          font-family: inherit;
        }
      `}</style>
    </div>
  )
}

export default MapComponent

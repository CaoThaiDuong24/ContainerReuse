"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Truck,
  Search,
  MapPin,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Navigation
} from "lucide-react"

export default function LogisticsPage() {
  const shipments = [
    { 
      id: "SHP001", 
      container: "CNT001", 
      origin: "Warehouse A", 
      destination: "Customer Site B",
      status: "in-transit",
      progress: 60,
      eta: "2024-11-29 14:00"
    },
    { 
      id: "SHP002", 
      container: "CNT002", 
      origin: "Port C", 
      destination: "Warehouse D",
      status: "delivered",
      progress: 100,
      eta: "2024-11-27 10:00"
    },
    { 
      id: "SHP003", 
      container: "CNT003", 
      origin: "Warehouse E", 
      destination: "Port F",
      status: "pending",
      progress: 0,
      eta: "2024-11-30 16:00"
    },
    { 
      id: "SHP004", 
      container: "CNT004", 
      origin: "Customer Site G", 
      destination: "Warehouse H",
      status: "in-transit",
      progress: 35,
      eta: "2024-11-28 18:00"
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-transit":
        return <Truck className="w-4 h-4 text-blue-600" />
      case "delivered":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      "in-transit": "bg-blue-100 text-blue-700",
      delivered: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
    }
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Logistics Tracking</h1>
        <p className="text-muted-foreground mt-1">Theo dõi logistics và vận chuyển</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng lô hàng</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">+18 tuần này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang vận chuyển</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">19% tổng số</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã giao</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">178</div>
            <p className="text-xs text-muted-foreground">76% thành công</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chờ xử lý</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11</div>
            <p className="text-xs text-muted-foreground">5% tổng số</p>
          </CardContent>
        </Card>
      </div>

      {/* Shipment List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Shipments</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search shipments..."
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shipments.map((shipment) => (
              <div
                key={shipment.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(shipment.status)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{shipment.id}</h3>
                      <p className="text-sm text-gray-600">Container: {shipment.container}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ${getStatusBadge(shipment.status)}`}>
                    {shipment.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Origin</p>
                      <p className="text-sm font-medium text-gray-900">{shipment.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Navigation className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Destination</p>
                      <p className="text-sm font-medium text-gray-900">{shipment.destination}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">ETA</p>
                      <p className="text-sm font-medium text-gray-900">{shipment.eta}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{shipment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${shipment.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="outline" size="sm">Track on Map</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

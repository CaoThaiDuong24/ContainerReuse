"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Package, 
  Search,
  Plus,
  Filter,
  MoreVertical,
  MapPin,
  Calendar,
  Truck
} from "lucide-react"

export default function ContainersPage() {
  const containers = [
    { id: "CNT001", status: "available", location: "Warehouse A", lastUpdate: "2024-11-28", type: "20ft Standard" },
    { id: "CNT002", status: "in-transit", location: "Route B-C", lastUpdate: "2024-11-27", type: "40ft High Cube" },
    { id: "CNT003", status: "available", location: "Warehouse B", lastUpdate: "2024-11-28", type: "20ft Standard" },
    { id: "CNT004", status: "maintenance", location: "Service Center", lastUpdate: "2024-11-26", type: "40ft Standard" },
    { id: "CNT005", status: "in-use", location: "Customer Site", lastUpdate: "2024-11-25", type: "20ft Refrigerated" },
  ]

  const getStatusBadge = (status: string) => {
    const styles = {
      available: "bg-green-100 text-green-700",
      "in-transit": "bg-blue-100 text-blue-700",
      "in-use": "bg-purple-100 text-purple-700",
      maintenance: "bg-orange-100 text-orange-700",
    }
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Container Management</h1>
          <p className="text-muted-foreground mt-1">Quản lý và theo dõi container của bạn</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm Container
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Containers</CardTitle>
            <Package className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-gray-500">+12 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Package className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-gray-500">57% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-gray-500">27% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Package className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-gray-500">16% of total</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Container List</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search containers..."
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Container ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Last Update</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {containers.map((container) => (
                  <tr key={container.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{container.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{container.type}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(container.status)}`}>
                        {container.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {container.location}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {container.lastUpdate}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

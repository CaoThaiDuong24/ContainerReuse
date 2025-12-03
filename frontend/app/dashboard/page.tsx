"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { fetchContainers } from "@/lib/containerService"
import { fetchDepots } from "@/lib/depotService"
import { getShippingLines } from "@/lib/shippingLineService"
import { fetchActiveContainerTypes } from "@/lib/containerTypeService"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalDepots: 0,
    totalContainers: 0,
    availableContainers: 0,
    inUseContainers: 0,
    totalShippingLines: 0,
    totalContainerTypes: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [containersRes, depotsRes, shippingLinesRes, containerTypesRes] = await Promise.all([
        fetchContainers(),
        fetchDepots(),
        getShippingLines({ status: 'active' }),
        fetchActiveContainerTypes(),
      ])

      const containers = containersRes.data || []
      const depots = depotsRes.data || []
      const shippingLines = shippingLinesRes.data || []
      const containerTypes = containerTypesRes.data || []

      setStats({
        totalDepots: depots.length,
        totalContainers: containers.length,
        availableContainers: containers.filter(c => c.status === 'available').length,
        inUseContainers: containers.filter(c => c.status === 'in-use').length,
        totalShippingLines: shippingLines.length,
        totalContainerTypes: containerTypes.length,
      })
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Quick Overview</h1>
        <p className="text-sm text-gray-500">Container ReUse Platform Dashboard</p>
      </div>

      {/* Stats Cards Row 1 - 6 cards với màu gradient và bo góc tròn */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md rounded-3xl bg-gradient-to-br from-blue-100 via-blue-50 to-white">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Depots</p>
            <h3 className="text-4xl font-bold text-gray-900">{stats.totalDepots}</h3>
            <p className="text-xs text-gray-600 mt-2">
              <span className="text-blue-600 font-semibold">Container Storage Locations</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-3xl bg-gradient-to-br from-green-100 via-green-50 to-white">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Containers</p>
            <h3 className="text-4xl font-bold text-gray-900">{stats.totalContainers}</h3>
            <p className="text-xs text-gray-600 mt-2">
              <span className="text-green-600 font-semibold">Available for ReUse</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-3xl bg-gradient-to-br from-purple-100 via-purple-50 to-white">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Shipping Lines</p>
            <h3 className="text-4xl font-bold text-gray-900">{stats.totalShippingLines}</h3>
            <p className="text-xs text-gray-600 mt-2">
              <span className="text-purple-600 font-semibold">Active Partners</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards Row 2 - 4 cards trắng */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6">
            <h3 className="text-4xl font-bold text-green-600 mb-2">{stats.availableContainers}</h3>
            <p className="text-sm text-gray-600">Available Containers</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6">
            <h3 className="text-4xl font-bold text-orange-600 mb-2">{stats.inUseContainers}</h3>
            <p className="text-sm text-gray-600">In Use</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6">
            <h3 className="text-4xl font-bold text-blue-600 mb-2">{stats.totalContainerTypes}</h3>
            <p className="text-sm text-gray-600">Container Types</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6">
            <h3 className="text-4xl font-bold text-gray-900 mb-2">
              {stats.totalContainers > 0 
                ? Math.round((stats.availableContainers / stats.totalContainers) * 100) 
                : 0}%
            </h3>
            <p className="text-sm text-gray-600">Availability Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Containers By Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Available</span>
                <span className="text-sm font-bold text-green-600">{stats.availableContainers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">In Use</span>
                <span className="text-sm font-bold text-orange-600">{stats.inUseContainers}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Depots</span>
                <span className="text-sm font-bold text-blue-600">{stats.totalDepots}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Shipping Lines</span>
                <span className="text-sm font-bold text-purple-600">{stats.totalShippingLines}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

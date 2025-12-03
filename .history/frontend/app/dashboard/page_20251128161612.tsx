"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Quick Overview</h1>
        <p className="text-sm text-gray-500">This is all over platform sales generated</p>
      </div>

      {/* Stats Cards Row 1 - 5 cards với màu gradient và bo góc tròn */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-0 shadow-md rounded-3xl bg-gradient-to-br from-purple-100 via-purple-50 to-white">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Users</p>
            <h3 className="text-4xl font-bold text-gray-900">232</h3>
            <p className="text-xs text-gray-600 mt-2">
              <span className="text-green-600 font-semibold">(420 New)</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-3xl bg-gradient-to-br from-blue-100 via-blue-50 to-white">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Agents</p>
            <h3 className="text-4xl font-bold text-gray-900">87</h3>
            <p className="text-xs text-gray-600 mt-2">
              <span className="text-green-600 font-semibold">(31 New)</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-3xl bg-gradient-to-br from-cyan-100 via-cyan-50 to-white">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Categories</p>
            <h3 className="text-4xl font-bold text-gray-900">22</h3>
            <p className="text-xs text-gray-600 mt-2">
              <span className="text-green-600 font-semibold">(2 New)</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-3xl bg-gradient-to-br from-indigo-100 via-indigo-50 to-purple-50">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Articles</p>
            <h3 className="text-4xl font-bold text-gray-900">18</h3>
            <p className="text-xs text-gray-600 mt-2">
              <span className="text-green-600 font-semibold">(9 Recent)</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-3xl bg-gradient-to-br from-yellow-100 via-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Subscriber</p>
            <h3 className="text-4xl font-bold text-gray-900">3.8k</h3>
            <p className="text-xs text-gray-600 mt-2">
              <span className="text-green-600 font-semibold">(1237 New)</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards Row 2 - 4 cards trắng */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6">
            <h3 className="text-4xl font-bold text-gray-900 mb-2">265</h3>
            <p className="text-sm text-gray-600">Total Tickets</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6">
            <h3 className="text-4xl font-bold text-gray-900 mb-2">256</h3>
            <p className="text-sm text-gray-600">Pending Tickets</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6">
            <h3 className="text-4xl font-bold text-gray-900 mb-2">43</h3>
            <p className="text-sm text-gray-600">Solved Tickets</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6">
            <h3 className="text-4xl font-bold text-gray-900 mb-2">12</h3>
            <p className="text-sm text-gray-600">Closed Tickets</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Tickets By User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              [Bar Chart Placeholder]
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Tickets By Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              [Donut Chart Placeholder]
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Publications Table */}
      <Card className="border-0 shadow-sm rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Publications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-gray-400">
            [Table Placeholder]
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

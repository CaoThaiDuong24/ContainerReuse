"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Package, 
  TrendingUp, 
  Users, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  DollarSign
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quick Overview
        </h1>
        <p className="text-gray-600">
          This is all over platform sales generated
        </p>
      </div>

      {/* Stats Cards Row 1 - Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <Card className="bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Users
            </CardTitle>
            <Users className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">232</div>
            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
              <span className="text-green-600 font-medium">+20 New</span>
            </p>
          </CardContent>
        </Card>

        {/* Total Agents Card */}
        <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Agents
            </CardTitle>
            <Activity className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">87</div>
            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
              <span className="text-green-600 font-medium">+31 New</span>
            </p>
          </CardContent>
        </Card>

        {/* Total Categories Card */}
        <Card className="bg-gradient-to-br from-cyan-100 to-cyan-50 border-cyan-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Categories
            </CardTitle>
            <Package className="w-5 h-5 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">22</div>
            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
              <span className="text-green-600 font-medium">+5 New</span>
            </p>
          </CardContent>
        </Card>

        {/* Total Articles Card */}
        <Card className="bg-gradient-to-br from-indigo-100 to-indigo-50 border-indigo-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Subscriber
            </CardTitle>
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">3.8k</div>
            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
              <span className="text-green-600 font-medium">+1,037 New</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards Row 2 - Tickets Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tickets */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-4xl font-bold text-gray-900">265</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Total Tickets</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">+0 ↑</span>
              <span className="text-xs text-gray-500">All time activity</span>
            </div>
          </CardContent>
        </Card>

        {/* Pending Tickets */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-4xl font-bold text-gray-900">256</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Pending Tickets</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">4k ↑</span>
              <span className="text-xs text-gray-500">All time activity</span>
            </div>
          </CardContent>
        </Card>

        {/* Solved Tickets */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-4xl font-bold text-gray-900">43</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Solved Tickets</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ArrowDownRight className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">12 ↑</span>
              <span className="text-xs text-gray-500">All time activity</span>
            </div>
          </CardContent>
        </Card>

        {/* Closed Tickets */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-4xl font-bold text-gray-900">12</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Closed Tickets</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ArrowDownRight className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">0 ↑</span>
              <span className="text-xs text-gray-500">All time activity</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets By User Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets By User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Simple Bar Chart Representation */}
              <div className="flex items-end justify-between h-48 gap-4">
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg" style={{height: '60%'}}></div>
                  <span className="text-xs mt-2 text-gray-600">Jul</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-orange-500 via-purple-400 to-green-400 rounded-t-lg" style={{height: '75%'}}></div>
                  <span className="text-xs mt-2 text-gray-600">Aug</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg" style={{height: '50%'}}></div>
                  <span className="text-xs mt-2 text-gray-600">Sep</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-purple-500 via-orange-400 to-green-400 rounded-t-lg" style={{height: '90%'}}></div>
                  <span className="text-xs mt-2 text-gray-600">Oct</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-green-500 via-purple-400 to-orange-400 rounded-t-lg" style={{height: '70%'}}></div>
                  <span className="text-xs mt-2 text-gray-600">Nov</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg" style={{height: '55%'}}></div>
                  <span className="text-xs mt-2 text-gray-600">Dec</span>
                </div>
              </div>
              <div className="flex items-center justify-around pt-4 border-t">
                <div className="text-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-2xl font-bold">4.3</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Total Tickets</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-500" />
                    <span className="text-2xl font-bold">16</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Open Tickets</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-500" />
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Closed Tickets</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets By Category - Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets By Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              {/* Simple Donut Chart */}
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="20"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f97316" strokeWidth="20" 
                    strokeDasharray="75.4 175.6" strokeDashoffset="0"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="20" 
                    strokeDasharray="62.8 188.4" strokeDashoffset="-75.4"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20" 
                    strokeDasharray="62.8 188.4" strokeDashoffset="-138.2"/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-gray-900">40</div>
                  <div className="text-xs text-gray-600">Total Tickets</div>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-gray-700">Technical Support</span>
                </div>
                <span className="text-sm font-medium text-gray-900">44.75%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-700">Billing And Payments</span>
                </div>
                <span className="text-sm font-medium text-gray-900">46.27%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-700">Billing And Payments</span>
                </div>
                <span className="text-sm font-medium text-gray-900">25%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Publications Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Publications</CardTitle>
          <div className="flex items-center gap-2">
            <select className="text-sm border rounded px-2 py-1">
              <option>All Time</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Ticket ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Full Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Created On</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Subject</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">#001</td>
                  <td className="py-3 px-4 text-sm text-gray-900">John Doe</td>
                  <td className="py-3 px-4 text-sm text-gray-600">john@example.com</td>
                  <td className="py-3 px-4 text-sm text-gray-600">2024-11-28</td>
                  <td className="py-3 px-4 text-sm text-gray-600">Container Issue</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Active</span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">#002</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Jane Smith</td>
                  <td className="py-3 px-4 text-sm text-gray-600">jane@example.com</td>
                  <td className="py-3 px-4 text-sm text-gray-600">2024-11-27</td>
                  <td className="py-3 px-4 text-sm text-gray-600">Logistics Query</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Pending</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">#003</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Mike Johnson</td>
                  <td className="py-3 px-4 text-sm text-gray-600">mike@example.com</td>
                  <td className="py-3 px-4 text-sm text-gray-600">2024-11-26</td>
                  <td className="py-3 px-4 text-sm text-gray-600">Payment Issue</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">Resolved</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

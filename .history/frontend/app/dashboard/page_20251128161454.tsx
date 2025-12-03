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
  DollarSign,
  FileText,
  Download
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Quick Overview
        </h1>
        <p className="text-sm text-gray-500">
          This is all over platform sales generated
        </p>
      </div>

      {/* Stats Cards Row 1 - Main Metrics with gradient backgrounds and rounded corners */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users Card */}
        <Card className="relative overflow-hidden border-0 shadow-md rounded-3xl bg-gradient-to-br from-purple-100 via-purple-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Total Users</p>
                <h3 className="text-4xl font-bold text-gray-900">232</h3>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              <span className="text-green-600 font-semibold">(420 New)</span>
            </p>
          </CardContent>
        </Card>

        {/* Total Agents Card */}
        <Card className="relative overflow-hidden border-0 shadow-md rounded-3xl bg-gradient-to-br from-blue-100 via-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Total Agents</p>
                <h3 className="text-4xl font-bold text-gray-900">87</h3>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              <span className="text-green-600 font-semibold">(31 New)</span>
            </p>
          </CardContent>
        </Card>

        {/* Total Categories Card */}
        <Card className="relative overflow-hidden border-0 shadow-md rounded-3xl bg-gradient-to-br from-cyan-100 via-cyan-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Total Categories</p>
                <h3 className="text-4xl font-bold text-gray-900">22</h3>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              <span className="text-green-600 font-semibold">(2 New)</span>
            </p>
          </CardContent>
        </Card>

        {/* Total Subscriber Card */}
        <Card className="relative overflow-hidden border-0 shadow-md rounded-3xl bg-gradient-to-br from-indigo-100 via-indigo-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Total Articles</p>
                <h3 className="text-4xl font-bold text-gray-900">18</h3>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              <span className="text-green-600 font-semibold">(9 Recent)</span>
            </p>
          </CardContent>
        </Card>

        {/* Total Subscriber Card - moved to second row */}
        <Card className="relative overflow-hidden border-0 shadow-md rounded-3xl bg-gradient-to-br from-yellow-100 via-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Total Subscriber</p>
                <h3 className="text-4xl font-bold text-gray-900">3.8k</h3>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              <span className="text-green-600 font-semibold">(1237 New)</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards Row 2 - Tickets Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tickets */}
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-4xl font-bold text-gray-900 mb-2">265</h3>
                <p className="text-sm text-gray-600">Total Tickets</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <ArrowUpRight className="w-3 h-3 text-green-600" />
              <span className="font-semibold text-green-600">4k ↑</span>
              <span className="text-gray-500">All time activity</span>
            </div>
          </CardContent>
        </Card>

        {/* Pending Tickets */}
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-4xl font-bold text-gray-900 mb-2">256</h3>
                <p className="text-sm text-gray-600">Pending Tickets</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <ArrowUpRight className="w-3 h-3 text-green-600" />
              <span className="font-semibold text-green-600">4k ↑</span>
              <span className="text-gray-500">All time activity</span>
            </div>
          </CardContent>
        </Card>

        {/* Solved Tickets */}
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-4xl font-bold text-gray-900 mb-2">43</h3>
                <p className="text-sm text-gray-600">Solved Tickets</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <ArrowDownRight className="w-3 h-3 text-gray-400" />
              <span className="font-semibold text-gray-600">12 ↑</span>
              <span className="text-gray-500">All time activity</span>
            </div>
          </CardContent>
        </Card>

        {/* Closed Tickets */}
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-4xl font-bold text-gray-900 mb-2">12</h3>
                <p className="text-sm text-gray-600">Closed Tickets</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <ArrowDownRight className="w-3 h-3 text-gray-400" />
              <span className="font-semibold text-gray-600">0 ↑</span>
              <span className="text-gray-500">All time activity</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets By User - Bar Chart */}
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Tickets By User</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Bar Chart */}
            <div className="flex items-end justify-between h-48 gap-3 mb-6">
              {[
                { month: 'Jul', height: '60%', colors: 'from-green-400 via-green-300 to-green-200' },
                { month: 'Aug', height: '75%', colors: 'from-orange-400 via-purple-300 to-green-200' },
                { month: 'Sep', height: '50%', colors: 'from-green-400 via-green-300 to-green-200' },
                { month: 'Oct', height: '90%', colors: 'from-orange-400 via-purple-300 to-green-200' },
                { month: 'Nov', height: '45%', colors: 'from-green-400 via-purple-300 to-orange-200' },
                { month: 'Dec', height: '70%', colors: 'from-orange-400 via-purple-300 to-green-200' },
                { month: 'Jan', height: '80%', colors: 'from-orange-400 via-purple-300 to-green-200' },
                { month: 'Feb', height: '65%', colors: 'from-green-400 via-purple-300 to-orange-200' },
                { month: 'Mar', height: '85%', colors: 'from-orange-400 via-green-300 to-purple-200' },
                { month: 'Apr', height: '55%', colors: 'from-green-400 via-purple-300 to-orange-200' },
                { month: 'May', height: '75%', colors: 'from-green-400 via-orange-300 to-purple-200' },
                { month: 'Jun', height: '95%', colors: 'from-orange-400 via-purple-300 to-green-200' },
              ].map((bar, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className={`w-full bg-gradient-to-t ${bar.colors} rounded-t-lg transition-all hover:opacity-80`}
                    style={{ height: bar.height }}
                  ></div>
                  <span className="text-xs mt-2 text-gray-500">{bar.month}</span>
                </div>
              ))}
            </div>

            {/* Stats Summary */}
            <div className="flex items-center justify-around pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">234</p>
                  <p className="text-xs text-gray-500">Total Tickets</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">16</p>
                  <p className="text-xs text-gray-500">Open Tickets</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">43</p>
                  <p className="text-xs text-gray-500">Closed Tickets</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets By Category - Donut Chart */}
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Tickets By Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              {/* Donut Chart */}
              <div className="relative w-52 h-52 mb-6">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {/* Background circle */}
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#f3f4f6" strokeWidth="12"/>
                  
                  {/* Orange segment (Technical Support - 44.75%) */}
                  <circle 
                    cx="50" cy="50" r="35" 
                    fill="none" 
                    stroke="#fb923c" 
                    strokeWidth="12" 
                    strokeDasharray="98 220"
                    strokeDashoffset="0"
                    className="transition-all"
                  />
                  
                  {/* Purple segment (Billing - 46.27%) */}
                  <circle 
                    cx="50" cy="50" r="35" 
                    fill="none" 
                    stroke="#c084fc" 
                    strokeWidth="12" 
                    strokeDasharray="101 220"
                    strokeDashoffset="-98"
                    className="transition-all"
                  />
                  
                  {/* Green segment (25%) */}
                  <circle 
                    cx="50" cy="50" r="35" 
                    fill="none" 
                    stroke="#4ade80" 
                    strokeWidth="12" 
                    strokeDasharray="55 220"
                    strokeDashoffset="-199"
                    className="transition-all"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-gray-900">40</div>
                  <div className="text-xs text-gray-500">Total Tickets</div>
                </div>
              </div>

              {/* Legend */}
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                    <span className="text-sm text-gray-700">Technical Support</span>
                  </div>
                  <span className="text-sm font-semibold text-orange-600">↑ 44.75%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                    <span className="text-sm text-gray-700">Billing And Payments</span>
                  </div>
                  <span className="text-sm font-semibold text-purple-600">↑ 46.27%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="text-sm text-gray-700">Billing And Payments</span>
                  </div>
                  <span className="text-sm font-semibold text-red-600">↓ 25%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Publications Table */}
      <Card className="border-0 shadow-sm rounded-2xl bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold">Recent Publications</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8">
              <Download className="h-4 w-4 mr-1" />
            </Button>
            <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-600">
              <option>All Time ▼</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Ticket ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Full Name</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Created On</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Subject</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {/* Sample rows - you can add more data here */}
                <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-600">#001</td>
                  <td className="py-3 px-4 text-sm text-gray-900">John Doe</td>
                  <td className="py-3 px-4 text-sm text-gray-600">john@example.com</td>
                  <td className="py-3 px-4 text-sm text-gray-600">2024-11-28</td>
                  <td className="py-3 px-4 text-sm text-gray-600">Container Issue</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700">Active</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-600">#002</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Jane Smith</td>
                  <td className="py-3 px-4 text-sm text-gray-600">jane@example.com</td>
                  <td className="py-3 px-4 text-sm text-gray-600">2024-11-27</td>
                  <td className="py-3 px-4 text-sm text-gray-600">Logistics Query</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-50 text-yellow-700">Pending</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-600">#003</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Mike Johnson</td>
                  <td className="py-3 px-4 text-sm text-gray-600">mike@example.com</td>
                  <td className="py-3 px-4 text-sm text-gray-600">2024-11-26</td>
                  <td className="py-3 px-4 text-sm text-gray-600">Payment Issue</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">Resolved</span>
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

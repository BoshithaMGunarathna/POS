"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, TrendingUp, AlertTriangle, DollarSign } from "lucide-react"
import { mockProducts } from "@/lib/mock-data"

export default function InventoryOverview() {
  const totalProducts = mockProducts.length
  const lowStockProducts = mockProducts.filter((p) => p.stock <= 10 && p.stock > 0).length
  const outOfStockProducts = mockProducts.filter((p) => p.stock === 0).length
  const totalValue = mockProducts.reduce((sum, p) => sum + p.price * p.stock, 0)

  const recentActivity = [
    { id: "1", action: "Stock Updated", product: "Wireless Headphones", change: "+50 units", time: "2 hours ago" },
    { id: "2", action: "New Product Added", product: "Gaming Mouse", change: "Initial stock: 25", time: "4 hours ago" },
    { id: "3", action: "Low Stock Alert", product: "USB Cable", change: "Only 5 left", time: "6 hours ago" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active products in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">Items with stock ≤ 10</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockProducts}</div>
            <p className="text-xs text-muted-foreground">Items requiring restock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total inventory worth</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.product}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{activity.change}</Badge>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium">Bulk Import</p>
              <p className="text-xs text-gray-500">Import products from CSV</p>
            </div>
            <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium">Generate Report</p>
              <p className="text-xs text-gray-500">Export inventory report</p>
            </div>
            <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium">Stock Alerts</p>
              <p className="text-xs text-gray-500">Configure alert thresholds</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

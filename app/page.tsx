"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ShoppingCart } from "lucide-react"
import AdminPanel from "./admin/page"
import CashierPanel from "./cashier/page"

export default function POSSystem() {
  const [currentPanel, setCurrentPanel] = useState<"selection" | "admin" | "cashier">("selection")

  if (currentPanel === "admin") {
    return <AdminPanel onBack={() => setCurrentPanel("selection")} />
  }

  if (currentPanel === "cashier") {
    return <CashierPanel onBack={() => setCurrentPanel("selection")} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">RetailPOS System</h1>
          <p className="text-gray-600">Select your role to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentPanel("admin")}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl">Admin Panel</CardTitle>
              <CardDescription>Manage products, inventory, and system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>• Add/Edit/Delete Products & Categories</li>
                <li>• Manage Inventory & Stock Levels</li>
                <li>• User Management & Reports</li>
                <li>• System Configuration</li>
              </ul>
              <Button className="w-full" size="lg">
                Access Admin Panel
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentPanel("cashier")}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Cashier Panel</CardTitle>
              <CardDescription>Process sales and manage transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>• Product Selection & Barcode Scanning</li>
                <li>• Shopping Cart Management</li>
                <li>• Payment Processing</li>
                <li>• Receipt Generation</li>
              </ul>
              <Button className="w-full bg-transparent" size="lg" variant="outline">
                Access Cashier Panel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

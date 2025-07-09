"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, User, DollarSign, Package, Trash2 } from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface ParkedBill {
  id: string
  customerName: string
  items: CartItem[]
  total: number
  parkedAt: Date
  cashierId: string
}

interface HoldResumePanelProps {
  isOpen: boolean
  onClose: () => void
  parkedBills: ParkedBill[]
  onResumeBill: (bill: ParkedBill) => void
  onParkCurrentBill: (customerName: string) => void
  currentCart: CartItem[]
  currentTotal: number
}

export default function HoldResumePanel({
  isOpen,
  onClose,
  parkedBills,
  onResumeBill,
  onParkCurrentBill,
  currentCart,
  currentTotal,
}: HoldResumePanelProps) {
  const [customerName, setCustomerName] = useState("")

  const handleParkBill = () => {
    if (customerName.trim() && currentCart.length > 0) {
      onParkCurrentBill(customerName.trim())
      setCustomerName("")
      onClose()
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date)
  }

  const getTimeDifference = (date: Date) => {
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    if (diff < 60) return `${diff}m ago`
    const hours = Math.floor(diff / 60)
    return `${hours}h ${diff % 60}m ago`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Hold & Resume Sales</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="resume" className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resume">Resume Parked Bills ({parkedBills.length})</TabsTrigger>
            <TabsTrigger value="hold">Hold Current Bill</TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="mt-4 h-[500px] overflow-auto">
            {parkedBills.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No parked bills</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parkedBills.map((bill) => (
                  <Card key={bill.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {bill.customerName}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(bill.parkedAt)} • {getTimeDifference(bill.parkedAt)}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {bill.items.length} items
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        {bill.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="truncate">
                              {item.name} x{item.quantity}
                            </span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        {bill.items.length > 3 && (
                          <p className="text-xs text-gray-500">+{bill.items.length - 3} more items</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-lg font-bold">
                          <DollarSign className="w-4 h-4" />
                          {bill.total.toFixed(2)}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" onClick={() => onResumeBill(bill)}>
                            Resume
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="hold" className="mt-4">
            <div className="space-y-6">
              {currentCart.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No items in current cart to park</p>
                </div>
              ) : (
                <>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3">Current Cart Summary</h3>
                      <div className="space-y-2 mb-4">
                        {currentCart.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>
                              {item.name} x{item.quantity}
                            </span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>${currentTotal.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customer-name">Customer Name/Reference</Label>
                      <Input
                        id="customer-name"
                        placeholder="Enter customer name or table number"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <Button onClick={handleParkBill} disabled={!customerName.trim()} className="w-full" size="lg">
                      Park This Bill
                    </Button>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

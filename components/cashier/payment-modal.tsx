"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Banknote, Smartphone, Receipt } from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  total: number
  items: CartItem[]
  onPaymentComplete: () => void
}

export default function PaymentModal({ isOpen, onClose, total, items, onPaymentComplete }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [cashReceived, setCashReceived] = useState("")
  const [showReceipt, setShowReceipt] = useState(false)

  const change = Number.parseFloat(cashReceived) - total
  const tax = total * 0.08 // 8% tax
  const subtotal = total - tax

  const handlePayment = () => {
    setShowReceipt(true)
  }

  const handleComplete = () => {
    onPaymentComplete()
    setShowReceipt(false)
    onClose()
    setCashReceived("")
  }

  if (showReceipt) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Receipt
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center border-b pb-4">
              <h3 className="font-bold">RetailPOS Store</h3>
              <p className="text-sm text-gray-600">123 Main Street</p>
              <p className="text-sm text-gray-600">City, State 12345</p>
              <p className="text-sm text-gray-600">Tel: (555) 123-4567</p>
            </div>

            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              {paymentMethod === "cash" && (
                <>
                  <div className="flex justify-between text-sm">
                    <span>Cash Received:</span>
                    <span>${Number.parseFloat(cashReceived).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Change:</span>
                    <span>${change.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="text-center text-xs text-gray-500 border-t pt-2">
              <p>Thank you for your business!</p>
              <p>{new Date().toLocaleString()}</p>
            </div>

            <Button onClick={handleComplete} className="w-full">
              Complete Transaction
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment - ${total.toFixed(2)}</DialogTitle>
        </DialogHeader>

        <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cash" className="flex items-center gap-1">
              <Banknote className="w-4 h-4" />
              Cash
            </TabsTrigger>
            <TabsTrigger value="card" className="flex items-center gap-1">
              <CreditCard className="w-4 h-4" />
              Card
            </TabsTrigger>
            <TabsTrigger value="digital" className="flex items-center gap-1">
              <Smartphone className="w-4 h-4" />
              Digital
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cash" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cash Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cash-received">Cash Received</Label>
                  <Input
                    id="cash-received"
                    type="number"
                    placeholder="0.00"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    className="text-lg"
                    step="0.01"
                  />
                </div>
                {cashReceived && Number.parseFloat(cashReceived) >= total && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      Change: <span className="font-bold">${change.toFixed(2)}</span>
                    </p>
                  </div>
                )}
                <Button
                  onClick={handlePayment}
                  disabled={!cashReceived || Number.parseFloat(cashReceived) < total}
                  className="w-full"
                  size="lg"
                >
                  Process Cash Payment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="card" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Card Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Insert or tap card to pay</p>
                  <Button onClick={handlePayment} className="w-full" size="lg">
                    Process Card Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="digital" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Digital Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Smartphone className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Scan QR code or use NFC</p>
                  <Button onClick={handlePayment} className="w-full" size="lg">
                    Process Digital Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

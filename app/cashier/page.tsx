"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Scan, ShoppingCart, CreditCard, Trash2 } from "lucide-react"
import ProductGrid from "@/components/cashier/product-grid"
import CategoryFilter from "@/components/cashier/category-filter"
import ShoppingCartSummary from "@/components/cashier/shopping-cart-summary"
import PaymentModal from "@/components/cashier/payment-modal"
import { mockProducts, mockCategories } from "@/lib/mock-data"
// Add these imports
import HoldResumePanel from "@/components/cashier/hold-resume-panel"
import QuickAccessProducts from "@/components/cashier/quick-access-products"
import CashReconciliationModal from "@/components/cashier/cash-reconciliation-modal"
import { mockParkedBills, mockQuickAccessProducts, mockShifts } from "@/lib/mock-data"
// Add these imports at the top:
import CashierSwitcher from "@/components/cashier/cashier-switcher"
import CashierSalesSummary from "@/components/cashier/cashier-sales-summary"
import { mockMachines, mockCashierSessions } from "@/lib/mock-data"

interface CashierPanelProps {
  onBack: () => void
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export default function CashierPanel({ onBack }: CashierPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [showPayment, setShowPayment] = useState(false)
  // Add these state variables after existing ones:
  const [parkedBills, setParkedBills] = useState(mockParkedBills)
  const [showHoldResume, setShowHoldResume] = useState(false)
  const [showCashReconciliation, setShowCashReconciliation] = useState(false)
  const [currentShift, setCurrentShift] = useState(mockShifts[0])
  const [discount, setDiscount] = useState({ type: "none", value: 0, code: "" })
  // Add these state variables after existing ones:
  const [currentCashier, setCurrentCashier] = useState({
    id: "cashier-1",
    name: "John Smith",
    email: "john@example.com",
    totalSales: 450.75,
    transactionCount: 12,
    hoursWorked: 4,
    breakTime: 30,
    machines: ["Machine 1"],
    status: "active",
  })
  const [currentMachine, setCurrentMachine] = useState(mockMachines[0])
  const [isOnBreak, setIsOnBreak] = useState(false)
  const [currentBreakStart, setCurrentBreakStart] = useState<Date | null>(null)

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.barcode.includes(searchQuery)
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ]
    })
  }

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id))
    } else {
      setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Add these functions before the return statement:
  const parkCurrentBill = (customerName: string) => {
    if (cart.length === 0) return

    const newParkedBill = {
      id: `park-${Date.now()}`,
      customerName,
      items: [...cart],
      total: cartTotal,
      parkedAt: new Date(),
      cashierId: currentShift.cashierId,
    }

    setParkedBills((prev) => [...prev, newParkedBill])
    clearCart()
  }

  const resumeParkedBill = (bill: any) => {
    setCart(bill.items)
    setParkedBills((prev) => prev.filter((b) => b.id !== bill.id))
    setShowHoldResume(false)
  }

  const applyDiscount = (discountType: string, value: number, code?: string) => {
    setDiscount({ type: discountType, value, code: code || "" })
  }

  const calculateDiscountAmount = () => {
    if (discount.type === "percentage") {
      return cartTotal * (discount.value / 100)
    } else if (discount.type === "fixed") {
      return Math.min(discount.value, cartTotal)
    }
    return 0
  }

  const discountAmount = calculateDiscountAmount()
  const finalTotal = cartTotal - discountAmount

  // Add these functions before the return statement:
  const handleCashierChange = (cashier: any, machine: any) => {
    setCurrentCashier(cashier)
    setCurrentMachine(machine)
    // In real app, this would create a new session record
    console.log(`Cashier ${cashier.name} logged into ${machine.name}`)
  }

  const handleBreakStart = (type: string) => {
    setIsOnBreak(true)
    setCurrentBreakStart(new Date())
    console.log(`Break started: ${type}`)
  }

  const handleBreakEnd = () => {
    if (currentBreakStart) {
      const breakDuration = Math.floor((new Date().getTime() - currentBreakStart.getTime()) / (1000 * 60))
      console.log(`Break ended. Duration: ${breakDuration} minutes`)
    }
    setIsOnBreak(false)
    setCurrentBreakStart(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* Replace the existing header div with: */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Cashier Terminal</h1>
              <p className="text-sm text-gray-600">Process customer transactions</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <CashierSwitcher
              currentCashier={currentCashier}
              currentMachine={currentMachine}
              onCashierChange={handleCashierChange}
              onBreakStart={handleBreakStart}
              onBreakEnd={handleBreakEnd}
              isOnBreak={isOnBreak}
            />

            <CashierSalesSummary
              cashier={currentCashier}
              sessions={mockCashierSessions.filter((s) => s.cashierId === currentCashier.id)}
            />

            <Button variant="outline" size="sm" onClick={() => setShowHoldResume(true)} className="relative">
              Hold/Resume
              {parkedBills.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">{parkedBills.length}</Badge>
              )}
            </Button>

            <Badge variant="outline" className="text-sm">
              <ShoppingCart className="w-4 h-4 mr-1" />
              {cartItemCount} items
            </Badge>
            <div className="text-right">
              <p className="text-sm font-medium">${finalTotal.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Product Selection */}
        <div className="flex-1 p-4 overflow-auto">
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name or scan barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button size="lg" variant="outline" className="px-6 bg-transparent">
                <Scan className="w-5 h-5 mr-2" />
                Scan
              </Button>
            </div>

            <CategoryFilter
              categories={mockCategories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
            {/* Add this after the CategoryFilter component: */}
            <QuickAccessProducts products={mockQuickAccessProducts} onProductSelect={addToCart} />
          </div>

          {/* Product Grid */}
          <ProductGrid products={filteredProducts} onProductSelect={addToCart} />
        </div>

        {/* Right Panel - Shopping Cart */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Current Order</h2>
              {cart.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <ShoppingCartSummary items={cart} onUpdateQuantity={updateCartQuantity} onRemoveItem={removeFromCart} />
          </div>

          {/* Checkout Section */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <Button size="lg" className="w-full" disabled={cart.length === 0} onClick={() => setShowPayment(true)}>
                <CreditCard className="w-5 h-5 mr-2" />
                Proceed to Payment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add these before the PaymentModal: */}
      <HoldResumePanel
        isOpen={showHoldResume}
        onClose={() => setShowHoldResume(false)}
        parkedBills={parkedBills}
        onResumeBill={resumeParkedBill}
        onParkCurrentBill={parkCurrentBill}
        currentCart={cart}
        currentTotal={cartTotal}
      />

      <CashReconciliationModal
        isOpen={showCashReconciliation}
        onClose={() => setShowCashReconciliation(false)}
        shift={currentShift}
        onReconciliationComplete={(data) => {
          console.log("Reconciliation completed:", data)
          setShowCashReconciliation(false)
        }}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        total={cartTotal}
        items={cart}
        onPaymentComplete={clearCart}
      />
    </div>
  )
}

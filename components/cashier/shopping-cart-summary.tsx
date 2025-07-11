"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface ShoppingCartSummaryProps {
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  discount?: { type: string; value: number; code: string }
  onApplyDiscount?: (type: string, value: number, code?: string) => void
}

export default function ShoppingCartSummary({
  items,
  onUpdateQuantity,
  onRemoveItem,
  discount,
  onApplyDiscount,
}: ShoppingCartSummaryProps) {
  if (items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No items in cart</p>
        <p className="text-sm">Scan or select products to add them</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-12 h-12 rounded object-cover" />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{item.name}</h4>
            <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-transparent"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) => onUpdateQuantity(item.id, Number.parseInt(e.target.value) || 0)}
              className="w-16 h-8 text-center"
              min="0"
            />
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-transparent"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <div className="text-right">
            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
              onClick={() => onRemoveItem(item.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ))}
      {items.length > 0 && onApplyDiscount && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <DiscountSection onApplyDiscount={onApplyDiscount} currentDiscount={discount} />
        </div>
      )}
    </div>
  )
}

function DiscountSection({ onApplyDiscount, currentDiscount }: any) {
  const [discountType, setDiscountType] = useState("none")
  const [discountValue, setDiscountValue] = useState("")
  const [promoCode, setPromoCode] = useState("")

  const handleApplyDiscount = () => {
    const value = Number.parseFloat(discountValue) || 0
    onApplyDiscount(discountType, value, promoCode)
  }

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-sm">Apply Discount</h3>
      <div className="space-y-2">
        <select
          value={discountType}
          onChange={(e) => setDiscountType(e.target.value)}
          className="w-full p-2 border rounded text-sm"
        >
          <option value="none">No Discount</option>
          <option value="percentage">Percentage (%)</option>
          <option value="fixed">Fixed Amount ($)</option>
        </select>

        {discountType !== "none" && (
          <>
            <Input
              type="number"
              placeholder={discountType === "percentage" ? "Enter %" : "Enter $"}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className="text-sm"
            />
            <Input
              placeholder="Promo code (optional)"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="text-sm"
            />
            <Button onClick={handleApplyDiscount} size="sm" className="w-full">
              Apply Discount
            </Button>
          </>
        )}

        {currentDiscount && currentDiscount.type !== "none" && (
          <div className="text-xs text-green-600">
            Discount applied:{" "}
            {currentDiscount.type === "percentage" ? `${currentDiscount.value}%` : `$${currentDiscount.value}`}
            {currentDiscount.code && ` (${currentDiscount.code})`}
          </div>
        )}
      </div>
    </div>
  )
}

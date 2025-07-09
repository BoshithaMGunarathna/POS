"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  image: string
  stock: number
}

interface QuickAccessProductsProps {
  products: Product[]
  onProductSelect: (product: Product) => void
}

export default function QuickAccessProducts({ products, onProductSelect }: QuickAccessProductsProps) {
  if (products.length === 0) return null

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Quick Access Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {products.map((product) => (
            <Button
              key={product.id}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center p-3 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
              onClick={() => onProductSelect(product)}
              disabled={product.stock === 0}
            >
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-8 h-8 object-cover rounded mb-1"
              />
              <span className="text-xs font-medium text-center line-clamp-2">{product.name}</span>
              <span className="text-xs text-green-600 font-bold">${product.price.toFixed(2)}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

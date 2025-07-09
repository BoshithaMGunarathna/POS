"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  image: string
  stock: number
  barcode: string
}

interface ProductGridProps {
  products: Product[]
  onProductSelect: (product: Product) => void
}

export default function ProductGrid({ products, onProductSelect }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => (
        <Card
          key={product.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onProductSelect(product)}
        >
          <CardContent className="p-3">
            <div className="aspect-square mb-3 relative">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover rounded"
              />
              {product.stock <= 5 && product.stock > 0 && (
                <Badge variant="secondary" className="absolute top-1 right-1 text-xs">
                  Low Stock
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="destructive" className="absolute top-1 right-1 text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</span>
                <Button
                  size="sm"
                  className="h-8 w-8 p-0"
                  disabled={product.stock === 0}
                  onClick={(e) => {
                    e.stopPropagation()
                    onProductSelect(product)
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">Stock: {product.stock}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

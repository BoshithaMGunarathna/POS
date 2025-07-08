"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { mockBrands } from "@/lib/mock-data"

export default function BrandManagement() {
  const [brands, setBrands] = useState(mockBrands)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleDeleteBrand = (id: string) => {
    setBrands((prev) => prev.filter((brand) => brand.id !== id))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Brand Management</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Brand
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Brand</DialogTitle>
                </DialogHeader>
                <BrandForm onClose={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map((brand) => (
              <Card key={brand.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={brand.logo || "/placeholder.svg"}
                      alt={brand.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{brand.name}</h3>
                      <p className="text-sm text-gray-500">{brand.description}</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBrand(brand.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function BrandForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="name">Brand Name</Label>
        <Input id="name" placeholder="Enter brand name" />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" placeholder="Enter description" />
      </div>
      <div>
        <Label htmlFor="logo">Logo URL</Label>
        <Input id="logo" placeholder="Enter logo URL" />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" onClick={onClose}>
          Add Brand
        </Button>
      </div>
    </form>
  )
}

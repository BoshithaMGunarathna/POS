"use client"

import { Button } from "@/components/ui/button"

interface Category {
  id: string
  name: string
  image: string
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
  onCategorySelect: (categoryId: string | null) => void
}

export default function CategoryFilter({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onCategorySelect(null)}
        className="h-10"
      >
        All Categories
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategorySelect(category.id)}
          className="h-10 flex items-center gap-2"
        >
          <img
            src={category.image || "/placeholder.svg"}
            alt={category.name}
            className="w-5 h-5 rounded object-cover"
          />
          {category.name}
        </Button>
      ))}
    </div>
  )
}

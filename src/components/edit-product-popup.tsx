'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
}

interface EditProductPopupProps {
  product?: Product
  onClose: () => void
  onSave: (updatedProduct: Product) => void
}

const defaultProduct: Product = {
  id: '',
  name: '',
  description: '',
  price: 0,
  category: '',
  stock: 0
}

export function EditProductPopupComponent({ product = defaultProduct, onClose, onSave }: EditProductPopupProps) {
  const [editedProduct, setEditedProduct] = useState<Product>(defaultProduct)

  useEffect(() => {
    if (product) {
      setEditedProduct(product)
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedProduct(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value }))
  }

  const handleCategoryChange = (value: string) => {
    setEditedProduct(prev => ({ ...prev, category: value }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSave(editedProduct)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Edit Product</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={editedProduct.name} 
              onChange={handleChange} 
              placeholder="Enter product name" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={editedProduct.description} 
              onChange={handleChange} 
              placeholder="Enter product description" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input 
              id="price" 
              name="price" 
              type="number" 
              value={editedProduct.price} 
              onChange={handleChange} 
              placeholder="Enter price" 
              min="0" 
              step="0.01" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input 
              id="stock" 
              name="stock" 
              type="number" 
              value={editedProduct.stock} 
              onChange={handleChange} 
              placeholder="Enter stock quantity" 
              min="0" 
              step="1" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={editedProduct.category} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="home">Home & Garden</SelectItem>
                <SelectItem value="toys">Toys & Games</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </div>
    </div>
  )
}
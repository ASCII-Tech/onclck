"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/lib/types"; // Import shared type

interface EditProductPopupProps {
  product?: Product;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

const defaultProduct: Product = {
  product_id: 1,
  name: "",
  description: "",
  price: 0,
  stock: 0,
  sku: "",
  category: "",
};

export function EditProductPopupComponent({
  product = defaultProduct,
  onClose,
  onSave,
}: EditProductPopupProps) {
  const [editedProduct, setEditedProduct] = useState<Product>(defaultProduct);

  useEffect(() => {
    if (product) {
      setEditedProduct(product);
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setEditedProduct((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(editedProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card text-card-foreground border w-full max-w-md rounded-xl shadow-lg flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b shrink-0">
          <div>
            <h2 className="text-xl font-semibold">Edit Product</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={editedProduct.name}
              onChange={handleChange}
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
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={editedProduct.price}
                onChange={handleChange}
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
                required
              />
            </div>
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
              </SelectContent>
            </Select>
          </div>
          <div className="pt-4 flex gap-3">
            <Button type="button" variant="outline" className="w-full" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

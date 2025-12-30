"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define the shape of a new product (no ID yet)
export interface NewProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  category: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: NewProduct) => Promise<void>; // Async to handle loading state
}

const initialProduct: NewProduct = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  sku: "",
  category: "",
};

export function AddProductModal({ isOpen, onClose, onSave }: AddProductModalProps) {
  const [newProduct, setNewProduct] = useState<NewProduct>(initialProduct);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setNewProduct((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(newProduct);
      setNewProduct(initialProduct); // Reset form on success
      onClose();
    } catch (error) {
      console.error("Failed to add product", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={newProduct.name}
              onChange={handleChange}
              placeholder="e.g. Wireless Headphones"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={newProduct.description}
              onChange={handleChange}
              placeholder="Product details..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (ETB)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={newProduct.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={newProduct.stock}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU / Currency Code</Label>
            <Input
              id="sku"
              name="sku"
              value={newProduct.sku}
              onChange={handleChange}
              placeholder="e.g. ETB"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={newProduct.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="home">Home & Garden</SelectItem>
                <SelectItem value="toys">Toys & Games</SelectItem>
                <SelectItem value="books">Books</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

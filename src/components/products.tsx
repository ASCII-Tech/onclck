'use client';

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"

type Product = {
  id: number
  name: string
  description: string
  price: number
  stock: number
  sku: string
  category: string
  images: File[]
  tags: string[]
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Acme Circles T-Shirt",
      description: "60% combed ringspun cotton/40% polyester jersey tee.",
      price: 19.99,
      stock: 100,
      sku: "ACME-001",
      category: "Clothing",
      images: [],
      tags: [],
    },
    {
      id: 2,
      name: "Gamer Gear Pro Controller",
      description: "High-performance gaming controller.",
      price: 59.99,
      stock: 50,
      sku: "GGPC-001",
      category: "Electronics",
      images: [],
      tags: [],
    },
    {
      id: 3,
      name: "Luminous VR Headset",
      description: "Immersive virtual reality experience.",
      price: 199.99,
      stock: 25,
      sku: "LVRS-001",
      category: "Electronics",
      images: [],
      tags: [],
    },
    {
      id: 4,
      name: "Cozy Blanket",
      description: "Warm and soft for chilly nights.",
      price: 29.99,
      stock: 75,
      sku: "COZB-001",
      category: "Home",
      images: [],
      tags: [],
    },
    {
      id: 5,
      name: "Autumn Mug",
      description: "Enjoy your hot beverages in style.",
      price: 12.99,
      stock: 100,
      sku: "AUTM-001",
      category: "Home",
      images: [],
      tags: [],
    },
  ])
  
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortColumn, setSortColumn] = useState<keyof Product>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false)
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    sku: "",
    category: "",
    images: [],
    tags: [],
  })

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleSort = (column: keyof Product) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleAddProduct = () => {
    setShowAddProductModal(true)
  }

  const handleCloseAddProductModal = () => {
    setShowAddProductModal(false)
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      sku: "",
      category: "",
      images: [],
      tags: [],
    })
  }

  const handleSaveProduct = () => {
    setProducts([...products, { ...newProduct, id: products.length + 1 }])
    handleCloseAddProductModal()
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        images: [...prevProduct.images, event.target.files![0]],
      }))
    }
  }

  const handleTagAdd = (tag: string) => {
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      tags: [...prevProduct.tags, tag],
    }))
  }

  const handleTagRemove = (index: number) => {
    const updatedTags = [...newProduct.tags]
    updatedTags.splice(index, 1)
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      tags: updatedTags,
    }))
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={handleAddProduct}>Add New Product</Button>
      </div>
      <div className="mb-6">
        <Input placeholder="Search products..." value={searchTerm} onChange={handleSearch} className="w-full" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("name")}>
                Product Name {sortColumn === "name" && <span className="ml-2">{sortDirection === "asc" ? "▲" : "▼"}</span>}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("description")}>
                Description {sortColumn === "description" && <span className="ml-2">{sortDirection === "asc" ? "▲" : "▼"}</span>}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("price")}>
                Price {sortColumn === "price" && <span className="ml-2">{sortDirection === "asc" ? "▲" : "▼"}</span>}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("stock")}>
                Stock {sortColumn === "stock" && <span className="ml-2">{sortDirection === "asc" ? "▲" : "▼"}</span>}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("sku")}>
                SKU {sortColumn === "sku" && <span className="ml-2">{sortDirection === "asc" ? "▲" : "▼"}</span>}
              </th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => (
              <tr key={product.id}>
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">{product.description}</td>
                <td className="border px-4 py-2">${product.price.toFixed(2)}</td>
                <td className="border px-4 py-2">{product.stock}</td>
                <td className="border px-4 py-2">{product.sku}</td>
                <td className="border px-4 py-2">
                  <Link href="#" className="underline text-blue-600">{product.category}</Link>
                </td>
                <td className="border px-4 py-2">
                  <Button variant="outline">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={showAddProductModal} onOpenChange={setShowAddProductModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Fill in the details of the new product.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={newProduct.price}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={newProduct.stock}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                name="sku"
                value={newProduct.sku}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category">
                <option value="Clothing">Clothing</option>
                <option value="Electronics">Electronics</option>
                <option value="Home">Home</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="images">Product Images</Label>
              <Input
                id="images"
                name="images"
                type="file"
                onChange={handleImageUpload}
                multiple
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                value={newProduct.tags.join(", ")}
                onChange={(e) => setNewProduct({ ...newProduct, tags: e.target.value.split(", ") })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseAddProductModal}>Cancel</Button>
            <Button onClick={handleSaveProduct}>Save Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Products;
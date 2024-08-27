"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// This function component is named with camelCase, which is not typical for React components.
// React component names should start with an uppercase letter.
// Change the name from `addProduct` to `AddProduct` to follow convention.
export function AddProduct() {
  const [product, setProduct] = useState({
    image: "/placeholder.svg",
    name: "Cozy Knit Sweater",
    description: "A soft and warm knit sweater perfect for chilly days.",
    price: 59.99,
  })
  const [files, setFiles] = useState<FileList | null>(null)

  // Explicitly define the type for the event parameter
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.target.files)
  }

  // Explicitly define the type for the event parameter
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setProduct({
      image: "/placeholder.svg",
      name: "Cozy Knit Sweater",
      description: "A soft and warm knit sweater perfect for chilly days.",
      price: 59.99,
    })
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4 py-12">
      <div className="grid gap-4">
        <img
          src="/placeholder.svg"
          alt={product.name}
          width={600}
          height={600}
          className="w-full rounded-lg object-cover aspect-square"
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <UploadIcon className="w-4 h-4 mr-2" />
            Add files
          </Button>
          <input type="file" multiple className="hidden" onChange={handleFileUpload} />
        </div>
      </div>
      <div className="grid gap-6 my-2">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2 my-4">
            <Label htmlFor="description">Product Description</Label>
            <Textarea id="description" placeholder="Enter product description" className="w-full" />
          </div>
          <div className="grid gap-2 my-4">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" placeholder="Enter product name" className="w-full" />
          </div>
          <div className="grid gap-2 my-4">
            <Label htmlFor="price">Price</Label>
            <Input type="number" id="price" placeholder="Enter product price" className="w-full" />
          </div>
          <Button type="submit" className="mt-4">
            Generate a link
          </Button>
        </form>
      </div>
    </div>
  )
}

export default AddProduct;

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}

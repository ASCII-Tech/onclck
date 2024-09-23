'use client'

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function ProductDetails({ product }) {
  const [quantity, setQuantity] = useState(1)
  const productImage = useMemo(() => {
    try {
      const images = JSON.parse(product.product_images);
      return images[0].startsWith('/') ? images[0] : `/${images[0]}`;
    } catch (e) {
      console.error("Failed to parse product images:", e);
      return "/placeholder.svg";
    }
  }, [product.product_images]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 max-w-6xl mx-auto py-8 px-4 md:px-0">
      <div className="grid gap-8">
        <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-8">
          <Image
            src={productImage}
            alt={product.product_name}
            width={400}
            height={400}
            className="w-full aspect-square object-cover rounded-lg"
          />
          <div className="grid gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">{product.product_name}</h1>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{product.currency} {product.price}</span>
              <Input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20" 
              />
              <Badge variant="secondary" className="w-20 h-10">Stock: {product.stock_quantity}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/transaction/orderSummary?productId=${product.product_id}&quantity=${quantity}`}>
                <Button size="lg" className="w-full">
                  Buy It Now
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="lg" variant="outline" className="w-auto">
                    Delivery
                    <ChevronDownIcon className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>With Delivery</DropdownMenuItem>
                  <DropdownMenuItem>Non-Delivery</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          <h2 className="text-xl font-bold">Product Details</h2>
          <div className="grid gap-2">
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChevronDownIcon(props) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Minus,
  Plus,
  Truck,
  Package,
  ShoppingCart,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductData } from "@/lib/types";

export function ProductDetails({ product }: { product: ProductData }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState<"standard" | "express">(
    "standard",
  );

  // Safely parse images
  const productImage = useMemo(() => {
    try {
      if (!product.product_images) return "/placeholder.svg";
      const images = JSON.parse(product.product_images);
      const firstImage = Array.isArray(images) ? images[0] : images;
      if (!firstImage) return "/placeholder.svg";
      return firstImage.startsWith("/") ? firstImage : `/${firstImage}`;
    } catch (e) {
      console.error("Failed to parse product images:", e);
      return "/placeholder.svg";
    }
  }, [product.product_images]);

  // Quantity Handlers
  const increaseQty = () =>
    setQuantity((prev) => Math.min(prev + 1, product.stock_quantity));
  const decreaseQty = () => setQuantity((prev) => Math.max(1, prev - 1));

  // Construct Checkout URL
  const checkoutUrl = `/transaction/orderSummary?productId=${product.product_id
    }&quantity=${quantity}&productName=${encodeURIComponent(
      product.product_name,
    )}&delivery=${deliveryOption}`;

  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* --- Back Navigation --- */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 pl-0 hover:bg-transparent hover:text-primary transition-colors"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* --- Left Column: Image --- */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted/20 shadow-sm">
              <Image
                src={productImage}
                alt={product.product_name}
                fill
                className="object-cover transition-transform hover:scale-105 duration-500"
                priority
              />
            </div>
            {/* Thumbnail placeholder if you had multiple images */}
            {/* <div className="flex gap-4 overflow-x-auto pb-2"> ... </div> */}
          </div>

          {/* --- Right Column: Details --- */}
          <div className="flex flex-col space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-muted-foreground">
                  {product.category_id || "General"}
                </Badge>
                {product.stock_quantity > 0 ? (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200"
                  >
                    In Stock: {product.stock_quantity}
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {product.product_name}
              </h1>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  {product.currency} {product.price}
                </span>
                <span className="text-sm text-muted-foreground">/ unit</span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="prose prose-sm dark:prose-invert text-muted-foreground leading-relaxed">
              <p>{product.description}</p>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card shadow-sm">
                <span className="font-medium flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  Quantity
                </span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={decreaseQty}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={increaseQty}
                    disabled={quantity >= product.stock_quantity}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto min-w-[160px] justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        {deliveryOption === "standard"
                          ? "With Delivery"
                          : "Non-Delivery"}
                      </span>
                      <Check className="h-3 w-3 ml-2 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem
                      onClick={() => setDeliveryOption("standard")}
                    >
                      With Delivery
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeliveryOption("express")}
                    >
                      Non-Delivery
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link href={checkoutUrl} className="flex-1">
                  <Button
                    size="lg"
                    className="w-full text-lg shadow-md hover:shadow-lg transition-all"
                    disabled={product.stock_quantity < 1}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Buy It Now
                  </Button>
                </Link>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Secure checkout powered by ASCII Tech.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


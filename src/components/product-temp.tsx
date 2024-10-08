'use client'
import Link from "next/link"
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function productTemp() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 max-w-6xl mx-auto py-8 px-4 md:px-0">
        <div className="grid gap-8">
          <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-8">
            <img
              src="/placeholder.svg"
              alt="Product Image"
              width={400}
              height={400}
              className="w-full aspect-square object-cover rounded-lg"
            />
            <div className="grid gap-4">
              <h1 className="text-2xl md:text-3xl font-bold">Vintage Leather Briefcase</h1>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">$149.99</span>
                <Input type="number" id="price" placeholder="Stock quantity" className="w-20" />
                <Badge variant="secondary" id="stock" className="w-20, h-10">0</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/transaction/orderSummary">
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
              <p>
                This vintage leather briefcase is a timeless classic that combines style and functionality. Crafted from
                high-quality full-grain leather, it features a spacious main compartment, multiple pockets, and a
                durable shoulder strap for easy carrying.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default productTemp;

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
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

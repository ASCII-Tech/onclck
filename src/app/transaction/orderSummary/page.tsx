"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// --- Types ---
interface TransactionDetails {
  productId: string;
  quantity: string;
  amount: string;
  orderCode: string;
  privateCode: string;
}

// --- API Helpers ---
async function fetchProductDetails(id: string) {
  const response = await fetch(`/api/orderSummary?id=${id}`);
  if (!response.ok) throw new Error("Failed to fetch product details");
  return response.json();
}

async function fetchOrderCode() {
  const response = await fetch("/api/genCode");
  if (!response.ok) throw new Error("Failed to fetch order code");
  const data = await response.json();
  return data.orderCode;
}

async function fetchPrivateCode() {
  const response = await fetch("/api/genPrivateCode");
  if (!response.ok) throw new Error("Failed to fetch private code");
  const data = await response.json();
  return data.privateCode;
}

// --- Component ---
function OrderSummaryComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State
  const [productDetails, setProductDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Order Data
  const productId = searchParams.get("productId") || "";
  const productName = searchParams.get("productName") || "Unknown Product";
  const quantity = parseInt(searchParams.get("quantity") || "1");
  const initialDeliveryMethod = searchParams.get("delivery") === "express" ? "express" : "standard";

  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">(initialDeliveryMethod);
  const [paymentMethod, setPaymentMethod] = useState("telebirr");
  const [phoneNumber, setPhoneNumber] = useState("");

  const effectRan = useRef(false);

  useEffect(() => {
    if (!effectRan.current && productId) {
      const loadData = async () => {
        try {
          setLoading(true);
          const details = await fetchProductDetails(productId);
          setProductDetails(details);
        } catch (error) {
          console.error(error);
          alert("Failed to load product details.");
        } finally {
          setLoading(false);
        }
      };
      loadData();
      effectRan.current = true;
    }
  }, [productId]);

  // Calculations
  const price = productDetails ? Number(productDetails.price) : 0;
  const subtotal = price * quantity;

  // Standard (Delivery) = 150 ETB, Express (Self Pickup) = 0 ETB
  const actualShippingCost = deliveryMethod === "standard" ? 150.00 : 0.00;

  const taxRate = 0.15;
  const tax = subtotal * taxRate;
  const finalTotal = subtotal + actualShippingCost + tax;

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const orderCode = await fetchOrderCode();
      const privateCode = await fetchPrivateCode();

      const transactionDetails: TransactionDetails = {
        productId,
        quantity: quantity.toString(),
        amount: finalTotal.toFixed(2),
        orderCode,
        privateCode,
      };

      // Simplified: All payment methods redirect to invoice
      const queryString = new URLSearchParams(transactionDetails as any).toString();
      router.push(`/invoice?${queryString}`);

    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* --- Order Summary --- */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review items and shipping.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Line Item */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-semibold">{productName}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {quantity}</p>
                </div>
                <p className="font-medium">ETB {subtotal.toFixed(2)}</p>
              </div>

              <Separator />

              {/* Delivery Selection inside Summary */}
              <div className="space-y-3">
                <Label>Delivery Method</Label>
                <RadioGroup
                  defaultValue={deliveryMethod}
                  onValueChange={(v) => setDeliveryMethod(v as "standard" | "express")}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 border p-3 rounded-md has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                    <RadioGroupItem value="standard" id="delivery-std" />
                    <Label htmlFor="delivery-std" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Standard Delivery</div>
                      <div className="text-xs text-muted-foreground">150.00 ETB</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                    <RadioGroupItem value="express" id="delivery-express" />
                    <Label htmlFor="delivery-express" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Self Pickup</div>
                      <div className="text-xs text-muted-foreground">Free</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>ETB {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>ETB {actualShippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (15%)</span>
                  <span>ETB {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 text-foreground">
                  <span>Total</span>
                  <span>ETB {finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* --- Payment Details --- */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Select your payment method.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Select Provider</Label>
                <RadioGroup
                  defaultValue={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="grid grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="telebirr"
                    className={`flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all ${paymentMethod === "telebirr" ? "border-primary bg-primary/5" : ""
                      }`}
                  >
                    <RadioGroupItem value="telebirr" id="telebirr" className="sr-only" />
                    <PhoneIcon className="mb-2 h-6 w-6" />
                    <span className="font-semibold">Telebirr</span>
                  </Label>

                  <Label
                    htmlFor="cbebirr"
                    className={`flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all ${paymentMethod === "cbebirr" ? "border-primary bg-primary/5" : ""
                      }`}
                  >
                    <RadioGroupItem value="cbebirr" id="cbebirr" className="sr-only" />
                    <BanknoteIcon className="mb-2 h-6 w-6" />
                    <span className="font-semibold">CBE Birr</span>
                  </Label>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0911..."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-background"
                />
              </div>

              <Button
                className="w-full text-lg h-12"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ETB ${finalTotal.toFixed(2)}`
                )}
              </Button>
            </CardContent>
            <CardFooter className="justify-center border-t p-4 bg-muted/20">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <LockIcon className="h-3 w-3" /> Payments are secure and encrypted.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- Icons ---
function BanknoteIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function LockIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function OrderSummary() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <OrderSummaryComponent />
    </Suspense>
  );
}

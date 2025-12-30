"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import QrCode from "qrcode";
import {
  Loader2,
  Printer,
  CheckCircle2,
  AlertCircle,
  Home,
  ShoppingBag,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// --- Types ---
interface Product {
  name: string;
  description: string;
  price: number;
}

// --- API Functions ---
async function fetchProduct(productId: string) {
  const response = await fetch(`/api/products/${productId}`);
  if (!response.ok) throw new Error("Failed to fetch product");
  return response.json();
}

async function createOrderApi(
  orderCode: string,
  price: number,
  quantity: number,
  productId: string,
  privateCode: string
) {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderCode,
      price,
      quantity,
      productId,
      privateCode,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to create order");
  }
  return response.json();
}

// --- Main Component ---
function InvoiceComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL Params
  const productId = searchParams.get("productId") || "";
  const quantity = parseInt(searchParams.get("quantity") || "0", 10);
  const totalAmount = parseFloat(searchParams.get("amount") || "0");
  const orderCode = searchParams.get("orderCode") || "";
  const privateCode = searchParams.get("privateCode") || "";

  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [qrSrc, setQrSrc] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const effectRan = useRef(false);

  // 1. Process Order & Fetch Data
  useEffect(() => {
    if (!effectRan.current) {
      const processInvoice = async () => {
        try {
          if (!productId || !orderCode) {
            throw new Error("Invalid invoice parameters");
          }

          // Fetch Product Info for display
          const productData = await fetchProduct(productId);
          setProduct(productData);

          // Idempotency Check: Prevent double-creation on refresh
          // We check if this specific orderCode has already been processed locally
          const processedOrders = JSON.parse(localStorage.getItem("processedOrders") || "[]");

          if (!processedOrders.includes(orderCode)) {
            // Create Order in DB
            await createOrderApi(orderCode, totalAmount, quantity, productId, privateCode);

            // Mark as processed
            processedOrders.push(orderCode);
            localStorage.setItem("processedOrders", JSON.stringify(processedOrders));
          } else {
            console.log("Order already processed locally, skipping DB creation.");
          }

          setStatus("success");
        } catch (error: any) {
          console.error("Invoice Error:", error);
          setErrorMessage(error.message || "An unexpected error occurred.");
          setStatus("error");
        }
      };

      processInvoice();
      effectRan.current = true;
    }
  }, [productId, orderCode, quantity, totalAmount, privateCode]);

  // 2. Generate QR Code
  useEffect(() => {
    const generateQR = async () => {
      if (orderCode && privateCode && status === "success") {
        try {
          const host = window.location.hostname;
          const port = window.location.port;
          const protocol = window.location.protocol;

          // Construct the Verification URL (Admin/Scanner will scan this)
          const baseUrl = `${protocol}//${host}${port ? `:${port}` : ""}`;
          const verificationUrl = `${baseUrl}/qr?orderCode=${orderCode}&privateCode=${privateCode}`;

          const qrDataUrl = await QrCode.toDataURL(verificationUrl, {
            width: 256,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#ffffff",
            },
          });
          setQrSrc(qrDataUrl);
        } catch (error) {
          console.error("QR Generation Error:", error);
        }
      }
    };

    generateQR();
  }, [orderCode, privateCode, status]);

  const handlePrint = () => {
    window.print();
  };

  // --- Render States ---

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Generating Invoice...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-6 w-6" />
              Invoice Error
            </CardTitle>
            <CardDescription>
              We couldn't generate your invoice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{errorMessage}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/">
              <Button variant="outline">Go Home</Button>
            </Link>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-muted/20 py-8 px-4 sm:px-6">
      <main className="container mx-auto max-w-3xl">

        {/* Actions Bar (No-Print) */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <Link href="/products">
            <Button variant="outline" size="sm">
              <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
            </Button>
          </Link>
          <Button onClick={handlePrint} size="sm">
            <Printer className="mr-2 h-4 w-4" /> Print Invoice
          </Button>
        </div>

        {/* Invoice Card */}
        <Card className="w-full shadow-lg print:shadow-none border-t-4 border-t-primary">
          <CardHeader className="flex flex-row justify-between items-start border-b pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  Payment Successful
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold">INVOICE</CardTitle>
              <CardDescription className="mt-1">
                Order #{orderCode}
              </CardDescription>
            </div>
            <div className="text-right">
              <h3 className="font-bold text-lg text-foreground">ASCII Store</h3>
              <p className="text-sm text-muted-foreground">Addis Ababa, Ethiopia</p>
              <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-8">

            {/* Items Table */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Order Details
              </h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Item</th>
                      <th className="px-4 py-3 font-medium text-right">Qty</th>
                      <th className="px-4 py-3 font-medium text-right">Price</th>
                      <th className="px-4 py-3 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">
                          {product?.name || "Product"}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {product?.description}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">{quantity}</td>
                      <td className="px-4 py-3 text-right">
                        ETB {(totalAmount / quantity).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        ETB {totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* QR Code Section */}
              <div className="flex flex-col items-center justify-center p-4 bg-muted/10 rounded-lg border border-dashed">
                {qrSrc ? (
                  <>
                    <img
                      src={qrSrc}
                      alt="Order Verification QR"
                      className="w-32 h-32 mix-blend-multiply"
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Scan to verify order <br />
                      <span className="font-mono text-[10px]">{orderCode}</span>
                    </p>
                  </>
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center bg-muted/20 rounded">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Totals Section */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>ETB {totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (Included)</span>
                  <span>ETB 0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Grand Total</span>
                  <span>ETB {totalAmount.toFixed(2)}</span>
                </div>
              </div>

            </div>
          </CardContent>

          <CardFooter className="bg-muted/50 border-t p-6 text-center text-xs text-muted-foreground flex flex-col gap-2">
            <p>
              Thank you for shopping with ASCII Store. A copy of this receipt has been saved to your account.
            </p>
            <p>Private Code: <span className="font-mono bg-muted px-1 rounded">{privateCode}</span></p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}

export default function Invoice() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <InvoiceComponent />
    </Suspense>
  );
}

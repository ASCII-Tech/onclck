'use client';
import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import QrCode from 'qrcode';

async function fetchProduct(productId: string): Promise<any> {
  try {
    const response = await fetch(`/api/getProduct?productId=${productId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product details');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchOrderCode() {
  try {
    const response = await fetch('/api/genCode');
    if (!response.ok) {
      throw new Error('Failed to fetch order code');
    }
    const data = await response.json();
    return data.orderCode;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function createOrder(orderCode: string, price: number) {
  try {
    const response = await fetch('/api/createOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderCode, price }),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function InvoiceComponent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId') || '';
  const quantity = parseInt(searchParams.get('quantity') || '0', 10);
  const total = parseFloat(searchParams.get('amount') || '0');
  const [product, setProduct] = useState<any>(null);
  const [orderCode, setOrderCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [src, setSrc] = useState<string>('');
  const [orderCreated, setOrderCreated] = useState(false);
  const effectRan = useRef(false);

  useEffect(() => {
    if (!effectRan.current) {
      setIsLoading(true);
      const fetchData = async () => {
        try {
          if (productId) {
            const productData = await fetchProduct(productId);
            setProduct(productData);
          }
          const code = await fetchOrderCode();
          setOrderCode(code);

          // Create order
          await createOrder(code, total);
          setOrderCreated(true);
        } catch (error) {
          console.error('Error fetching data or creating order:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
      effectRan.current = true;
    }
  }, [productId, total]);

  useEffect(() => {
    const generateQR = async () => {
      if (orderCode && productId && quantity) {
        try {
          const qrCodeData = await QrCode.toDataURL(`${orderCode}&${productId}&${quantity}`);
          setSrc(qrCodeData);
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    generateQR();
  }, [orderCode, productId, quantity]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <main className="container mx-auto flex flex-1 flex-col items-center justify-center gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-muted-foreground">{product.description}</div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div>Quantity: {quantity}</div>
                    {src ? (
                      <img
                        src={src}
                        alt="QR Code"
                        width={128}
                        height={128}
                        className="rounded-md"
                        style={{ aspectRatio: "128/128", objectFit: "cover" }}
                      />
                    ) : (
                      <div>Loading QR code...</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>Price</div>
                  <div>${total.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>Order Code</div>
                <div>{orderCode || 'Loading...'}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-center">
              <p>Thank you for your order!</p>
              <p>Your payment has been processed successfully.</p>
              {orderCreated && <p>Order has been created in our system.</p>}
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}

export default function Invoice() {
  return (
    <Suspense fallback={<div>Loading invoice details...</div>}>
      <InvoiceComponent />
    </Suspense>
  );
}

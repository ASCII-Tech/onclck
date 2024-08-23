/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/WmWsKz0zmN9
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Rubik } from 'next/font/google'
import { IBM_Plex_Sans } from 'next/font/google'

rubik({
  subsets: ['latin'],
  display: 'swap',
})

ibm_plex_sans({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
'use client';
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function orderSummary() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <main className="container mx-auto flex flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your order details.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>Subtotal</div>
                  <div>$99.99</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>Shipping</div>
                  <div>$5.00</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>Tax</div>
                  <div>$10.00</div>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold">
                  <div>Total</div>
                  <div>$114.99</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Payment Verification</CardTitle>
              <CardDescription>Verify your payment details.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <RadioGroup id="payment-method" defaultValue="telebirr" className="grid grid-cols-2 gap-4">
                    <div>
                      <RadioGroupItem value="telebirr" id="telebirr" className="peer sr-only" />
                      <Label
                        htmlFor="telebirr"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <PhoneIcon className="mb-3 h-6 w-6" />
                        Telebirr
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="cbebirr" id="cbebirr" className="peer sr-only" />
                      <Label
                        htmlFor="cbebirr"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <BanknoteIcon className="mb-3 h-6 w-6" />
                        CBE Birr
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 555-5555" required />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-sm text-blue-600 underline" prefetch={false}>
                      Forgot password?
                    </Link>
                  </div>
                  <Input id="password" type="password" required />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                onClick={() => {
                  const transactionDetails = {
                    amount: "$114.99",
                    paymentMethod: "Telebirr",
                    phoneNumber: "+1 (555) 555-5555",
                  }
                  // window.location.href = `/payment-verification?${new URLSearchParams(transactionDetails).toString()}`
                  window.location.href = `/transaction/phoneVerify`
                }}
              >
                Verify Payment
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default orderSummary;

function BanknoteIcon(props) {
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
  )
}


function LogInIcon(props) {
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
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" x2="3" y1="12" y2="12" />
    </svg>
  )
}


function PhoneIcon(props) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

import { NextRequest, NextResponse } from 'next/server';
import { Telebirr, ITelebirrRequest } from '@telebirrh5/core';

export async function POST(req: NextRequest) {
  try {
    const { orderCode, total, productId } = await req.json();

    const request: ITelebirrRequest = {
      appId: process.env.TELEBIRR_APP_ID!,
      appKey: process.env.TELEBIRR_APP_KEY!,
      outTradeNo: orderCode,
      nonce: `${Date.now()}`,
      subject: `Payment for product ${productId}`,
      shortCode: process.env.TELEBIRR_SHORT_CODE!,
      notifyUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/telebirrCallback`,
      returnUrl: `${process.env.NEXT_PUBLIC_API_URL}/payment-success`,
      receiveName: process.env.TELEBIRR_RECEIVER_NAME!,
      timeoutExpress: '30',
      totalAmount: total.toString(),
      timestamp: `${Date.now()}`
    };

    const telebirr = new Telebirr({
      request: request,
      paymentUrl: process.env.TELEBIRR_PAYMENT_URL!,
      publicKey: process.env.TELEBIRR_PUBLIC_KEY!,
    });

    const paymentResult = await telebirr.generatePaymentUrl();

    return NextResponse.json(paymentResult);
  } catch (error) {
    console.error('Error initiating Telebirr payment:', error);
    return NextResponse.json({ message: 'Error initiating payment' }, { status: 500 });
  }
}
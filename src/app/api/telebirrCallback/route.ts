import { NextRequest, NextResponse } from 'next/server';
import { Telebirr } from '@telebirrh5/core';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { msg } = await req.json();

    const decodingResult = Telebirr.decryptResult({
      dataToDecrypt: msg,
      publicKey: process.env.TELEBIRR_PUBLIC_KEY!,
    });

    // Update the order status in your database
    await query(
      'UPDATE orders SET status = ? WHERE orderCode = ?',
      ['paid', decodingResult.outTradeNo]
    );

    return NextResponse.json({ message: 'Payment notification received and processed' });
  } catch (error) {
    console.error('Error processing Telebirr callback:', error);
    return NextResponse.json({ message: 'Error processing payment notification' }, { status: 500 });
  }
}
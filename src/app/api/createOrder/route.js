// app/api/createOrder/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { orderCode, price } = await request.json();

    if (!orderCode || price === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO Orders (tracking_number, total_amount, currency, seller_id) VALUES (?, ?, ?, ?)',
      [orderCode, price, "ETB", 1]
    );

    return NextResponse.json({ message: 'Order created successfully', orderId: result.insertId.toString() }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ message: 'Error creating order' }, { status: 500 });
  }
}
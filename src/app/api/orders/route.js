// app/api/orders/route.js

import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sql = `SELECT order_id, seller_id, order_date, total_amount, currency, order_status, payment_status, delivery_address, delivery_date, tracking_number, notes FROM Orders`;
    const orders = await query(sql);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders', details: error.message }, { status: 500 });
  }
}
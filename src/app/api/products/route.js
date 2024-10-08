// app/api/orders/route.js

import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sql = `SELECT product_id, product_name AS name, description, price, stock_quantity AS stock, currency AS sku, category_id AS category FROM Products`;
    const product = await query(sql);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders', details: error.message }, { status: 500 });
  }
}
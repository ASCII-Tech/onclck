// app/api/createOrder/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { orderCode, price, quantity, productId, privateCode } = await request.json();

    if (!orderCode || price === undefined || quantity === undefined || productId === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const productRows = await query(
      'SELECT stock_quantity FROM Products WHERE product_id = ?',
      [productId]
    );

    if (!productRows || productRows.length === 0 || productRows[0].stock_quantity === undefined) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const currentStock = productRows[0].stock_quantity;
    if (currentStock === null || currentStock < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    const newQuantity = currentStock - quantity;

    const orderResult = await query(
      'INSERT INTO Orders (tracking_number, total_amount, currency, seller_id, quantity, private_key) VALUES (?, ?, ?, ?, ?, ?)',
      [orderCode, price, "ETB", 1,quantity,privateCode]
    );

    await query(
      'UPDATE Products SET stock_quantity = ? WHERE product_id = ?',
      [newQuantity, productId]
    );

    return NextResponse.json({
      message: 'Order created successfully',
      orderId: orderResult.insertId.toString()
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
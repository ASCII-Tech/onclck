import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { privateCode, orderId } = body;

    if (!privateCode || !orderId) {
      return NextResponse.json({ message: 'Missing privateCode or orderCode' }, { status: 400 });
    }

    // First, verify the privateCode matches the order
    const verifyOrder = await query(
      'SELECT * FROM Orders WHERE tracking_number = ? AND private_key = ?',
      [orderId, privateCode]
    );

    if (verifyOrder.length === 0) {
      return NextResponse.json({ message: 'Order not found or privateCode is incorrect' }, { status: 404 });
    }

    // If verified, update the order status
    const updateResult = await query(
      'UPDATE Orders SET order_status = ? WHERE tracking_number = ?',
      ['confirmed', orderId]
    );

    if (updateResult.affectedRows === 1) {
      return NextResponse.json({ message: 'Transaction status updated to confirmed' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Failed to update transaction status' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error confirming transaction:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
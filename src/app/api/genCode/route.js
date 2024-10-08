// app/api/genCode/route.js

import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

function generateOrderCode(length = 6) {
  const charset = '0123456789';
  let orderCode = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    orderCode += charset[randomIndex];
  }
  return orderCode;
}


async function orderCodeExists(orderCode) {
  try {
    const sql = 'SELECT COUNT(*) AS count FROM Orders WHERE tracking_number = ?';
    const result = await query(sql, [orderCode]);
    console.log('Checking existence of order code:', orderCode, 'Result:', result);
    return result[0].count > 0;
  } catch (error) {
    console.error('Error checking order code existence:', error);
    throw error;
  }
}

async function generateUniqueOrderCode(length = 6) {
  let orderCode;
  let attempts = 0;
  const maxAttempts = 6;

  do {
    orderCode = generateOrderCode(length);
    console.log('Generated order code:', orderCode);
    attempts++;
    if (attempts > maxAttempts) {
      throw new Error('Unable to generate a unique order code after multiple attempts');
    }
  } while (await orderCodeExists(orderCode));

  return orderCode;
}

export async function GET() {
  try {
    const orderCode = await generateUniqueOrderCode();
    console.log('Generated unique order code:', orderCode);
    return NextResponse.json({ orderCode });
  } catch (error) {
    console.error('Error generating order code:', error);
    return NextResponse.json(
      { message: 'Error generating order code', error: error.message },
      { status: 500 }
    );
  }
}
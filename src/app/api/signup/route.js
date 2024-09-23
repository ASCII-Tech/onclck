// app/api/signup/route.js

import { query } from '@/lib/db';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

// Helper function to safely convert BigInt to Number
const safelyConvertBigIntToNumber = (value) => {
  if (typeof value === 'bigint') {
    return Number(value);
  }
  return value;
};

export async function POST(request) {
  console.log('POST /api/signup route hit');

  try {
    const { email, businessName, password, phoneNumber } = await request.json();
    console.log('Request body:', { email, businessName, phoneNumber }); // Don't log the password

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await query(
      'INSERT INTO Sellers (email, business_name, password_hash, phone_number) VALUES (?, ?, ?, ?)',
      [email, businessName, hashedPassword, phoneNumber]
    );

    if (!result || !result.insertId) {
      throw new Error('Failed to insert new seller');
    }

    const sellerId = safelyConvertBigIntToNumber(result.insertId);

    console.log('Seller created successfully', { sellerId });
    return NextResponse.json({ message: 'Seller created successfully', sellerId }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    
    // Check for duplicate entry error
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ message: 'Email already in use', error: 'Duplicate email' }, { status: 400 });
    }
    
    return NextResponse.json({ message: 'Error creating seller', error: error.message }, { status: 500 });
  }
}
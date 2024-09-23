// app/api/login/route.js

import { query } from '@/lib/db';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const results = await query('SELECT * FROM Sellers WHERE email = ?', [email]);

    if (results.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = results[0];

    // Compare the hashed password stored in the database with the one provided by the user
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // If login is successful, you can set a session or return a token here
    // For this example, we return a success message and the user's ID
    return NextResponse.json({ 
      message: 'Login successful', 
      userId: user.seller_id 
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
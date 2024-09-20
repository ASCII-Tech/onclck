// app/api/getProduct/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db'; // Adjust the path to your db.js file

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    // Query the database for the product
    const results = await query('SELECT * FROM Products WHERE product_id = ?', [productId]);
    
    // Handle case where no product is found
    if (results.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = results[0]; // Assuming the ID is unique and there's only one result

    return NextResponse.json(product);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

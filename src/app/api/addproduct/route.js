import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { name, description, price, stock, category_id, currency, seller, path } = await req.json();

    if (!name || !description || !price || !stock || !category_id) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const sql = `INSERT INTO Products (product_name, description, price, stock_quantity, category_id, currency, seller_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const result = await query(sql, [name, description, price, stock, category_id, currency || 'ETB', seller || '1']);
    
    return NextResponse.json({
      message: 'Product added successfully', 
      productId: Number(result.insertId) // Ensure this is a number
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Failed to add product', details: error.message }, { status: 500 });
  }
}
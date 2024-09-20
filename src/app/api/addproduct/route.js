import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData(); // Parse FormData

    const name = formData.get('name');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price')); // Convert to number
    const stock = parseInt(formData.get('stock')); // Convert to number
    const category_id = parseInt(formData.get('category_id')); // Convert to number
    const currency = formData.get('currency') || 'ETB'; // Default currency
    const seller = formData.get('seller') || '1'; // Default seller

    // Check required fields
    if (!name || !description || isNaN(price) || isNaN(stock) || isNaN(category_id)) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Example: handle file upload if needed
    // const product_image = formData.get('product_image'); 

    const sql = `INSERT INTO Products (product_name, description, price, stock_quantity, category_id, currency, seller_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const result = await query(sql, [name, description, price, stock, category_id, currency, seller]);

    return NextResponse.json({
      message: 'Product added successfully', 
      productId: Number(result.insertId)
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Failed to add product', details: error.message }, { status: 500 });
  }
}

// app/api/addproduct/route.js

import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get('name');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price'));
    const stock = parseInt(formData.get('stock'));
    const category_id = parseInt(formData.get('category_id'));
    const currency = formData.get('currency') || 'ETB';
    const seller = formData.get('seller') || '1';

    // Check required fields
    if (!name || !description || isNaN(price) || isNaN(stock) || isNaN(category_id)) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Handle file upload
    const files = formData.getAll('product_image');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const uploadedPaths = [];

    for (const file of files) {
      if (file instanceof Blob) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name.replace(/\s+/g, '-').toLowerCase();
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
        uploadedPaths.push(path.join('uploads', filename).replace(/\\/g, '/'));
      }
    }

    // Prepare product_images as a JSON string
    const product_images = JSON.stringify(uploadedPaths);

    // Insert product into database
    const sql = `INSERT INTO Products (product_name, description, price, stock_quantity, category_id, currency, seller_id, product_images) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const result = await query(sql, [name, description, price, stock, category_id, currency, seller, product_images]);
    const productId = Number(result.insertId);

    return NextResponse.json({
      message: 'Product added successfully', 
      productId: productId
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Failed to add product', details: error.message }, { status: 500 });
  }
}
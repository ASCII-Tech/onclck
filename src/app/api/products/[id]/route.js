// app/api/products/[id]/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(request, { params }) {
  const { id } = params;
  const { product_name, description, price, category, stock_quantity } = await request.json();

  try {
    await query(
      'UPDATE Products SET product_name = ?, description = ?, price = ?, category = ?, stock_quantity = ? WHERE product_id = ?',
      [product_name, description, price, category, stock_quantity, id]
    );
    return NextResponse.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error updating product', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await query('DELETE FROM Products WHERE product_id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error deleting product', error: error.message }, { status: 500 });
  }
}
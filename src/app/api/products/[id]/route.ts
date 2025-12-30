import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

// GET: Fetch a single product
export async function GET(_request: NextRequest, { params }: RouteParams) {
  // Await the params promise to access id
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 },
    );
  }

  try {
    const sql = `
      SELECT 
        product_id, 
        product_name AS name, 
        description, 
        price, 
        stock_quantity AS stock, 
        currency AS sku, 
        category_id AS category,
        product_images
      FROM Products 
      WHERE product_id = ?
    `;

    // Assuming query returns an array. Casting to any[] to avoid TS errors on result structure
    // ideally you would define a DBResult type.
    const results = (await query(sql, [id])) as any[];

    if (results.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(results[0]);
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch product",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// PUT: Update a product
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body = await request.json();

    const { product_name, name, description, price, stock_quantity, stock } =
      body;

    // Normalize values
    const finalName = product_name || name;
    const finalStock = stock_quantity !== undefined ? stock_quantity : stock;

    await query(
      "UPDATE Products SET product_name = ?, description = ?, price = ?, stock_quantity = ? WHERE product_id = ?",
      [finalName, description, price, finalStock, id],
    );

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating product",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// DELETE: Delete a product
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    await query("DELETE FROM Products WHERE product_id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting product",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

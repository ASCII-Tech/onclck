import { query } from "@/lib/db";
import { NextResponse } from "next/server";

// --- GET: Fetch Products (Existing) ---
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination Params
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Sorting Params
    const sortParam = searchParams.get("sort") || "name";
    const orderParam = searchParams.get("order") || "asc";

    // Map frontend sort keys to DB columns
    const sortMapping = {
      name: "product_name",
      price: "price",
      stock: "stock_quantity",
      sku: "currency",
      description: "description",
    };

    const orderBy = sortMapping[sortParam] || "product_name";
    const orderDir = orderParam.toLowerCase() === "desc" ? "DESC" : "ASC";

    // 1. Get Total Count
    const countSql = `SELECT COUNT(*) as total FROM Products`;
    const countResult = await query(countSql);

    // FIX: Explicitly convert BigInt to Number
    const rawTotal = countResult[0] ? countResult[0].total : 0;
    const totalItems = Number(rawTotal);

    // 2. Get Paginated Data
    const sql = `
      SELECT 
        product_id, 
        product_name AS name, 
        description, 
        price, 
        stock_quantity AS stock, 
        currency AS sku, 
        category_id AS category 
      FROM Products 
      ORDER BY ${orderBy} ${orderDir} 
      LIMIT ? OFFSET ?
    `;

    const products = await query(sql, [limit, offset]);

    const response = NextResponse.json({
      data: products,
      pagination: {
        total: totalItems,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalItems / limit),
      },
    });

    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 },
    );
  }
}

// --- POST: Create Product (New) ---
export async function POST(request) {
  try {
    const body = await request.json();

    // Destructure fields, supporting both UI names (name, stock, sku)
    // and DB names (product_name, stock_quantity, currency)
    const {
      product_name,
      name,
      description,
      price,
      stock_quantity,
      stock,
      currency,
      sku,
      // We ignore the incoming category to force it to 1
    } = body;

    // 1. Normalize Values
    const finalName = product_name || name;
    const finalStock = stock_quantity !== undefined ? stock_quantity : stock;
    const finalCurrency = currency || sku || "ETB"; // Default to ETB if missing

    // 2. Enforce Hardcoded Values
    const categoryId = 1; // As requested
    const sellerId = 1; // Default seller ID (required by DB FK)

    // 3. Validation
    if (!finalName || price === undefined) {
      return NextResponse.json(
        { error: "Product name and price are required" },
        { status: 400 },
      );
    }

    // 4. Insert into DB
    const sql = `
      INSERT INTO Products 
      (product_name, description, price, stock_quantity, currency, category_id, seller_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      finalName,
      description || "",
      price,
      finalStock || 0,
      finalCurrency,
      categoryId,
      sellerId,
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product: {
          id: result.insertId.toString(),
          name: finalName,
          price: price,
          category: categoryId,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product", details: error.message },
      { status: 500 },
    );
  }
}

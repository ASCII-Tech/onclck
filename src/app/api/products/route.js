import { query } from "@/lib/db";
import { NextResponse } from "next/server";

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

    // FIX: Explicitly convert BigInt to Number to prevent TypeError during division
    // Also handles case where countResult might be empty
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

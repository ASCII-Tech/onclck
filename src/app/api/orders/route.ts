import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// --- GET: Fetch Orders with Pagination & Search ---
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Search
    const search = searchParams.get("search") || "";

    // 1. Get Total Count
    let countSql = `SELECT COUNT(*) as total FROM Orders`;
    const countParams: (string | number)[] = [];

    if (search) {
      countSql += ` WHERE tracking_number LIKE ?`;
      countParams.push(`%${search}%`);
    }

    // @ts-ignore - query result type assertion
    const countResult = (await query(countSql, countParams)) as any[];

    // FIX: Explicitly convert BigInt to Number.
    // MySQL COUNT(*) returns a BigInt which crashes Math.ceil()
    const totalItems = Number(countResult[0]?.total || 0);

    // 2. Get Data
    const sql = `
      SELECT * FROM Orders 
      ${search ? "WHERE tracking_number LIKE ?" : ""}
      ORDER BY order_date DESC
      LIMIT ? OFFSET ?
    `;

    const params: (string | number)[] = search
      ? [`%${search}%`, limit, offset]
      : [limit, offset];

    const orders = await query(sql, params);

    // No cache headers to ensure fresh data on admin panel
    return NextResponse.json(
      {
        data: orders,
        pagination: {
          total: totalItems,
          page,
          limit,
          totalPages: Math.ceil(totalItems / limit),
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

// --- POST: Create a New Order ---
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderCode, price, quantity, productId, privateCode } = body;

    // 1. Validation
    if (
      !orderCode ||
      price === undefined ||
      quantity === undefined ||
      productId === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 2. Check Stock
    // @ts-ignore
    const productRows = (await query(
      "SELECT stock_quantity FROM Products WHERE product_id = ?",
      [productId],
    )) as any[];

    if (
      !productRows ||
      productRows.length === 0 ||
      productRows[0].stock_quantity === undefined
    ) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const currentStock = Number(productRows[0].stock_quantity);

    if (currentStock < quantity) {
      return NextResponse.json(
        { error: `Insufficient stock. Only ${currentStock} left.` },
        { status: 400 },
      );
    }

    // 3. Create Order
    // @ts-ignore
    const orderResult = (await query(
      "INSERT INTO Orders (tracking_number, total_amount, currency, seller_id, quantity, private_code) VALUES (?, ?, ?, ?, ?, ?)",
      [orderCode, price, "ETB", 1, quantity, privateCode],
    )) as any;

    // 4. Update Stock
    const newQuantity = currentStock - quantity;
    await query("UPDATE Products SET stock_quantity = ? WHERE product_id = ?", [
      newQuantity,
      productId,
    ]);

    return NextResponse.json(
      {
        message: "Order created successfully",
        orderId: orderResult.insertId
          ? orderResult.insertId.toString()
          : orderCode,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

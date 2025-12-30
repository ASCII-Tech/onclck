import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { privateCode, orderId } = body;

    // 1. Validation
    if (!privateCode || !orderId) {
      return NextResponse.json(
        { message: "Missing required fields: orderId or privateCode" },
        { status: 400 },
      );
    }

    // 2. Verification
    const orderCheck = await query(
      "SELECT order_id, order_status FROM Orders WHERE tracking_number = ? AND private_code = ?",
      [orderId, privateCode],
    );

    if (orderCheck.length === 0) {
      return NextResponse.json(
        { message: "Invalid credentials. Order not found or code incorrect." },
        { status: 404 },
      );
    }

    if (orderCheck[0].order_status === "confirmed") {
      return NextResponse.json(
        { message: "Order is already confirmed." },
        { status: 400 }, // Or 200 depending on preference
      );
    }

    // 3. Update
    const updateResult = await query(
      "UPDATE Orders SET order_status = 'confirmed' WHERE tracking_number = ?",
      [orderId],
    );

    if (updateResult.affectedRows > 0) {
      return NextResponse.json(
        { message: "Transaction confirmed successfully" },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { message: "Failed to update order status" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error confirming transaction:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}

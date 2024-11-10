import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get monthly data
    const monthlyData = await query(`
      SELECT 
        DATE_FORMAT(order_date, '%b') as month,
        COUNT(*) as sales,
        SUM(total_amount) as revenue
      FROM orders
      WHERE YEAR(order_date) = YEAR(CURRENT_DATE)
      GROUP BY MONTH(order_date)
      ORDER BY MONTH(order_date)
    `);

    // Get top selling items
    const topItems = await query(`
      SELECT 
        p.product_id as id,
        p.name,
        COUNT(*) as sales,
        SUM(oi.price * oi.quantity) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
      GROUP BY p.product_id, p.name
      ORDER BY sales DESC
      LIMIT 5
    `);

    // Get summary statistics
    const summary = await query(`
      SELECT 
        COUNT(DISTINCT o.order_id) as total_sales,
        SUM(o.total_amount) as total_revenue,
        COUNT(DISTINCT o.customer_id) as active_customers,
        AVG(o.total_amount) as avg_order_value
      FROM orders o
      WHERE o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)
    `);

    return NextResponse.json({
      monthlyData,
      topItems,
      summary: summary[0]
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
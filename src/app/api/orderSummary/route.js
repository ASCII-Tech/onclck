import { query } from '@/lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id'); // Extract 'id' from query string

  try {
    const result = await query('SELECT * FROM Products WHERE product_id = ?', [id]);
    if (result.length > 0) {
      return new Response(JSON.stringify(result[0]), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'Order not found' }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error fetching order', error: error.message }), { status: 500 });
  }
}

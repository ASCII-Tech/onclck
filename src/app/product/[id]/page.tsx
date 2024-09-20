import { ProductDetails } from '@/components/productDetails'
import { query } from '@/lib/db'

async function getProduct(id: string) {
  const result = await query('SELECT * FROM Products WHERE product_id = ?', [id])
  if (result.length === 0) {
    throw new Error('Product not found')
  }
  return result[0]
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  return <ProductDetails product={product} />
}
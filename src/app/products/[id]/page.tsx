import { ProductDetails } from "@/components/product-details-client";
import { query } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductData } from "@/lib/types";

type RouteParams = {
  params: Promise<{
    id: string;
  }>
}
async function getProduct(id: string): Promise<ProductData> {
  // @ts-ignore - query type definition workaround
  const result = (await query("SELECT * FROM Products WHERE product_id = ?", [
    id,
  ])) as ProductData[];

  if (!result || result.length === 0) {
    notFound();
  }
  return result[0];
}

export default async function ProductPage({
  params,
}: RouteParams) {
  const id = (await params).id;
  const product = await getProduct(id);

  return <ProductDetails product={product} />;
}

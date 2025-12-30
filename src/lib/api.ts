// lib/api.ts
import { Product, ApiResponse } from "./types";
import { NewProduct } from "@/components/add-product-modal";

export async function fetchProducts(): Promise<Product[]> {
  // We use full URL for server-side fetches if needed, but client side relative works too.
  // Ideally, passing data from Server Component avoids this call entirely on load.
  const response = await fetch("/api/products", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}

export async function editProduct(
  product: Product,
): Promise<ApiResponse<Product>> {
  try {
    // Your API expects 'product_name' and 'stock_quantity', but UI uses 'name' and 'stock'
    const payload = {
      id: product.product_id,
      product_name: product.name,
      description: product.description,
      price: product.price,
      stock_quantity: product.stock,
      currency: product.sku, // Assuming SKU maps to currency based on your GET route
    };

    const response = await fetch(`/api/products/${product.product_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return await response.json();
  } catch (error: any) {
    console.error("Error editing product:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(
  productId: string | number,
): Promise<ApiResponse<null>> {
  try {
    // Your API expects logic to handle Dynamic Routes correctly
    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }
}

export async function addProduct(product: NewProduct) {
  const response = await fetch("/api/products", {
    // Assuming POST /api/products creates items
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_name: product.name,
      description: product.description,
      price: product.price,
      stock_quantity: product.stock,
      currency: product.sku,
      category: product.category,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add product");
  }
  return response.json();
}

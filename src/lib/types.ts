// lib/types.ts
export interface Product {
  product_id: number; // Matches your DB
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  category: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ProductData {
  product_id: number | string;
  product_name: string;
  description: string;
  price: number;
  stock_quantity: number;
  currency: string;
  product_images: string; // Stored as JSON string in DB
  category_id?: string;
}

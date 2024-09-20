// lib/api.js

export async function fetchOrders() {
  const response = await fetch('/api/orders');
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
}

export async function fetchProducts()
{
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
}

export async function AddProduct()
{
  const response = await fetch('/api/addProducts');
  if (!response.ok) {
    throw new Error('Failed to add products');
  }
  return response.json();
}

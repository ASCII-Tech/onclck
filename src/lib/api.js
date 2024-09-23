// lib/api.js

export async function fetchOrders() {
  const response = await fetch('/api/orders');
  console.log("The API of fetch")
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

export async function editProduct(product) {
  try {
    const response = await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return await response.json();
  } catch (error) {
    console.error('Error editing product:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }
}

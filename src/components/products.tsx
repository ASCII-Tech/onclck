'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { fetchProducts } from '@/lib/api';


export function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    sku: '',
    category: '',
    images: [],
    tags: [],
  });

  useEffect(() => {
    async function loadProducts() {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to fetch product list', error);
      }
    }
    loadProducts();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (column: keyof Product) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleAddProduct = () => {
    setShowAddProductModal(true);
  };

  const handleCloseAddProductModal = () => {
    setShowAddProductModal(false);
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      sku: '',
      category: '',
      images: [],
      tags: [],
    });
  };

  const handleSaveProduct = () => {
    setProducts([...products, { ...newProduct, id: products.length + 1 }]);
    handleCloseAddProductModal();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        images: [...prevProduct.images, event.target.files![0]],
      }));
    }
  };

  const handleTagAdd = (tag: string) => {
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      tags: [...prevProduct.tags, tag],
    }));
  };

  const handleTagRemove = (index: number) => {
    const updatedTags = [...newProduct.tags];
    updatedTags.splice(index, 1);
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      tags: updatedTags,
    }));
  };

  const filteredProducts = products.filter((product) =>
    typeof product.name === 'string' && product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
      </div>
      <div className="mb-6">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('name')}>
                Product Name{' '}
                {sortColumn === 'name' && <span className="ml-2">{sortDirection === 'asc' ? '▲' : '▼'}</span>}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('description')}>
                Description{' '}
                {sortColumn === 'description' && <span className="ml-2">{sortDirection === 'asc' ? '▲' : '▼'}</span>}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('price')}>
                Price{' '}
                {sortColumn === 'price' && <span className="ml-2">{sortDirection === 'asc' ? '▲' : '▼'}</span>}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('stock')}>
                Stock{' '}
                {sortColumn === 'stock' && <span className="ml-2">{sortDirection === 'asc' ? '▲' : '▼'}</span>}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('sku')}>
                SKU{' '}
                {sortColumn === 'sku' && <span className="ml-2">{sortDirection === 'asc' ? '▲' : '▼'}</span>}
              </th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => (
              <tr key={product.id}>
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">{product.description}</td>
                <td className="border px-4 py-2">${product.price}</td>
                <td className="border px-4 py-2">{product.stock}</td>
                <td className="border px-4 py-2">{product.sku}</td>
                <td className="border px-4 py-2">
                  <Link href="#" className="underline text-blue-600">
                    {product.category}
                  </Link>
                </td>
                <td className="border px-4 py-2">
                  <Button variant="outline">Edit</Button>
                  <Button variant="outline">Remove</Button>
                  <Button variant="outline">Copy</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;

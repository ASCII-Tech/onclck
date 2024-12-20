'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { fetchProducts, editProduct, deleteProduct } from '@/lib/api';
import { EditProductPopupComponent } from '@/components/edit-product-popup';

export function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    sku: '',
    category: '',
    images: [],
    tags: [],
  });
  const effectRan = useRef(false);
  const [editingProduct, setEditingProduct] = useState(null);


  useEffect(() => {
    if(effectRan.current == false)
    {
      const loadProducts = async () => {
        try {
          const fetchedProducts = await fetchProducts();
          setProducts(fetchedProducts);
        } catch (error) {
          console.error('Failed to fetch product list', error);
        }
      }
      loadProducts();

      return () =>{
        effectRan.current = true;
      }
    }

  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (column) => {
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        images: [...prevProduct.images, event.target.files[0]],
      }));
    }
  };

  const handleTagAdd = (tag) => {
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      tags: [...prevProduct.tags, tag],
    }));
  };

  const handleTagRemove = (index) => {
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

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = async (updatedProduct) => {
    try {
      const result = await editProduct(updatedProduct);
      if (result.success) {
        setProducts(products.map(p => p.product_id === updatedProduct.product_id ? updatedProduct : p));
      } else {
        console.error('Failed to update product:', result.error);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
    setEditingProduct(null);
  };

  const handleDelete = async (product) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const result = await deleteProduct(product.product_id);
        if (result.success) {
          setProducts(products.filter(p => p.product_id !== product.product_id));
        } else {
          console.error('Failed to delete product:', result.error);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleCopy = (product) => {
    console.log(product);
    const addr = process.env.NODE_ENV === 'production' ? window.location.hostname : `localhost:${window.location.port}`;
    const url = `${addr}/product/${product.product_id}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('URL copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy URL: ', err);
    });
  };

  return (
    <div className="container mx-auto py-8 px-20">
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
                <td className="border px-4 py-2">ETB {product.price}</td>
                <td className="border px-4 py-2">{product.stock}</td>
                <td className="border px-4 py-2">{product.sku}</td>
                <td className="border px-4 py-2">
                  <Link href="#" className="underline text-blue-600">
                    {product.category}
                  </Link>
                </td>
                <td className="border px-4 py-2">
                  <Button variant="outline" onClick={() => handleEdit(product)}>Edit</Button>
                  <Button variant="outline" onClick={() => handleDelete(product)}>Remove</Button>
                  <Button variant="outline" onClick={() => handleCopy(product)}>Copy</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          {editingProduct && (
          <EditProductPopupComponent
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </div>
  );
}

export default Products;

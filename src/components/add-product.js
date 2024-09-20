"use client";
"use strict";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category_id: 1, // Example category ID, replace with actual categories
  });
  const [files, setFiles] = useState(null);

  const handleFileUpload = (event) => {
    const selectedFiles = event.target.files;
    setFiles(selectedFiles);
    console.log(selectedFiles); // Log selected files directly
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [id]: id === "price" || id === "stock" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("stock", product.stock);
    formData.append("category_id", product.category_id);

    // Add files to form data if available
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("product_image", files[i]);
      }
    }

    try {
      const response = await fetch("/api/addproduct", {
        method: "POST",
        body: formData, // Send formData instead of JSON
      });

      const data = await response.json();
      if (response.ok) {
        alert("Product added successfully");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4 py-12">
      <div className="grid gap-4">
        <img
          src="/placeholder.svg"
          alt={product.name}
          width={600}
          height={600}
          className="w-full rounded-lg object-cover aspect-square"
        />
        <div className="flex items-center gap-2">
          <input type="file" multiple onChange={handleFileUpload} />
        </div>
      </div>
      <div className="grid gap-6 my-2">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2 my-4">
            <Label htmlFor="description">Product Description</Label>
            <Textarea
              id="description"
              value={product.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              className="w-full"
            />
          </div>
          <div className="grid gap-2 my-4">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={product.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className="w-full"
            />
          </div>
          <div className="grid gap-2 my-4">
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              id="price"
              value={product.price}
              onChange={handleInputChange}
              placeholder="Enter product price"
              className="w-full"
            />
          </div>
          <div className="grid gap-2 my-4">
            <Label htmlFor="stock">Stock</Label>
            <Input
              type="number"
              id="stock"
              value={product.stock}
              onChange={handleInputChange}
              placeholder="Enter stock quantity"
              className="w-full"
            />
          </div>
          <Button type="submit" className="mt-4">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;

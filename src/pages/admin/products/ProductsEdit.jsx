import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useCategoryQuery } from "../../../store/api/category/categoryApiSlice";
import { useSingleProductQuery, useUpdateProductMutation } from "../../../store/api/products/productsApiSlice";

export const ProductsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: productData, isLoading, error } = useSingleProductQuery(id);
  const { data: categories, error: categoryError, isLoading: categoryLoading } = useCategoryQuery();
  const [updateProduct, { isLoading: isUpdating, error: updateError }] = useUpdateProductMutation();
  console.log(productData)

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);

  // Pre-fill the form data when the product data is fetched
  useEffect(() => {
    if (productData) {
      setFormData({
        productName: productData.productName || "",
        description: productData.description || "",
        price: productData.price || "",
        stock: productData.stock || "",
        categoryId: productData.categoryId || "",
        images: [],
      });

      // Set existing images for preview
      setPreviewImages(productData.images || []);
    }
  }, [productData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });

    // Preview selected images
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        formData.images.forEach((file) => productData.append("images", file));
      } else {
        productData.append(key, formData[key]);
      }
    });

    try {
      const response = await updateProduct({ id, productData }).unwrap();
      console.log("Product updated successfully:", response);
      navigate("/dashboard/products");
    } catch (err) {
      console.error("Failed to update product:", err);
    }
  };

  if (isLoading) return <div>Loading product data...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label htmlFor="productName" className="block font-medium mb-2">
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={productData.data.productName}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={productData.data.description}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block font-medium mb-2">
            Price ($)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={productData.data.price}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Stock */}
        <div>
          <label htmlFor="stock" className="block font-medium mb-2">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={productData.data.stock}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="categoryId" className="block font-medium mb-2">
            Category
          </label>
          {categoryLoading && <div>Loading categories...</div>}
          {categoryError && <div className="text-red-500">Error: {categoryError.message}</div>}
          {categories && (
            <select
              id="categoryId"
              name="categoryId"
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Category --</option>
              {categories.data.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Images */}
        <div>
          <label htmlFor="images" className="block font-medium mb-2">
            Product Images
          </label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleFileChange}
            multiple
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-4 flex gap-4">
            {previewImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Preview ${index}`}
                className="h-20 w-20 object-cover rounded"
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update Product"}
        </button>
      </form>

      {/* Error Message */}
      {updateError && <div className="text-red-500 mt-4">Error: {updateError.message}</div>}
    </div>
  );
};

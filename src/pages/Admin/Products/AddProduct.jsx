import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import CustomEditor from "../../../components/Admin/CustomEditor";
import MediaUploadMultiple from "../../../components/Admin/MediaUpload/MediaUploadMultible";
import GoBackButton from "../../../components/Admin/Buttons/GoBackButton";
import axios from "axios";
import { BASE_URL } from "../../../constants";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    excerpt: "",
    price: 0,
    discount: 0,
    quantity: 0,
    category: null, // تحديث هنا
  });
  const [mainImage, setMainImage] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const toast = useRef(null);
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(false)
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/categories`,
          { withCredentials: true }
        );
        setCategories(data.data.categories);
      } catch (error) {
        showErrorToast(error.response?.data?.message || "Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainImageChange = (files) => {
    setMainImage(files);
  };
  const handleGalleryChange = (files) => {
    setGallery(files);
  };

  const handleFocus = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const response = await axios.post(
        `${BASE_URL}/products`,
        formData,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (response.data.status === "success") {
        const productId = response.data.data._id;
        await uploadGalleryImages(productId);
        showSuccessToast("Product created successfully");
        setTimeout(() => navigate("/admin/products/"), 3000);
      } else {
        handleErrors(response.data);
      }
    } catch (error) {
      handleErrors(error.response?.data || {});
    }
  };

  const uploadGalleryImages = async (productId) => {
    if (gallery.length > 0 || mainImage > 0) {

      const formGalleryData = new FormData();
      mainImage.forEach((file) => formGalleryData.append("gallery", file));
      gallery.forEach((file) => formGalleryData.append("gallery", file));
      setImageLoading(true);
      try {

        const response = await axios.patch(
          `${BASE_URL}/products/product-photos-upload/${productId}`,
          formGalleryData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.data.status === "success") {
          showSuccessToast("Images uploaded successfully");
          setImageLoading(false);
        } else {
          setImageLoading(false);
          throw new Error(response.data.message || "Image upload failed");
        }
      } catch (uploadError) {
        setImageLoading(false);
        showErrorToast(uploadError.message || "An error occurred during image upload");
      }


    }
  };

  const handleErrors = (data) => {
    const errorMessages = data.errors || {};
    setErrors({
      title: errorMessages.title?.message || "",
      description: errorMessages.description?.message || "",
      excerpt: errorMessages.excerpt?.message || "",
      price: errorMessages.price?.message || "",
      quantity: errorMessages.quantity?.message || "",
      discount: errorMessages.discount?.message || "",
      category: errorMessages.category?.message || "",
    });
    showErrorToast(data.message || "An error occurred");
  };

  const showErrorToast = (message) => {
    toast.current.show({ severity: "error", summary: "Error", detail: message, life: 3000 });
  };

  const showSuccessToast = (message) => {
    toast.current.show({ severity: "success", summary: "Success", detail: message, life: 3000 });
  };

  return (

    <Fragment>
      <div className="flex flex-nowrap justify-between mb-5">
        <div>
          <GoBackButton />
          <h1 className="inline-block ml-4 text-3xl dark:text-white">
            Create Product
          </h1>
        </div>
      </div>

      <div className="col-span-3 xl:col-span-2 space-y-6">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form onSubmit={submitForm} >
            <div className="grid grid-cols-1 gap-4 p-6">
              {/* Title Field */}
              <div className="mb-2">
                <label htmlFor="title" className="w-full mb-2 block text-black dark:text-white">Title</label>
                <InputText
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter product name"
                  className={`w-full ${errors.title ? 'border-red-500' : ''}`}
                  value={formData.title}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus("title")}
                />
                {errors.title && <small className="p-error">{errors.title}</small>}
              </div>

              {/* Excerpt Field */}
              <div className="mb-2">
                <label htmlFor="excerpt" className="w-full mb-2 block text-black dark:text-white">Excerpt</label>
                <InputText
                  id="excerpt"
                  name="excerpt"
                  type="text"
                  placeholder="Enter excerpt"
                  className={`w-full ${errors.excerpt ? 'border-red-500' : ''}`}
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus("excerpt")}
                />
                {errors.excerpt && <small className="p-error">{errors.excerpt}</small>}
              </div>

              {/* Description Field */}
              <div className="mb-2">
                <label htmlFor="description" className="w-full mb-2 block text-black dark:text-white">Description</label>
                <CustomEditor value={formData.description} onTextChange={(e) => setFormData(prev => ({ ...prev, description: e.htmlValue }))} />
                {errors.description && <small className="p-error">{errors.description}</small>}
              </div>


              {/* Price, Discount, and Quantity Fields */}
              <div className="mb-2 grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="price" className="w-full mb-2 block text-black dark:text-white">Price (EGP)</label>
                  <InputText
                    id="price"
                    name="price"
                    type="number"
                    placeholder="Enter product price"
                    className={`w-full ${errors.price ? 'border-red-500' : ''}`}
                    value={formData.price}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("price")}
                  />
                  {errors.price && <small className="p-error">{errors.price}</small>}
                </div>
                <div>
                  <label htmlFor="discount" className="w-full mb-2 block text-black dark:text-white">Discount (%)</label>
                  <InputText
                    id="discount"
                    name="discount"
                    type="number"
                    placeholder="Enter discount"
                    className={`w-full ${errors.discount ? 'border-red-500' : ''}`}
                    value={formData.discount}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("discount")}
                  />
                  {errors.discount && <small className="p-error">{errors.discount}</small>}
                </div>
                <div>
                  <label htmlFor="quantity" className="w-full mb-2 block text-black dark:text-white">Quantity</label>
                  <InputText
                    id="quantity"
                    name="quantity"
                    type="number"
                    placeholder="Enter product quantity"
                    className={`w-full ${errors.quantity ? 'border-red-500' : ''}`}
                    value={formData.quantity}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("quantity")}
                  />
                  {errors.quantity && <small className="p-error">{errors.quantity}</small>}
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="mb-2">
                <label htmlFor="category" className="w-full mb-2 block text-black dark:text-white">Category</label>
                <Dropdown
                  id="category"
                  value={categories.find(cat => cat._id === formData.category)} // تحديث هنا
                  options={categories}
                  onChange={(e) => {
                    const selectedCategoryId = e.value?._id;
                    console.log("Selected category ID:", selectedCategoryId); // التحقق من القيمة المختارة
                    setFormData(prev => ({ ...prev, category: selectedCategoryId })); // تحديث القيمة هنا
                  }}
                  optionLabel="title" // عرض الاسم الصحيح
                  placeholder="Select a category"
                  className={`w-full ${errors.category ? 'border-red-500' : ''}`}
                />
                {errors.category && <small className="p-error">{errors.category}</small>}
              </div>

              {/* Image Upload */}
              <div className="mb-2">
                <label htmlFor="gallery" className="w-full mb-2 block text-black dark:text-white">Main Image</label>
                <MediaUploadMultiple onChange={handleMainImageChange} maxFiles={1} loading={imageLoading} />
              </div>
              <div className="mb-2">
                <label htmlFor="gallery" className="w-full mb-2 block text-black dark:text-white">Gallery</label>
                <MediaUploadMultiple onChange={handleGalleryChange} maxFiles={4} loading={imageLoading} />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-4">
                <Button type="submit" label="Add Product" />
              </div>
            </div>
          </form>
        </div>
      </div>

      <Toast ref={toast} position="bottom-left"></Toast>
    </Fragment>

  );
};

export default AddProduct;

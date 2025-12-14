import React, { useEffect, useState } from "react";
import { Paginator } from "primereact/paginator";
import axios from "axios";
import Card from "../Card/Card";
import LoadingCard from "../Card/LoadingCard";
import { Dropdown } from "primereact/dropdown";
import { dropdownClient } from "../../../layout/dropdownClient";
import { BASE_URL } from "../../../constants";

const CollectionProduct = ({ collection }) => {
  const param = collection;
  const [products, setProducts] = useState([]); // تخزين المنتجات
  const [totalRecords, setTotalRecords] = useState(0); // تخزين العدد الكلي للمنتجات
  const [first, setFirst] = useState(0); // التحكم في البداية
  const [rows, setRows] = useState(12); // عدد المنتجات لكل صفحة
  const [loading, setLoading] = useState(false); // حالة التحميل
  const [selectedSortOption, setSelectedSortOption] = useState(null);
  const sortOptions = [
    { label: "Price: High to Low", value: "priceHighToLow" },
    { label: "Price: Low to High", value: "priceLowToHigh" },
    { label: "Rating: High to Low", value: "ratingHighToLow" },
    { label: "Rating: Low to High", value: "ratingLowToHigh" },
  ];

  const [category, setCategory] = useState("");
  useEffect(() => {
    const getCollectionName = async () => {
      try {
        // طلب API باستخدام category title
        const response = await axios.get(
          `${BASE_URL}/categories/${param}`
        );

        if (response.data && response.data.data) {
          setCategory(response.data.data.title); // تعيين المنتجات
        }
      } catch (error) {
        console.error("Error fetching collection name:", error);
      }
    };
    getCollectionName();
  }, [param]);

  // دالة عمل الفلترة
  useEffect(() => {
    if (selectedSortOption) {
      const sortedProducts = [...products]; // نسخ المنتجات

      switch (selectedSortOption) {
        case "priceHighToLow":
          sortedProducts.sort((a, b) => b.price - a.price);
          break;
        case "priceLowToHigh":
          sortedProducts.sort((a, b) => a.price - b.price);
          break;
        case "ratingHighToLow":
          sortedProducts.sort((a, b) => b.rating - a.rating);
          break;
        case "ratingLowToHigh":
          sortedProducts.sort((a, b) => a.rating - b.rating);
          break;
        default:
          break;
      }

      setProducts(sortedProducts); // تحديث المنتجات بعد الترتيب
    }
  }, [selectedSortOption, products]);

  // دالة جلب البيانات الخاصة بالمنتجات
  useEffect(() => {
    const getProductByCollection = async () => {
      setLoading(true);

      try {
        // طلب API باستخدام pagination و category
        const response = await axios.get(
          `${BASE_URL}/products`,
          {
            params: {
              categories: param, // تمرير الفئة
              page: first / rows + 1, // حساب رقم الصفحة
              limit: rows, // عدد المنتجات لكل صفحة
            },
          }
        );

        if (response.data && response.data.data) {
          setProducts(response.data.data.products); // تعيين المنتجات
          setTotalRecords(response.data.data.count); // تعيين العدد الكلي للمنتجات
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // إيقاف التحميل
      }
    };

    getProductByCollection();
  }, [param, first, rows]); // استدعاء الدالة عند تغيير id أو pagination

  // دالة لتحديث المؤشر عند تغيير الصفحة
  const onPageChange = (event) => {
    setFirst(event.first); // تحديث البداية
    setRows(event.rows); // تحديث عدد المنتجات لكل صفحة
  };

  // دالة لعرض المنتجات في الشبكة
  const displayCollections =
    products.length > 0 ? (
      products.map((product) => {
        return <Card key={product._id} product={product} />;
      })
    ) : (
      <p>No products available.</p> // عرض رسالة إذا لم تكن هناك منتجات
    );

  return (
    <div className="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
      <div className="flex items-baseline justify-between border-b border-slate-200 dark:border-slate-500 pb-6 pt-24">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          {category}
        </h1>
        <div className="hidden lg:flex lg:items-center">
          <Dropdown
            value={selectedSortOption}
            onChange={(e) => setSelectedSortOption(e.value)}
            options={sortOptions}
            optionLabel="label"
            placeholder="Sort by"
            className="w-full md:w-14rem"
            pt={dropdownClient}
          />
        </div>
      </div>
      <div className="pt-12 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <LoadingCard count={rows} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {displayCollections}
            </div>
            <div className="mt-10">
              <Paginator
                first={first}
                rows={rows}
                totalRecords={totalRecords} // العدد الكلي للمنتجات
                onPageChange={onPageChange}
                template="CurrentPageReport PrevPageLink PageLinks NextPageLink"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CollectionProduct;

import axios from "axios";
import { useEffect, useState } from "react";
import LoadingCard from "./Card/LoadingCard";
import { Link } from "react-router-dom";
import Card from "./Card/Card";
import { BASE_URL } from "../../constants";

const FeaturedItems = ({ title, productQuery, productCount, topRating }) => {
  const [products, setProducts] = useState([]); // تخزين المنتجات

  const [loading, setLoading] = useState(false); // حالة التحميل

  const params = {
    ...productQuery, // تمرير الاستعلامات
    limit: productCount, // عدد المنتجات لكل صفحة
  };
  useEffect(() => {
    const getProductIsFeatured = async () => {
      setLoading(true);

      try {
        // طلب API باستخدام pagination و category
        const response = await axios.get(
          `${BASE_URL}/products/featured-products`,
          { params: params }
        );

        if (response.data && response.data.data) {
          let fetchedProducts = response.data.data;

          // فرز المنتجات بناءً على التقييم الأعلى في حال وجود topRating
          if (topRating) {
            fetchedProducts = fetchedProducts.sort(
              (a, b) => b.rating - a.rating
            );
          }
          setProducts(response.data.data); // تعيين المنتجات
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // إيقاف التحميل
      }
    };

    getProductIsFeatured();
  }, [productQuery, productCount, topRating]);

  // دالة لعرض المنتجات في الشبكة
  const displayCollections =
    products && products.length > 0 ? (
      products.map((product) => {
        return <Card key={product._id} product={product} />;
      })
    ) : (
      <p>No products available.</p> // عرض رسالة إذا لم تكن هناك منتجات
    );

  return (
    <section className="px-4 pt-24 space-y-5 sm:px-6 sm:pt-32 xl:mx-auto xl:max-w-7xl lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        <Link
          to={""}
          className="hidden text-sm font-semibold text-sky-700 hover:text-sky-600 sm:block dark:text-sky-500 dark:hover:text-sky-400"
        >
          Browse all Featured Products <span aria-hidden="true"> →</span>
        </Link>
      </div>
      <div className="pt-12 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <LoadingCard count={productCount} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {displayCollections}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
export default FeaturedItems;

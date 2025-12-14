import axios from "axios";
import { useEffect, useState } from "react";
import LoadingCard from "../Card/LoadingCard";
import { Link } from "react-router-dom";
import Card from "../Card/Card";
import { BASE_URL } from "../../../constants";

const CollectionTopProducts = ({
  title,
  productQuery,
  productCount,
  topRating,
  panner,
  goToAllCollectionProducts,
}) => {
  const [products, setProducts] = useState([]); // تخزين المنتجات
  const [loading, setLoading] = useState(false); // حالة التحميل

  useEffect(() => {
    const getProductIsFeatured = async () => {
      setLoading(true);

      try {
        // طلب API باستخدام pagination و category
        const response = await axios.get(
          `${BASE_URL}/products`,
          { params: { categories: productQuery } }
        );

        if (response.data && response.data.data) {
          let fetchedProducts = response.data.data.products;

          // فرز المنتجات بناءً على التقييم الأعلى في حال وجود topRating
          if (topRating) {
            fetchedProducts = fetchedProducts.sort(
              (a, b) => b.rating - a.rating
            );
          }
          setProducts(fetchedProducts); // تعيين المنتجات المفرزة
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
      products.slice(0, productCount).map((product) => {
        return <Card key={product._id} product={product} />;
      })
    ) : (
      <p className="text-center text-lg font-semibold text-gray-500">
        No products available.
      </p> // عرض رسالة إذا لم تكن هناك منتجات
    );

  return (
    <section className="px-4 pt-24 space-y-5 sm:px-6 sm:pt-32 xl:mx-auto xl:max-w-7xl lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        <Link
          to={`/collections/${goToAllCollectionProducts}`}
          className="hidden text-sm font-semibold text-sky-700 hover:text-sky-600 sm:block dark:text-sky-500 dark:hover:text-sky-400"
        >
          Browse All {title} <span aria-hidden="true"> →</span>
        </Link>
      </div>
      <img
        src={panner}
        alt={title}
        className="w-full h-auto max-h-96 object-cover object-center rounded-lg"
      />
      <div className="pt-12 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <LoadingCard count={productCount} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {displayCollections}
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionTopProducts;

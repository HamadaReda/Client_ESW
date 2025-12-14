import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // تأكد من استيراد axios
import SimpleLoadingCard from "../Card/SimpleLoadingCard";
import { API_VERSION, BASE_URL, DOMAIN_URL } from "../../../constants";

const OurCollectionSection = () => {
  const [categories, setCategories] = useState([]); // تخزين الفئات
  const [loading, setLoading] = useState(false); // حالة التحميل

  useEffect(() => {
    // دالة لجلب الفئات
    const fetchCategories = async () => {
      setLoading(true); // تعيين حالة التحميل إلى true عند بدء الجلب
      try {
        const response = await axios.get(
          `${BASE_URL}/categories/`,
          {
            params: {
              limit: 5, // تحديد الحد بـ 5 فئات
            },
          }
        );
        setCategories(response.data.data.categories); // تعيين الفئات
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false); // تعيين حالة التحميل إلى false بعد انتهاء الجلب
      }
    };

    fetchCategories();
  }, []);

  const card = categories.map((collection) => {
    return (
      <Link
        key={collection._id} // استخدام _id كـ key فريد
        to={`/collections/${collection._id}`} // استخدام الـ slug للفئة في الرابط
        className="group relative flex h-64 w-56 flex-col overflow-hidden rounded-lg p-6 xl:w-auto"
      >
        <span aria-hidden="true" className="absolute inset-0">
          <img
            src={collection.image.url}
            alt={collection.title}
            className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-125"
            style={{ width: "500px" }}
          />
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-800 opacity-50"
        ></span>
        <span className="relative mt-auto text-center text-xl font-bold text-white">
          {collection.title}
        </span>
      </Link>
    );
  });

  return (
    <section className=" px-4 pt-24 space-y-5 sm:px-6 sm:pt-32 xl:mx-auto xl:max-w-7xl lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Our collections
        </h2>
        <Link
          to={"/collections"}
          className="hidden text-sm font-semibold text-sky-700 hover:text-sky-600 dark:text-sky-500 dark:hover:text-sky-400 sm:block"
        >
          Browse all collections <span aria-hidden="true"> →</span>
        </Link>
      </div>
      <div>
        <div className="mt-5 flow-root [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
          <div className="-my-2">
            <div className="relative box-content h-64 overflow-x-auto py-2 xl:overflow-visible">
              <div className="min-w-screen-xl absolute flex space-x-8 px-4 sm:px-6 lg:px-8 xl:relative xl:grid xl:grid-cols-5 xl:gap-8 xl:space-x-0 xl:px-0 ">
                {loading ? (
                  // عرض الـ loading أثناء جلب البيانات
                  <SimpleLoadingCard count={5} />
                ) : (
                  // عرض البيانات الفعلية بعد الانتهاء
                  card
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurCollectionSection;

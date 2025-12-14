import { useState, useEffect } from "react";
import { Paginator } from "primereact/paginator";
import { Link } from "react-router-dom";
import axios from "axios";
import SimpleLoadingCard from "../Card/SimpleLoadingCard";
import { BASE_URL } from "../../../constants";

const AllCollections = () => {
  const [collections, setCollections] = useState([]); // إدارة البيانات محليًا
  const [first, setFirst] = useState(0); // للتحكم في بداية العرض
  const [rows, setRows] = useState(12); // عدد العناصر لكل صفحة
  const [loading, setLoading] = useState(true); // لإدارة حالة التحميل

  // دالة لجلب البيانات من API
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/categories`
        );
        setCollections(response.data.data.categories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching collections:", error);
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // دالة لتحديث المؤشر عند تغيير الصفحة
  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  // عرض الكروت في الشبكة
  const displayCollections = collections
    .slice(first, first + rows)
    .map((collection) => {
      return (
        <div
          className="group w-full h-auto overflow-hidden rounded-lg relative"
          key={collection._id}
        >
          <img
            src={collection.image.url}
            alt={collection.title}
            className="w-full h-48 object-cover object-center group-hover:opacity-75"
          />
          <div
            aria-hidden="true"
            className="bg-gradient-to-b from-transparent to-black opacity-50 absolute inset-0"
          ></div>
          <div className="flex items-end p-6 absolute inset-0">
            <div>
              <h3 className="font-semibold text-lg text-white">
                <Link to={`/collections/${collection._id}`}>
                  <span className="absolute inset-0"></span>
                  <span className="absolute bottom-5">{collection.title}</span>
                </Link>
              </h3>
            </div>
          </div>
        </div>
      );
    });

  return (
    <div className="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
      <div className="border-b border-slate-200 dark:border-slate-500 pt-24 pb-10">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          All collections
        </h1>
      </div>
      {loading ? (
        <div className="pt-12 pb-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <SimpleLoadingCard count={12} />
          </div>
        </div>
      ) : (
        <div className="pt-12 pb-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayCollections}
          </div>
          <div className="mt-10">
            <Paginator
              first={first}
              rows={rows}
              totalRecords={collections.length}
              onPageChange={onPageChange}
              template="CurrentPageReport  PrevPageLink PageLinks NextPageLink"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} collections"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCollections;

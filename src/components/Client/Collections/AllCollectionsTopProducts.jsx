import { Fragment, useEffect, useState } from "react";
import CollectionTopProducts from "./CollectionTopProducts";
import axios from "axios";
import { BASE_URL } from "../../../constants";

const AllCollectionsTopProducts = () => {
  const [categories, setCategories] = useState([]); // تخزين الفئات

  useEffect(() => {
    // دالة لجلب الفئات
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/categories/`
        );
        setCategories(response.data.data.categories); // تعيين الفئات
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const collectionsTopProducts = categories.map((collection) => {
    if (collection.isBannerVisible) {
      return (
        <CollectionTopProducts
          key={collection._id}
          title={collection.title}
          productQuery={collection._id}
          productCount={8}
          topRating={true}
          panner={collection.banner.url}
          goToAllCollectionProducts={collection._id}
        />
      );
    }
  });

  return <Fragment>{collectionsTopProducts}</Fragment>;
};
export default AllCollectionsTopProducts;

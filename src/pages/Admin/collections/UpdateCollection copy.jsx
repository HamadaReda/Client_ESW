import { Fragment, useRef, useState, useEffect } from "react";
import GoBackButton from "../../../components/Admin/Buttons/GoBackButton";
import { InputText } from "primereact/inputtext";
import { inputTextStyle } from "../../../layout/inputTextStyle";
import Cookies from "js-cookie";
import { buttonsStyle } from "../../../layout/buttonsStyle";
import { Button } from "primereact/button";
import CustomEditor from "../../../components/Admin/CustomEditor";
import { Toast } from "primereact/toast";
import MediaUpload from "../../../components/Admin/MediaUpload/MediaUpload";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../constants";

const UpdateCollection = () => {
  const { id } = useParams(); // الحصول على الـ id من الـ URL
  const navigate = useNavigate(); // لإعادة التوجيه بعد التحديث
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // يتم التعامل معها كنص HTML
  const [existingImage, setExistingImage] = useState(null);
  const [newImage, setNewImage] = useState(null); // لحفظ الصورة الجديدة
  const toast = useRef(null);

  useEffect(() => {
    // استدعاء بيانات المجموعة عند تحميل المكون
    const fetchCollectionData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/categories/${id}`
        );
        const { title, description, image } = response.data.data;
        setTitle(title);
        setDescription(description); // تعيين الوصف كـ HTML
        setExistingImage(image.url); // تعيين الصورة الموجودة
      } catch (error) {
        console.error("Error fetching collection data:", error);
      }
    };

    fetchCollectionData();
  }, [id]);

  const handleImageChange = (file) => {
    setNewImage(file); // تخزين الصورة الجديدة
    setExistingImage(URL.createObjectURL(file)); // عرض الصورة الجديدة في المعاينة
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      // الخطوة الأولى: إرسال العنوان والوصف
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description); // إرسال الوصف كـ HTML

      // تحديث البيانات باستخدام PUT أو PATCH
      const updateResponse = await axios.patch(
        `${BASE_URL}/categories/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        }
      );

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Collection updated successfully",
      });

      // الخطوة الثانية: رفع الصورة إذا تم اختيار صورة جديدة
      if (newImage) {
        const formData = new FormData();
        formData.append("image", newImage);

        // رفع الصورة
        const imageResponse = await axios.patch(
          `${BASE_URL}/categories/category-photo-upload/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("authToken")}`,
            },
          }
        );

        if (imageResponse.data.status === "success") {
          // toast.current.show({
          //   severity: "success",
          //   summary: "Success",
          //   detail: "Image uploaded successfully",
          //   life: 3000,
          // });
        } else {
          throw new Error(imageResponse.data.message || "Image upload failed");
        }
      }

      // إعادة التوجيه بعد التحديث
      navigate("/admin/collections");
    } catch (error) {
      console.error("Error updating collection:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update collection",
      });
    }
  };

  return (
    <Fragment>
      <div className="flex flex-nowrap justify-between mb-5">
        <div>
          <GoBackButton />
          <h1 className="inline-block ml-4 text-3xl dark:text-white">
            Update Collection
          </h1>
        </div>
      </div>

      <div className="col-span-3 xl:col-span-2 space-y-6">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form encType="multipart/form-data" onSubmit={submitForm}>
            <div className="grid grid-cols-1 gap-4 p-6">
              <div className="mb-2">
                <label
                  htmlFor="title"
                  className="w-full mb-2 block text-black dark:text-white"
                >
                  Title
                </label>
                <InputText
                  id="title"
                  type="text"
                  placeholder="Enter collection name"
                  className="w-full"
                  pt={inputTextStyle}
                  unstyled={true}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="description"
                  className="w-full mb-2 block text-black dark:text-white"
                >
                  Description
                </label>
                <CustomEditor
                  value={description}
                  onTextChange={(e) => setDescription(e.htmlValue)} // التحديث بـ HTML
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="image-upload"
                  className="w-full mb-2 block text-black dark:text-white"
                >
                  Image
                </label>
                <MediaUpload
                  onChange={handleImageChange}
                  maxFiles={1}
                  existingImage={existingImage} // تمرير الصورة الموجودة
                  showImage={existingImage}
                />
              </div>

              <div className="pt-3 rounded-b-md sm:rounded-b-lg">
                <div className="flex items-center justify-end">
                  <Button
                    label="Save Changes"
                    size="normal"
                    className="text-base"
                    pt={buttonsStyle}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Toast ref={toast}></Toast>
    </Fragment>
  );
};

export default UpdateCollection;

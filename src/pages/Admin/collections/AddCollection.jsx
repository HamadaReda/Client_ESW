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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SelectButton } from "primereact/selectbutton";

import "primeicons/primeicons.css";
import { BASE_URL } from "../../../constants";

const AddCollection = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [banner, setBanner] = useState(null);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const showOptions = ["Show", "Hide"];
  const [showValue, setShowValue] = useState(showOptions[1]);
  const toast = useRef(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // لتحديث مسار الصورة عند إلغاء المكون
  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image); // تنظيف مسار الصورة
      }
      if (banner) {
        URL.revokeObjectURL(banner); // تنظيف مسار الصورة
      }
      if (showValue == showOptions[0]) {
        setIsBannerVisible(true);
      } else {
        setIsBannerVisible(false);
      }
    };
  }, [image, banner]);

  const handleImageChange = (file) => {
    setImage(file);
    console.log("Image selected:", file);
  };
  const handleBannerChange = (file) => {
    setBanner(file);
    console.log("banner selected:", file);
  };

  // submit the form
  const submitForm = async (e) => {
    e.preventDefault();
    try {
      // إرسال الطلب لإنشاء الـ category
      const response = await axios.post(
        `${BASE_URL}/categories`,
        {
          title,
          description,
          isBannerVisible,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.status === "success") {
        const collectionId = response.data.data._id;

        // التحقق من وجود الصورة لرفعها
        if (image) {
          const formImageData = new FormData();
          formImageData.append("image", image);

          // رفع الصورة
          const imageResponse = await axios.patch(
            `${BASE_URL}/categories/category-photo-upload/${collectionId}`,
            formImageData,
            {
              withCredentials: true,
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
            throw new Error(
              imageResponse.data.message || "Image upload failed"
            );
          }
        }
        if (banner) {
          const formBannerData = new FormData();
          formBannerData.append("banner", banner);

          // رفع الصورة
          const imageResponse = await axios.patch(
            `${BASE_URL}/categories/category-banner-upload/${collectionId}`,
            formBannerData,
            {
              withCredentials: true,
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
            throw new Error(
              imageResponse.data.message || "Banner upload failed"
            );
          }
        }
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Collection created successfully",
          life: 3000,
        });

        // الانتظار لمدة 3 ثوانٍ قبل إعادة التوجيه
        setTimeout(() => {
          navigate(`/admin/collections/${collectionId}`);
        }, 3000);
      } else {
        handleErrors(response.data);
      }
    } catch (error) {
      const data = error.response?.data || {};

      setErrors((prev) => ({
       ...prev,
       title: data.errors?.title?.message || "",
       description: data.errors?.description?.message || "",
       
     }));
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data.message || "An error occurred",
        life: 3000,
      });
    }
  };

  const handleErrors = (data) => {
    const errorMessage = data.message || "An error occurred";
    const errorDetails = data.errors || {};

    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: errorMessage,
      life: 3000,
    });

    if (errorDetails.title) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Title error: ${errorDetails.title.message}`,
        life: 3000,
      });
    }
  };

  return (
    <Fragment>
      <div className="flex flex-nowrap justify-between mb-5">
        <div>
          <GoBackButton />
          <h1 className="inline-block ml-4 text-3xl dark:text-white">
            Create Collection
          </h1>
        </div>
      </div>

      <div className="col-span-3 xl:col-span-2 space-y-6">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form onSubmit={submitForm}>
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
                  className={`w-full ${errors.excerpt ? 'border-red-500' : ''}`}
                  pt={inputTextStyle}
                  unstyled={true}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              {errors.title && <small className="p-error">{errors.title}</small>}

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
                  onTextChange={(e) => setDescription(e.htmlValue)}
                />
              {errors.description && <small className="p-error">{errors.description}</small>}

              </div>
              <div className="mb-2">
                <label
                  htmlFor="image-upload"
                  className="w-full mb-2 block text-black dark:text-white"
                >
                  Image
                </label>
                <MediaUpload onChange={handleImageChange} maxFiles={1} />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="banner-upload"
                  className="w-full mb-2 block text-black dark:text-white"
                >
                  Banner
                </label>
                <MediaUpload onChange={handleBannerChange} maxFiles={1} />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="image-upload"
                  className="w-full mb-2 block text-black dark:text-white"
                >
                  Show in Home page
                </label>
                <SelectButton
                  value={showValue}
                  onChange={(e) => setShowValue(e.value)}
                  options={showOptions}
                />
              </div>

              <div className="pt-3 rounded-b-md sm:rounded-b-lg">
                <div className="flex items-center justify-end">
                  <Button
                    label="Add Collection"
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

      <Toast ref={toast} position="bottom-left"></Toast>
    </Fragment>
  );
};

export default AddCollection;

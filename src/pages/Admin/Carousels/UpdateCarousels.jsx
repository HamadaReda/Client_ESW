import { Fragment, useRef, useState, useEffect } from "react";
import GoBackButton from "../../../components/Admin/Buttons/GoBackButton";
import { InputText } from "primereact/inputtext";
import { inputTextStyle } from "../../../layout/inputTextStyle";
import { buttonsStyle } from "../../../layout/buttonsStyle";
import { Button } from "primereact/button";
import CustomEditor from "../../../components/Admin/CustomEditor";
import { Toast } from "primereact/toast";
import MediaUpload from "../../../components/Admin/MediaUpload/MediaUpload";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from "primereact/dropdown";

const UpdateCarousels = () => {
  const { id } = useParams(); // Get id from URL
  const navigate = useNavigate(); // For redirecting after update
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState(""); // New field for button text
  const [existingImage, setExistingImage] = useState(null);
  const [newImage, setNewImage] = useState(null); // For new image upload
  const [existingBanner, setExistingBanner] = useState(null);
  const [errors, setErrors] = useState({});

  const toast = useRef(null);
  
  
  useEffect(() => {
    // Fetch carousel data on component mount
    const fetchCarouselData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/carousels/${id}`, // Ensure correct endpoint
          {
            withCredentials: true,
          }
        );
        const { title, description, image , buttonText} = response.data.data; // Access data correctly
        setTitle(title);
        setDescription(description); // Set description as HTML
        setExistingImage(image.url); // Set existing image URL
        setButtonText(buttonText);
       
      } catch (error) {
        console.error("Error fetching carousel data:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch carousel data",
          life: 3000,
        });
      }
    };

    fetchCarouselData();
  }, [id]);

  const handleImageChange = (file) => {
    setNewImage(file); // Store new image
    setExistingImage(URL.createObjectURL(file)); // Preview new image
  };
 


  

  const submitForm = async (e) => {
    e.preventDefault();
    console.log("Form submitted"); // Check if the form is submitted

    try {
      // Create FormData object for carousel data
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description); // Send description as HTML
      formData.append("buttonText",buttonText);

      // Update carousel using PATCH request
      const updateResponse = await axios.patch(
        `${BASE_URL}/carousels/${id}`, // Ensure correct endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set correct content type
          },
          withCredentials: true, // Add this line
        }
      );
      if (newImage) {
        const formData = new FormData();
        formData.append("image", newImage);

        // رفع الصورة
        const imageResponse = await axios.patch(
          `${BASE_URL}/carousels/carousel-photo-upload/${id}`,
          formData,
          {
            withCredentials: true,
          }
        );
        if (imageResponse.data.status === "success") {
           toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Image uploaded successfully",
            life: 3000,
          });
        } else {
          throw new Error(imageResponse.data.message || "Image upload failed");
        }
      }
      
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Carousel updated successfully",
        life: 3000,
      });
    } catch (error) {
      const data = error.response?.data || {};

      setErrors((prev) => ({
       ...prev,
       title: data.errors?.title?.message || "",
       description: data.errors?.description?.message || "",
       buttonText: data.errors?.buttonText?.message || "",
       category: data.errors?.category?.message || "",
       
     }));
      console.error("Error updating carousel:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update carousel",
      });
    }
  };

  return (
    <Fragment>
      <div className="flex flex-nowrap justify-between mb-5">
        <div>
          <GoBackButton />
          <h1 className="inline-block ml-4 text-3xl dark:text-white">
            {title}
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
                  placeholder="Enter carousel title"
                  className={`w-full ${errors.title ? 'border-red-500' : ''}`}
                  pt={inputTextStyle}
                  unstyled={true}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && <small className="p-error">{errors.title}</small>}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="buttonText"
                  className="w-full mb-2 block text-black dark:text-white"
                >
                  Button Text
                </label>
                <InputText
                  id="buttonText"
                  type="text"
                  placeholder="Enter Button Text"
                  className={`w-full ${errors.buttonText ? 'border-red-500' : ''}`}
                  pt={inputTextStyle}
                  unstyled={true}
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                />
                {errors.buttonText && <small className="p-error">{errors.buttonText}</small>}
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

      <Toast ref={toast} position="bottom-left"></Toast>
    </Fragment>
  );
};

export default UpdateCarousels;

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { BASE_URL } from '../../constants';

const ProfilePictureUpload = () => {
  const [previewUrl, setPreviewUrl] = useState(''); // For image preview
  const [loading, setLoading] = useState(false); // To show loading state
  const [error, setError] = useState(''); // For error messages
  const toastRef = useRef(null); // Reference for the Toast
  const fileInputRef = useRef(null); // Reference for the file input

  // Fetch user's current profile picture
  const fetchProfilePicture = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/profile`, {
        withCredentials: true, // Include credentials if needed
      });
      setPreviewUrl(response.data.data.avatar.url); // Assuming the response contains the profile picture URL
    } catch (err) {
      console.error('Error fetching profile picture:', err);
      toastRef.current.show({
        severity: 'error',
        summary: 'Error',
        detail: err.response?.data?.message || 'Failed to fetch profile picture.',
        life: 3000,
      });
    }
  };

  // Fetch the profile picture when the component mounts
  useEffect(() => {
    fetchProfilePicture();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0]; // Get the first file
    if (!file) return;

    // Preview the selected image before upload
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const formData = new FormData();
    formData.append('avatar', file); // Append the file to FormData

    setLoading(true);
    setError(''); // Reset error state before upload

    try {
      const response = await axios.patch(
        `${BASE_URL}/users/user-photo-upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true, // To support cross-site credentials if needed
        }
      );

      console.log('Upload response:', response.data);

      // Re-fetch the profile picture to update the preview URL
      await fetchProfilePicture();

      // Optional: Reload the page to reflect changes (if needed)
      window.location.reload(); // Reload the page

      toastRef.current.show({
        severity: 'success',
        summary: 'Success',
        detail: response.data.message || 'Profile picture updated successfully!',
        life: 3000,
      });

    } catch (err) {
      console.error('Error uploading profile picture:', err);
      const errorMessage = err.response?.data?.message || 'Error updating profile picture. Please try again.';

      // Check if the error message is related to file validation
      if (errorMessage.includes('Invalid file type')) {
        setError('Invalid file type. Only JPEG, PNG, and JPG images are allowed.');
      } else {
        setError(errorMessage);
      }

      toastRef.current.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000,
      });
    } finally {
      setLoading(false); // Ensure loading state is turned off
    }
  };

  const openFileDialog = () => {
    // Trigger the file input click programmatically
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Toast ref={toastRef} position="bottom-left" /> {/* PrimeReact Toast component */}

      <div className="relative">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef} // Use the useRef hook for file input
          onChange={handleFileChange}
          className="hidden"
        />
        <img
          src={previewUrl} // Default avatar image
          alt="Profile"
          className={`w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600 transition-transform duration-200 cursor-pointer hover:scale-105 hover:shadow-lg ${loading ? 'opacity-50' : ''}`}
          onClick={openFileDialog} // Open file dialog on image click
        />
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="loader"></div> {/* Loader element, replace with actual loader */}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
};

export default ProfilePictureUpload;

import React, { useState, useRef } from "react";
import axios from "axios";
import { Toast } from "primereact/toast";
import DarkModeSwitcher from "../../components/Admin/Header/DarkModeSwitcher";
import { BASE_URL } from "../../constants";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const toast = useRef(null); // Reference for the Toast component

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_URL}/users/password/forget-password`,
        { email },
        { withCredentials: true }
      );

      toast.current.show({
        severity: "success",
        summary: "Link sent successfully",
        detail: response.data.message,
        life: 3000,
      });
    } catch (error) {
      const data = error.response?.data || {};
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: data.message || "Failed to update password. Please try again.",
        life: 3000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Toast for displaying messages */}
      <Toast ref={toast} />

      

      {/* Form container */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 max-w-md w-full">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
          Forgot your password?
        </h2>

        {/* Description */}
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Just let us know your email address and we will email you a password
          reset link that will allow you to choose a new one.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 dark:text-gray-300 font-semibold"
            >
              Email
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@address.tld"
              className="mt-2 block w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition duration-300"
          >
            Email Password Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

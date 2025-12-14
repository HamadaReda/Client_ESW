import React, { useRef, useState } from "react";
import axios from "axios";
import DarkModeSwitcher from "../../components/Admin/Header/DarkModeSwitcher";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "primereact/toast"; // Importing the Toast component
const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const { userId, token } = useParams();
  const toast = useRef(null); // Reference for Toast
  const navigate = useNavigate(); // React Router hook navigate

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessages({});
    if (newPassword !== confirmPassword) {
      setErrorMessages((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/users/password/reset-password/${userId}/${token}`,
        {
          newPassword,
        }
      );
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Password reset successfully!",
        life: 3000,
      });
      navigate("/login"); // Redirect to login after success
    } catch (err) {
      const data = err.response?.data || {};
      setErrorMessages((prev) => ({
        ...prev,
        newPassword: data.errors.newPassword.message,
      }));

      console.log(errorMessages);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.response.error.message || "Error resetting password. Please try again.",
        life: 3000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Toast ref={toast} position={"bottom-left"} />
      

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
          Reset your password
        </h2>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Please enter your new password and confirm it below.
        </p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* New Password */}
          <div className="relative">
            <label htmlFor="new-password" className="sr-only">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              // onFocus={() => handleFocus("newPassword")}
              placeholder="New Password"
              className={`w-full px-4 py-3 pl-10 border ${
                errorMessages.newPassword ? "border-red-500" : "border-gray-300"
              } dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errorMessages.newPassword && (
              <div className="text-red-500 dark:text-red-400">
                {errorMessages.newPassword}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label htmlFor="confirm-password" className="sr-only">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              // onFocus={() => handleFocus("confirmPassword")}
              placeholder="Confirm New Password"
              className={`w-full px-4 py-3 pl-10 border ${
                errorMessages.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              } dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errorMessages.confirmPassword && (
              <div className="text-red-500 dark:text-red-400">
                {errorMessages.confirmPassword}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 px-4 py-3 rounded-md shadow-md focus:outline-none"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

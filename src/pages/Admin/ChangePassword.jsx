import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast"; 
import { AiOutlineLock } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef(null);

  const handleChangePassword = async (e) => {
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
      setLoading(true);
      const response = await axios.patch(
        `${BASE_URL}/users/change-password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );

      toast.current.show({
        severity: "success",
        summary: "Password Updated",
        detail: response.data.message,
        life: 3000,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
    } catch (error) {
      const data = error.response?.data || {};
      setErrorMessages((prev) => ({
        ...prev,
        currentPassword: data.errors?.currentPassword?.message || "",
        newPassword: data.errors?.newPassword?.message || "",
      }));

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update password. Please try again.",
        life: 3000,
      });
      setLoading(false);
    }
  };

  const handleFocus = (field) => {
    setErrorMessages((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 sm:p-8 font-inter">
      <Toast ref={toast} position="bottom-left" aria-live="polite" />
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col md:flex-row">
        <div className="w-full">
          <div className="space-y-6 mb-8">
            <h3 className="font-bold text-2xl text-gray-900 dark:text-white">
              Change Password
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              For your security, please enter your current password, then choose a new one to update your account.
            </p>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password Input */}
              <div className="relative">
                <label htmlFor="current-password" className="sr-only">
                  Current Password
                </label>
                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  onFocus={() => handleFocus("currentPassword")}
                  placeholder="Current Password"
                  className={`w-full px-4 py-3 pl-10 border ${
                    errorMessages.currentPassword ? "border-red-500" : "border-gray-300"
                  } dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <AiOutlineLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                {errorMessages.currentPassword && (
                  <div className="text-red-500 dark:text-red-400">
                    {errorMessages.currentPassword}
                  </div>
                )}
              </div>

              {/* New Password Input */}
              <div className="relative">
                <label htmlFor="new-password" className="sr-only">
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onFocus={() => handleFocus("newPassword")}
                  placeholder="New Password"
                  className={`w-full px-4 py-3 pl-10 border ${
                    errorMessages.newPassword ? "border-red-500" : "border-gray-300"
                  } dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <AiOutlineLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                {errorMessages.newPassword && (
                  <div className="text-red-500 dark:text-red-400">
                    {errorMessages.newPassword}
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="relative">
                <label htmlFor="confirm-password" className="sr-only">
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => handleFocus("confirmPassword")}
                  placeholder="Confirm New Password"
                  className={`w-full px-4 py-3 pl-10 border ${
                    errorMessages.confirmPassword ? "border-red-500" : "border-gray-300"
                  } dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <AiOutlineLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                {errorMessages.confirmPassword && (
                  <div className="text-red-500 dark:text-red-400">
                    {errorMessages.confirmPassword}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

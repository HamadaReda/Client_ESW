import React, { useState, useRef } from "react";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineLock,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import axios from "axios"; // Import axios
import { BASE_URL } from "../../constants";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessages({});

    if (password !== confirmPassword) {
      setErrorMessages((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
      setLoading(false);
      return;
    }

    const userData = { firstName, lastName, email, password, phone };

    try {
      const response = await axios.post(
        `${BASE_URL}/users/register`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data; // Get data directly from the response

      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: data.message,
          life: 3000,
        });
        // Clear form fields after successful registration
        setFirstName("");
        setLastName("");
        setPhone("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        // Navigate to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      // Check for error response from the server
      const data = error.response?.data || {};
      setErrorMessages((prev) => ({
        ...prev,
        firstName: data.errors?.firstName?.message || "",
        lastName: data.errors?.lastName?.message || "",
        email: data.errors?.email?.message || "",
        password: data.errors?.password?.message || "",
        phone: data.errors?.phone?.message || "",
      }));

      // Display generic error message
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An error occurred. Please try again.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (field) => {
    setErrorMessages((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 relative">
      <Toast ref={toast} position="bottom-left" />
      
      <div className="w-full max-w-xl p-10 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Register In Trade-Sphere
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          {/* First Name */}
          <div className="relative">
            <label htmlFor="first-name" className="sr-only">
              First Name
            </label>
            <input
              id="first-name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onFocus={() => handleFocus("firstName")}
              placeholder="First Name"
              className={`w-full px-4 py-3 pl-10 border ${
                errorMessages.firstName ? "border-red-500" : "border-gray-300"
              } dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <AiOutlineUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            {errorMessages.firstName && (
              <div className="text-red-500">{errorMessages.firstName}</div>
            )}
          </div>

          {/* Last Name */}
          <div className="relative">
            <label htmlFor="last-name" className="sr-only">
              Last Name
            </label>
            <input
              id="last-name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onFocus={() => handleFocus("lastName")}
              placeholder="Last Name"
              className={`w-full px-4 py-3 pl-10 border ${
                errorMessages.lastName ? "border-red-500" : "border-gray-300"
              } dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <AiOutlineUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            {errorMessages.lastName && (
              <div className="text-red-500">{errorMessages.lastName}</div>
            )}
          </div>

          {/* Phone Number */}
          <div className="relative">
            <label htmlFor="phone" className="sr-only">
              Phone Number
            </label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onFocus={() => handleFocus("phone")}
              placeholder="Phone Number"
              className={`w-full px-4 py-3 pl-10 border ${
                errorMessages.phone ? "border-red-500" : "border-gray-300"
              } dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <AiOutlinePhone className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            {errorMessages.phone && (
              <div className="text-red-500">{errorMessages.phone}</div>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => handleFocus("email")}
              placeholder="Enter your email"
              className={`w-full px-4 py-3 pl-10 border ${
                errorMessages.email ? "border-red-500" : "border-gray-300"
              } dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <AiOutlineMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            {errorMessages.email && (
              <div className="text-red-500">{errorMessages.email}</div>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleFocus("password")}
              placeholder="Enter your password"
              className={`w-full px-4 py-3 pl-10 border ${
                errorMessages.password ? "border-red-500" : "border-gray-300"
              } dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <AiOutlineLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            {errorMessages.password && (
              <div className="text-red-500">{errorMessages.password}</div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label htmlFor="confirm-password" className="sr-only">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => handleFocus("confirmPassword")}
              placeholder="Confirm Password"
              className={`w-full px-4 py-3 pl-10 border ${
                errorMessages.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              } dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <AiOutlineLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            {errorMessages.confirmPassword && (
              <div className="text-red-500">
                {errorMessages.confirmPassword}
              </div>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className={`w-full py-3 font-semibold text-white bg-blue-600 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;

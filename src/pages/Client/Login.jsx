import React, { useState, useRef } from "react";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import DarkModeSwitcher from "../../components/Admin/Header/DarkModeSwitcher";
import { Toast } from "primereact/toast"; // PrimeReact Toast
import { useNavigate, Link } from "react-router-dom"; // For redirection and linking
import axios from "axios"; // Importing axios
import { BASE_URL } from "../../constants";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef(null); // Toast reference
  const navigate = useNavigate(); // Navigate for redirection

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/users/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      setLoading(false);
      const data = response.data;

      // Login successful
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: data.message,
        life: 3000,
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 relative">
      
      <Toast ref={toast} position="bottom-left" />{" "}
      {/* PrimeReact Toast component */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Log In Trade-Sphere
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div className="relative">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 pl-10 border ${
                error ? "border-red-500" : "border-gray-300"
              } dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <AiOutlineMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          </div>
          {/* Password Field */}
          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 pl-10 border ${
                error ? "border-red-500" : "border-gray-300"
              } dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <AiOutlineLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          </div>
          {error && <div className="text-red-500">{error}</div>}{" "}
          {/* Password error message */}
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 mt-4 text-white rounded-md bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {/* Google Login */}
          <button
            type="button"
            className="w-full py-2 mt-4 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="mr-2 h-5"
            />
            Login with Google
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="text-center mt-4">
          <Link
            to="/forget-password"
            className="text-blue-500 dark:text-blue-400"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Sign up Link */}
        <div className="text-center text-gray-500 dark:text-gray-300 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500 dark:text-blue-400">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

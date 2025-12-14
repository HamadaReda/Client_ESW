import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProfilePictureUpload from "../../components/Client/ProfilePictureUpload";
import { Toast } from "primereact/toast"; 
import { AiOutlineLock, AiOutlineMail, AiOutlinePhone, AiOutlineUser } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export const AdminProfile = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [errorMessages, setErrorMessages] = useState({});
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUserData = async () => {
          setLoading(true);
          try {
            const response = await axios.get(`${BASE_URL}/users/profileAdmin`, { withCredentials: true });
            const userData = response.data.data;
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            setEmail(userData.email);
            setPhone(userData.phone); 
            setIsAuthenticated(true);
    
          } catch (error) {
            console.error("Error fetching user data:", error);
            toast.current.show({ severity: "error", summary: "Error", detail: "Failed to fetch user data", life: 3000 });
            setIsAuthenticated(false);
            navigate('/expired-invalid-token-page');
    
          } finally {
            setLoading(false);
          }
        };
    
        fetchUserData();
      }, []);
    
      const handleSaveProfile = async (e) => {
        e.preventDefault();
        setErrorMessages({});
    
        try {
          const response = await axios.patch(
            `${BASE_URL}/users/update`,
            { firstName, lastName, email, phone },
            { withCredentials: true }
          );
    
          toast.current.show({ severity: "success", summary: "Success", detail: response.data.message, life: 3000 });
          window.location.reload();
        } catch (error) {
          const data = error.response?.data || {};
          setErrorMessages((prev) => ({
            ...prev,
            firstName: data.errors?.firstName?.message || "",
            lastName: data.errors?.lastName?.message || "",
            email: data.errors?.email?.message || "",
            phone: data.errors?.phone?.message || "",
          }));
    
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "An error occurred. Please try again.",
            life: 3000,
          });
        }
      };
      const handleFocus = (field) => {
        setErrorMessages((prev) => ({ ...prev, [field]: "" }));
      };
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-8 font-inter">
    <Toast ref={toast} position="bottom-left" aria-live="polite" />

    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 mb-4 md:mb-0 flex justify-center md:justify-start">
        <ProfilePictureUpload className="w-24 h-24 md:w-32 md:h-32" /> {/* Adjust size here */}
      </div>

      <div className="w-full md:w-2/3 mt-8 md:mt-16"> {/* Decrease margin here */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome, 
          {`${firstName} ${lastName}`}
        </h2>         
        <p className="text-gray-600 dark:text-gray-300 mb-6">Update your account's profile information and password.</p>

        <div className="space-y-6 mb-8">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Personal Information</h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* First Name */}
            <div className="relative">
              <label htmlFor="first-name" className="sr-only">First Name</label>
              <input
                id="first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onFocus={() => handleFocus("firstName")}
                placeholder="First Name"
                className={`w-full px-4 py-3 pl-10 border ${errorMessages.firstName ? "border-red-500" : "border-gray-300"} dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <AiOutlineUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              {errorMessages.firstName && <div className="text-red-500 dark:text-red-400">{errorMessages.firstName}</div>}
            </div>

            {/* Last Name */}
            <div className="relative">
              <label htmlFor="last-name" className="sr-only">Last Name</label>
              <input
                id="last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onFocus={() => handleFocus("lastName")}
                placeholder="Last Name"
                className={`w-full px-4 py-3 pl-10 border ${errorMessages.lastName ? "border-red-500" : "border-gray-300"} dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <AiOutlineUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              {errorMessages.lastName && <div className="text-red-500 dark:text-red-400">{errorMessages.lastName}</div>}
            </div>

            {/* Phone Number */}
            <div className="relative">
              <label htmlFor="phone" className="sr-only">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onFocus={() => handleFocus("phone")}
                placeholder="Phone Number"
                className={`w-full px-4 py-3 pl-10 border ${errorMessages.phone ? "border-red-500" : "border-gray-300"} dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <AiOutlinePhone className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              {errorMessages.phone && <div className="text-red-500 dark:text-red-400">{errorMessages.phone}</div>}
            </div>

            {/* Email */}
            <div className="relative">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => handleFocus("email")}
                placeholder="Email"
                className={`w-full px-4 py-3 pl-10 border ${errorMessages.email ? "border-red-500" : "border-gray-300"} dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <AiOutlineMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              {errorMessages.email && <div className="text-red-500 dark:text-red-400">{errorMessages.email}</div>}
            </div>

            {/* Save Profile Button */}
            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
  )
}

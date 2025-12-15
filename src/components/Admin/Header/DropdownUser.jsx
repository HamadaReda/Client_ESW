import React, { useState, useRef, useEffect } from "react";
import { SlArrowDown } from "react-icons/sl"; // Arrow icon
import DropdownList from "./DropdownList"; // Import the dropdown list
import axios from "axios"; // Import axios for making API calls
import { Toast } from "primereact/toast"; // Import PrimeReact Toast
import {BASE_URL} from "../../../constants";

const DropdownUser = ({ fullname, avatarUrl, role, onClose }) => {
  const [visible, setVisible] = useState(false); // State to control visibility of dropdown
  const toastRef = useRef(null); // Reference for the Toast
  const dropdownRef = useRef(null); // Reference for the dropdown

  // Function to handle logout
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/users/logout`, // Your API logout route
        {},
        { withCredentials: true }
      );
      // Show success message
      toastRef.current.show({
        severity: "success",
        summary: "Success",
        detail: response.data.message,
        life: 3000,
      });

      // Redirect to login page after 1 second
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (err) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to log out. Please try again.",
        life: 3000,
      });
    }
  };

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setVisible(false); // Close dropdown if clicked outside
      }
    };

    // Add event listener for detecting clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener when component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <li className="relative">
      <Toast ref={toastRef} /> {/* PrimeReact Toast component */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setVisible(!visible)} // Toggle dropdown visibility
      >
        <span className="hidden lg:block text-right">
          <span className="block text-sm font-medium text-black dark:text-white">
            {fullname}
          </span>
          <span className="block text-xs">{role}</span>
        </span>
        <span className="h-12 w-12 rounded-full overflow-hidden">
          <img
            src={
              avatarUrl ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt="User"
          />
        </span>
        <SlArrowDown
          className={`fill-body dark:fill-bodydark ${
            visible ? "rotate-180" : ""
          }`}
        />
        {/* Arrow rotation */}
      </div>
      {/* Show DropdownList only if visible */}
      {visible && (
        <div
          ref={dropdownRef} // Add ref to dropdown
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-20"
        >
          <DropdownList handleSignOut={handleLogout} />
        </div>
      )}
    </li>
  );
};

export default DropdownUser;

import React, { useState, useRef, useEffect } from "react";
import { SlArrowDown } from "react-icons/sl"; // Arrow icon
import DropdownList from "./DropdownList"; // Import the dropdown list
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toast } from "primereact/toast"; // Assuming you use PrimeReact for toasts
import { BASE_URL } from "../../../constants";

const UserDropdown = ({ firstname, avatarUrl, onClose }) => {
  const [visible, setVisible] = useState(false); // State to control visibility of dropdown
  const navigate = useNavigate(); // To navigate between pages
  const toast = useRef(null); // Reference for toast notifications
  const menuRef = useRef(null); // Reference for the dropdown menu

  // Function to handle logout
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/users/logout`, // Your API logout route
        {},
        { withCredentials: true }
      );
      // Show success message
      toast.current.show({
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
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to log out. Please try again.",
        life: 3000,
      });
    }
  };

  // Handle click outside and close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setVisible(false); // Close the dropdown when clicked outside
        if (onClose) onClose(); // Call onClose if provided
      }
    };

    // Add event listener for click outside when the component is mounted
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener when the component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Dropdown items
  const items = [
    {
      label: "Profile",
      icon: "pi pi-user",
      command: () => navigate(`/profile/${firstname}`),
    },
    {
      label: "Orders",
      icon: "pi pi-shopping-cart",
      command: () => navigate("/my-orders"),
    },
    { label: "Logout", icon: "pi pi-sign-out", command: () => handleLogout() },
  ];

  return (
    <li className="relative">
      {/* Toast Component for Notifications */}
      <Toast ref={toast} />

      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setVisible(!visible)} // Toggle dropdown visibility
      >
        {/* Display user first name */}
        <span className="hidden lg:block text-right">
          <span className="block text-sm font-medium text-black dark:text-white">
            {firstname}
          </span>
        </span>

        {/* Display avatar */}
        <span className="h-12 w-12 rounded-full overflow-hidden">
          <img
            src={
              avatarUrl ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt="User"
          />
        </span>

        {/* Arrow rotation */}
        <SlArrowDown
          className={`fill-body dark:fill-bodydark ${
            visible ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Show DropdownList only if visible */}
      {visible && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-20"
        >
          <DropdownList items={items} /> {/* Pass dropdown items */}
        </div>
      )}
    </li>
  );
};

export default UserDropdown;

import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaShoppingCart, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SearchComponent from "./SearchComponent";
import ClickOutside from "../ClickOutside";
import axios from "axios";
import AuthLinks from "./AuthLinks";
import UserDropdown from "./UserDropDown";
import DarkModeSwitcher from "../../Admin/Header/DarkModeSwitcher";

const UserHeader = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const searchButtonRef = useRef(null);
  const dropdownRef = useRef(null);

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "https://server-esw.up.railway.app/api/v1/users/profile",
          { withCredentials: true }
        );
        if (response.data && response.data.data) {
          const fullName = `${response.data.data.firstName} ${response.data.data.lastName}`;
          setFirstname(fullName);
          if (response.data.data.avatar) {
            setAvatarUrl(response.data.data.avatar.url);
          }
          setIsAuthenticated(true); // User is authenticated
        }
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
        setIsAuthenticated(false); // User is not authenticated
      }
    };
    checkAuth();
  }, []);

  // Update cart count
  useEffect(() => {
    const storedCartProducts =
      JSON.parse(localStorage.getItem("cartProducts")) || [];
    const totalCount = storedCartProducts.reduce(
      (acc, product) => acc + product.quantity,
      0
    );
    setCartCount(totalCount);
  }, []);

  const handleCartClick = () => {
    navigate("/Cart");
  };

  return (
    <header className="bg-white dark:bg-gray-900 w-full z-[999]">
      <div className="shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-4 py-3 lg:px-[6rem] xl:px-[8rem] font-sans">
          {/* Logo and Hamburger Menu */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center">
              <img
                src="https://res.cloudinary.com/ducmzit0a/image/upload/v1728842399/d4lohst2hmfr6cwztldm.png"
                alt="Logo"
                className="h-16 w-auto"
              />
            </Link>
            <FaBars
              className="text-gray-700 dark:text-gray-300 cursor-pointer lg:hidden"
              onClick={toggleMenu}
            />
          </div>

          {/* Right Side */}
          <div className="user-interactions flex items-center">
            <ul className="flex gap-4 items-center lg:gap-8">
              <DarkModeSwitcher />
              {isAuthenticated ? (
                <div>
                  <UserDropdown firstname={firstname} avatarUrl={avatarUrl} />
                </div>
              ) : (
                <AuthLinks />
              )}
              {/* Search Icon */}
              <FaSearch
                className="text-gray-700 dark:text-gray-300 cursor-pointer hidden lg:block"
                onClick={toggleSearch}
              />
              {/* Cart Icon */}
              <div className="relative hidden lg:block" onClick={handleCartClick}>
                <FaShoppingCart className="text-gray-700 dark:text-gray-300 text-2xl cursor-pointer" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-white dark:bg-gray-800 lg:hidden">
          <div className="container mx-auto px-4 py-2">
            <ul className="flex flex-col space-y-2">
              <li>
                <Link
                  to="/collections"
                  className="text-gray-700 dark:text-gray-300 hover:underline focus:outline-none"
                  onClick={() => setIsMenuOpen(false)} 
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-700 dark:text-gray-300 hover:underline focus:outline-none"
                  onClick={() => setIsMenuOpen(false)} 
                >
                  Contact us
                </Link>
              </li>
              <li>
                <div
                  className="text-gray-700 dark:text-gray-300 cursor-pointer"
                  onClick={handleCartClick} 
                >
                  Cart ({cartCount})
                </div>
              </li>
              <li>
                <FaSearch
                  className="text-gray-700 dark:text-gray-300 cursor-pointer"
                  onClick={toggleSearch} 
                />
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Search Component */}
      {isSearchOpen && (
        <ClickOutside
          exceptionRef={searchButtonRef}
          onClick={() => {
            setIsSearchOpen(false);
            setIsDropdownOpen(false);
          }}
        >
          <SearchComponent onClose={() => setIsSearchOpen(false)} />
        </ClickOutside>
      )}

      {/* User Dropdown */}
      {isDropdownOpen && (
        <ClickOutside
          exceptionRef={dropdownRef}
          onClick={() => {
            setIsDropdownOpen(false);
            setIsSearchOpen(false);
          }}
        >
          <UserDropdown
            firstname={firstname}
            avatarUrl={avatarUrl}
            onClose={() => setIsDropdownOpen(false)}
          />
        </ClickOutside>
      )}
    </header>
  );
};

export default UserHeader;

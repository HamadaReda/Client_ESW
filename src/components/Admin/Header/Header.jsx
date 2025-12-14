import React, { useEffect, useState } from "react";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownUser from "./DropdownUser";
import { CiSearch } from "react-icons/ci";
import { FaBars } from "react-icons/fa6";
import axios from "axios";
import UserDropdown from "../../Client/Header/UserDropDown";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../constants";

const Header = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fullname, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();


  const [error, setError] = useState(null);

  // Check authentication status and fetch user data if authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/users/profileAdmin`,
          { withCredentials: true }
        );
        setIsAuthenticated(true);

        if (response.data && response.data.data) {
          const fullName = `${response.data.data.firstName} ${response.data.data.lastName}`;
          setFullName(fullName);
          if (response.data.data.avatar) {
            setAvatarUrl(response.data.data.avatar.url);
          }
          if (response.data.data.role) {
            setRole(response.data.data.role);
          }
        }
        //401 token expiered or no  unauthorized
        //404 page not found
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
        setIsAuthenticated(false);
        navigate('/unauthorized-page');

      }
    };

    checkAuth();
  }, []);

 

 

  return (
    <header className="header bg-white sticky top-0 z-30 flex w-full drop-shadow-md dark:bg-boxdark dark:drop-shadow-none">
      <div className="header-container flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
        <div className="bar-btn block lg:hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(true);
            }}
            className="rounded-sm border border-stroke text-boxdark p-2 text-lg dark:border-strokedark dark:text-white"
          >
            <FaBars />
          </button>
        </div>
        <div className="search hidden sm:block text-lg">
          <form action="">
            <div className="flex pl-5">
              <button>
                <CiSearch className="fill-body stroke-[1] dark:fill-bodydark text-xl hover:fill-primary dark:hover:fill-primary" />
              </button>
              <input
                type="text"
                className="w-full bg-transparent focus:outline-none text-black dark:text-white pl-5 pr-4"
                placeholder="Type to search..."
              />
            </div>
          </form>
        </div>
        <div className="user-interactions">
          <ul className="flex gap-4 items-center lg:gap-9">
            <DarkModeSwitcher />
            <DropdownUser fullname={fullname} avatarUrl={avatarUrl} role ={role} />
            </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React, { useEffect, useState } from "react";
import { Menu } from "primereact/menu"; // PrimeReact Menu component
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {BASE_URL} from "../../../constants"; 

const DropdownList = ({ handleSignOut , showProfileAdmin }) => {
  const navigate = useNavigate();
  const [fullname, setFullName] = useState("");



   // Check authentication status and fetch user data if authenticated
   useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/users/profileAdmin`,
          { withCredentials: true }
        );

        if (response.data && response.data.data) {
          const fullName = `${response.data.data.firstName} ${response.data.data.lastName}`;
          setFullName(fullName);
          
         
        }
        //401 token expiered or no  unauthorized
        //404 page not found
      } catch (error) {
        navigate('/unauthorized-page');

      }
    };

    checkAuth();
  }, []);

  const items = [
    {
      label: "Personal Profile",
      icon: "pi pi-user",
      command: () => navigate(`profile/${fullname}`),
    },
    {
      label: "Change Password",
      icon: "pi pi-lock",
      command: () => navigate('changepassword'),
    },
    {
      label: "Sign Out",
      icon: "pi pi-sign-out",
      command: handleSignOut, // Trigger the sign out action
    },
  ];

  return <Menu model={items} popup={false} className="w-full" />;
};

export default DropdownList;

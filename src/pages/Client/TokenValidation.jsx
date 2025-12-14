import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../common/Loader";
import { BASE_URL } from "../../constants";

const TokenValidation = () => {
  const [loading, setLoading] = useState(true); // Add loading state
  const { userId, token } = useParams();
  const navigate = useNavigate(); // React Router hook navigate

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/users/password/reset-password/${userId}/${token}`,
          { withCredentials: true }
        );
        setLoading(false); // Set loading to false when request is complete
        navigate(`/password/get-reset-password-form/${userId}/${token}`);
      } catch (error) {
        setLoading(false); // Set loading to false on error
        navigate("/expired-invalid-token-page");
      }
    };

    fetchUserData();
  }, [userId, token, navigate]);

  // Conditionally render loader or content
  if (loading) {
    return (
      <div className="loader-container">
        <Loader />
      </div>
    );
  }

  // If not loading, render nothing because the user will be navigated to another page
  return null;
};

export default TokenValidation;

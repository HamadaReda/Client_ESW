import React from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import { useSelector } from "react-redux";
import Login from "../Client/Login";
import Register from "../Client/Register";
import Orders from "../Admin/Orders/Orders";
import ContactPage from "../Client/ContactPage";
import ForgotPassword from "../Client/ForgetPassword";
import NotFoundPage from "../Client/NotFoundPage"
const Hamis = () => {
  return (
    <NotFoundPage />
    //<ForgotPassword />
  );
};

export default Hamis;

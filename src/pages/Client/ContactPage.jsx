import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../constants";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessages({});

    const messageData = { name, email, messageBody };

    try {
      const response = await axios.post(
        `${BASE_URL}/users/send-message`,
        messageData,
        { withCredentials: true }
      );
      console.log("Hello");

      const data = response.data;
      if (response.status === 201) {
        // Show success toast
        if (toast.current) {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: data.message,
            life: 3000,
          });
        }

        // Reset form fields
        setName("");
        setEmail("");
        setMessageBody("");

        // Navigate after 2 seconds (adjust the delay as necessary)
        setTimeout(() => {
          navigate("/"); // Ensure the route exists in your router configuration
        }, 3000); // Adjusted to match the toast duration
      }
    } catch (error) {
      const data = error.response?.data || {};
      setErrorMessages((prev) => ({
        ...prev,
        name: data.errors?.name?.message || "",
        email: data.errors?.email?.message || "",
        messageBody: data.errors?.messageBody?.message || "",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <Toast ref={toast} position="top-right" />{" "}
      {/* Try top-right for visibility */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 p-6">
          <h1 className="text-white text-3xl font-bold">Contact Us</h1>
          <p className="mt-2 text-blue-200">We'd love to hear from you!</p>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Send Us a Message
          </h2>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className={`w-full px-4 py-3 pl-10 border ${
                errorMessages.name ? "border-red-500" : "border-gray-300"
              } dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errorMessages.name && (
              <div className="text-red-500">{errorMessages.name}</div>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              className={`w-full px-4 py-3 pl-10 border ${
                errorMessages.email ? "border-red-500" : "border-gray-300"
              } dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errorMessages.email && (
              <div className="text-red-500">{errorMessages.email}</div>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-gray-700 dark:text-gray-300"
            >
              Message
            </label>
            <textarea
              id="message"
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              rows="4"
              placeholder="Your Message"
              className={`w-full px-4 py-3 pl-10 border ${
                errorMessages.messageBody ? "border-red-500" : "border-gray-300"
              } dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errorMessages.messageBody && (
              <div className="text-red-500">{errorMessages.messageBody}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;

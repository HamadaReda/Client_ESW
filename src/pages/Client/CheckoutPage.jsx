import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { inputTextStyle } from "../../layout/inputTextStyle";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios"; // تأكد من استيراد axios
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { BASE_URL } from "../../constants";

const CheckoutPage = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [shippingAddress1, setShippingAddress1] = useState("");
  const [shippingAddress2, setShippingAddress2] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const toast = useRef(null);
  const [subtotal, setSubtotal] = useState(0);
  const [errorMessages, setErrorMessages] = useState({});

  const [paymentMethod, setPaymentMethod] = useState("")
  useEffect(() => {
    const storedCartProducts =
      JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartProducts(storedCartProducts);
    calculateSubtotal(storedCartProducts);
  }, []);

  const calculateSubtotal = (products) => {
    const total = products.reduce((acc, product) => {
      const discount = product.discount || 0;
      const newPrice = product.price * (1 - discount / 100);
      return acc + newPrice * product.quantity;
    }, 0);
    setSubtotal(total);
  };
  // تغيير حالة ال paymentMethod
  const paymentMethodHandler = (payMethod) => {
    setPaymentMethod(payMethod)
    console.log("payMethod", payMethod)
  }


  const handlePayment = async () => {
    const orderData = {
      orderItems: cartProducts.map((product) => ({
        product: product._id, // استخدم معرف المنتج من سلة التسوق
        quantity: product.quantity,
      })),
      shippingAddress1: shippingAddress1,
      shippingAddress2: shippingAddress2,
      city: city,
      zip: zip,
      country: country,
      phone: phone,
    };

    try {
      // إرسال الطلب لإنشاء الطلب
      const response = await axios.post(
        `${BASE_URL}/orders/make-order`,
        orderData,
        { withCredentials: true }
      );

      // استخراج مفاتيح الدفع
      const { paymentKey, frame_id } = response.data.data;
      // إعادة توجيه إلى iframe الدفع
      if (paymentKey) {
        window.location.href = `https://accept.paymob.com/api/acceptance/iframes/${frame_id}?payment_token=${paymentKey}`;
      }
    } catch (error) {
      // Check for error response from the server
      const data = error.response?.data || {};
      setErrorMessages((prev) => ({
        ...prev,
        shippingAddress1: data.errors?.shippingAddress1?.message || "",
        shippingAddress2: data.errors?.shippingAddress2?.message || "",
        city: data.errors?.city?.message || "",
        country: data.errors?.country?.message || "",
        phone: data.errors?.phone?.message || "",
        zip: data.errors?.zip?.message || "",
      }));

      // Display generic error message
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail:
          error.response.data.message || "An error occurred. Please try again.",
        life: 3000,
      });
    }
  };

  const handleFocus = (field) => {
    setErrorMessages((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="container relative mx-auto p-8 flex flex-col lg:flex-row justify-between">
      <Toast ref={toast} position="bottom-left" />

      {/* Form Section */}

      <div className="w-full lg:w-2/3">
        <div className="flex flex-col lg:flex-row justify-center items-start p-8">
          {/* Left Section */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-4xl font-bold mb-6 dark:text-white">
              Checkout
            </h2>

            {/* Shipping Information */}
            <section className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 dark:text-white">
                Shipping Information
              </h3>

              <div className="mb-4">
                <label htmlFor="address" className="block mb-2 dark:text-white">
                  Main Address
                </label>
                <InputText
                  id="address"
                  value={shippingAddress1}
                  onChange={(e) => setShippingAddress1(e.target.value)}
                  onFocus={() => handleFocus("address")}
                  className={`w-full ${
                    errorMessages.shippingAddress1 ? "border-red-500" : ""
                  }`}
                  pt={inputTextStyle}
                />
                {errorMessages.shippingAddress1 && (
                  <div className="text-red-500">
                    {errorMessages.shippingAddress1}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block mb-2 dark:text-white">
                  Second Address
                </label>
                <InputText
                  id="address"
                  value={shippingAddress2}
                  onChange={(e) => setShippingAddress2(e.target.value)}
                  onFocus={() => handleFocus("address")}
                  className={`w-full ${
                    errorMessages.shippingAddress2 ? "border-red-500" : ""
                  }`}
                  pt={inputTextStyle}
                />
                {errorMessages.shippingAddress2 && (
                  <div className="text-red-500">
                    {errorMessages.shippingAddress2}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="city" className="block mb-2 dark:text-white">
                  City
                </label>
                <InputText
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onFocus={() => handleFocus("city")}
                  className={`w-full ${
                    errorMessages.city ? "border-red-500" : ""
                  }`}
                  pt={inputTextStyle}
                />
                {errorMessages.city && (
                  <div className="text-red-500">{errorMessages.city}</div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="country"
                    className="block mb-2 dark:text-white"
                  >
                    Country
                  </label>
                  <InputText
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    onFocus={() => handleFocus("country")}
                    className={`w-full ${
                      errorMessages.country ? "border-red-500" : ""
                    }`}
                    pt={inputTextStyle}
                  />
                  {errorMessages.country && (
                    <div className="text-red-500">{errorMessages.country}</div>
                  )}
                </div>
                <div>
                  <label htmlFor="zip" className="block mb-2 dark:text-white">
                    ZIP / Postal code
                  </label>
                  <InputText
                    id="zip"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    onFocus={() => handleFocus("zip")}
                    className={`w-full ${
                      errorMessages.zip ? "border-red-500" : ""
                    }`}
                    pt={inputTextStyle}
                  />
                  {errorMessages.zip && (
                    <div className="text-red-500">{errorMessages.zip}</div>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block mb-2 dark:text-white">
                  Phone
                </label>
                <InputText
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={() => handleFocus("phone")}
                  className={`w-full ${
                    errorMessages.phone ? "border-red-500" : ""
                  }`}
                  pt={inputTextStyle}
                />
                {errorMessages.phone && (
                  <div className="text-red-500">{errorMessages.phone}</div>
                )}
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 dark:text-white">
                Shipping Information
              </h3>
              <div className="flex flex-wrap gap-5">

                <div className="mt-4 h-20	w-56">
                  <Button className={classNames(
                    { "border-transparent ring-2 ring-sky-600": paymentMethod === "cash_on_delivery" },
                    "relative block cursor-pointer rounded-lg border bg-transparent hover:bg-transparent px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between border-gray-300",
                  )} onClick={() => paymentMethodHandler("cash_on_delivery")}>
                    <span className="flex items-center">
                      <span className="flex flex-col text-sm">
                        <span className="font-medium text-gray-900">
                          Cash on Delivery
                        </span>
                        <span className="text-gray-500">
                          <span className="block sm:inline">
                            Pay with cash on delivery
                          </span>
                        </span>
                      </span>
                    </span>
                  </Button>
                </div>

                <div className="mt-4 h-20	w-56">
                  <Button className={classNames(
                    { "border-transparent ring-2 ring-sky-600": paymentMethod === "paymob" },
                    "relative block cursor-pointer rounded-lg border bg-transparent hover:bg-transparent px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between border-gray-300",
                  )} onClick={() => paymentMethodHandler("paymob")}>
                    <div className="flex items-center">
                      <div className="flex flex-col text-sm text-center">
                        <div>
                          <img src="https://paymob.com/images/paymobLogo.png" alt="Paymob" className="w-40" />
                        </div>
                        <div className="text-gray-500">
                          <span className="block sm:inline">
                          </span>
                        </div>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>

            </section>

            <section>
              <Link
                className="text-white hover:underline text-base font-medium  block text-center bg-blue-500 py-3 rounded-md mt-20 dark:text-black"
                onClick={handlePayment} // تأكد من استخدام دالة المعالجة الصحيحة
              >
                Confirm order
              </Link>
            </section>
          </div>

          {/* Confirm Order Button */}
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="w-full pt-8 lg:w-1/3 lg:ml-8 mt-8 lg:mt-0">
        <div className="p-4 md:p-8 lg:p-12 border border-gray-200 rounded-lg shadow-xl bg-gray-50 w-full lg:w-7/8 xl:w-10/14 lg:sticky top-16  dark:bg-gray-900 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Summary</h2>
          {cartProducts.length > 0 ? (
            <div className="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
              {cartProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex flex-col md:flex-row justify-between items-center mb-6"
                >
                  {/* Product Image */}
                  <img
                    src={product.gallery[0].url}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div className="flex flex-col md:flex-grow">
                    <h3 className="font-semibold dark:text-white">
                      {product.title}
                    </h3>
                    <p className="text-gray-800 dark:text-gray-300">
                      Price | {(product.price * (1 - (product.discount / 100)))} EGP  <span className="ml-3  line-through text-start text-slate-600">{product.price} EGP</span>

                    </p>
                    <p className="text-gray-800 dark:text-gray-300">
                      QTY | {product.quantity}
                    </p>
                    <p className="text-right font-semibold dark:text-white">
                      {((product.price * (1 - (product.discount / 100))) * product.quantity).toFixed(2)}  EGP
                    </p>
                  </div>
                </div>
              ))}
              <div className="border-t border-gray-300 mt-4 pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold dark:text-white">
                    Subtotal:
                  </span>
                  <span className="font-semibold dark:text-white">
                    {subtotal.toFixed(2)} EGP
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold dark:text-white">
                    Shipping:
                  </span>
                  <span className="font-semibold dark:text-white">0.00 EGP</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{subtotal.toFixed(2)} EGP</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Your cart is empty.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

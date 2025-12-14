import axios from "axios";
import React from "react";
import { useEffect } from "react";

const PaymobPayment = () => {
  let orderData = {
    orderItems: [
      {
        product: "66fef1683cea8e8f6e7c1dd8",
        quantity: "5",
      },
      {
        product: "66fef1683cea8e8f6e7c1dc8",
        quantity: "3",
      },
      {
        product: "66fef1683cea8e8f6e7c1dae",
        quantity: "1",
      },
    ],
    shippingAddress1: "address 1",
    shippingAddress2: "address 2",
    city: "Nasr",
    zip: "452",
    country: "Alex",
    phone: "12313313333",
  };

  useEffect(() => {
    const initiatePayment = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/orders/make-order`,
          orderData,
          { withCredentials: true }
        );
        const paymentKey = response.data.data.paymentKey;
        const frame_id = response.data.data.frame_id;

        // Step 4: Redirect or Open Payment Form (e.g., using an iframe or redirect)
        if (paymentKey) {
          window.location.href = `https://accept.paymob.com/api/acceptance/iframes/${frame_id}?payment_token=${paymentKey}`;
        }
      } catch (error) {
        console.error("Payment initiation failed:", error.response.data);
      }
    };
    initiatePayment();
  }, []);
  return <div></div>;
};

export default PaymobPayment;

import { Fragment, useRef, useState, useEffect } from "react";
import GoBackButton from "../../../components/Admin/Buttons/GoBackButton";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { buttonsStyle } from "../../../layout/buttonsStyle";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../constants";

const SingleOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);

  // Order state variables
  const [customerName, setCustomerName] = useState("");
  const [shippingAddress1, setShippingAddress1] = useState("");
  const [shippingAddress2, setShippingAddress2] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderItems, setOrderItems] = useState([]);

  // State for error messages
  const [errors, setErrors] = useState({});

  // Order status options
  const orderStatusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  // Fetch order data when the component mounts
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/orders/${id}`, {
          withCredentials: true,
        });

        const order = response.data.data;
        setCustomerName(`${order.user.firstName} ${order.user.lastName}`);
        setShippingAddress1(order.shippingAddress1);
        setShippingAddress2(order.shippingAddress2);
        setOrderStatus(order.status);
        setTotalAmount(order.totalPrice);
        setOrderItems(order.orderItems);
      } catch (error) {
        console.error("Error fetching order data:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch order data",
        });
      }
    };

    fetchOrderData();
  }, [id]);

  // Submit form to update only order status
  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const updateResponse = await axios.patch(
        `${BASE_URL}/orders/${id}`,
        {
          status: orderStatus, // Only update the status
        },
        {
          withCredentials: true,
        }
      );

      toast.current.show({ severity: "success", summary: "Success", detail: "Order updated successfully", life: 3000 });

      // Navigate back to orders page after a delay
      setTimeout(() => {
        navigate('/admin/orders');
      }, 2000);

      console.log("Update Response:", updateResponse.data);
    } catch (error) {
      const data = error.response?.data || {};

      setErrors((prev) => ({
        ...prev,
        orderStatus: data.errors?.orderStatus?.message || "",
      }));

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Failed to update order",
      });
    }
  };

  // Function to get class name based on order status
  const getStatusClassName = (status) => {
    return status === "Completed"
      ? "text-green-600 dark:text-green-400"
      : status === "Pending"
      ? "text-yellow-500 dark:text-yellow-400"
      : status === "Cancelled"
      ? "text-red-500 dark:text-red-400"
      : status === "Shipped"
      ? "text-blue-600 dark:text-blue-400"
      : "";
  };

  // Custom item template for the Dropdown
  const itemTemplate = (option) => {
    return (
      <div className={`flex items-center ${getStatusClassName(option.value)}`}>
        {option.label}
      </div>
    );
  };

  return (
    <Fragment>
      <div className="flex flex-nowrap justify-between mb-5">
        <div>
          <GoBackButton />
          <h1 className="inline-block ml-4 text-3xl dark:text-white">Update Order</h1>
        </div>
      </div>

      <div className="col-span-3 xl:col-span-2 space-y-6">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form onSubmit={submitForm}>
            {/* Instruction Header */}
            <div className="p-6 mb-4 bg-gray-100 dark:bg-gray-800 rounded-md">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                You can only update the order status.
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 p-6">
              {/* Customer Name Display */}
              <div className="mb-2">
                <label htmlFor="customerName" className="w-full mb-2 block text-black dark:text-white">Customer Name</label>
                <InputText
                  id="customerName"
                  type="text"
                  value={customerName}
                  className="w-full"
                  readOnly // Read-only field
                />
              </div>

              {/* Shipping Address 1 Display */}
              <div className="mb-2">
                <label htmlFor="shippingAddress1" className="w-full mb-2 block text-black dark:text-white">Shipping Address 1</label>
                <InputText
                  id="shippingAddress1"
                  type="text"
                  value={shippingAddress1}
                  className="w-full"
                  readOnly // Read-only field
                />
              </div>

              {/* Shipping Address 2 Display */}
              <div className="mb-2">
                <label htmlFor="shippingAddress2" className="w-full mb-2 block text-black dark:text-white">Shipping Address 2</label>
                <InputText
                  id="shippingAddress2"
                  type="text"
                  value={shippingAddress2}
                  className="w-full"
                  readOnly // Read-only field
                />
              </div>

              {/* Order Status Dropdown */}
              <div className="mb-2">
                <label htmlFor="orderStatus" className="w-full mb-2 block text-black dark:text-white">Order Status</label>
                <Dropdown
                  id="orderStatus"
                  options={orderStatusOptions}
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.value)}
                  placeholder="Select an order status"
                  className={`w-full ${errors.orderStatus ? 'border-red-500' : ''}`}
                  itemTemplate={itemTemplate} // Custom item template
                />
                {errors.orderStatus && <small className="p-error">{errors.orderStatus}</small>}
              </div>

              {/* Total Amount Display */}
              <div className="mb-2">
                <label htmlFor="totalAmount" className="w-full mb-2 block text-black dark:text-white">Total Amount (EGP)</label>
                <InputText
                  id="totalAmount"
                  type="number"
                  value={totalAmount}
                  className="w-full"
                  readOnly // Read-only field
                />
              </div>

              {/* Order Items Display */}
              <div className="mb-2">
                <label className="w-full mb-2 block text-black dark:text-white">Order Items</label>
                <div className="p-2 border rounded">
                  {orderItems.length > 0 ? (
                    orderItems.map((item, index) => (
                      <div key={index} className="flex justify-between mb-2">
                        <span>{item.name} (Qty: {item.quantity})</span>
                        <span>${item.price}</span>
                      </div>
                    ))
                  ) : (
                    <p>No items in this order.</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 rounded-b-md sm:rounded-b-lg">
                <div className="flex items-center justify-end">
                  <Button label="Save Changes" size="normal" className="text-base" pt={buttonsStyle} />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Toast ref={toast} position="bottom-left"></Toast>
    </Fragment>
  );
};

export default SingleOrderDetails;

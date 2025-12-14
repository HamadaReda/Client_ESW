import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { dataTabelStyle } from "../../../layout/dataTabelStyle";
import { useParams } from 'react-router-dom'; // Import useParams to get URL parameters
import GoBackButton from "../../../components/Admin/Buttons/GoBackButton";
import axios from "axios"; // Import axios for API calls
import { BASE_URL } from "../../../constants";

const SingleCustomerDetails = () => {
  const { id } = useParams(); // Get the customer ID from the URL
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    // Fetch customer data based on the ID
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admins/${id}`, {
          withCredentials: true,
        });

        if (response.data.status === "success") {
          const customerData = {
            customer: {
              name: `${response.data.data.firstName} ${response.data.data.lastName}`,
              email: response.data.data.email,
              phone: response.data.data.phone,
              address: response.data.data.address || "N/A", // Assuming address can be present in your data
              image: response.data.data.avatar.url,
            },
            orders: [], // You might need to fetch orders separately if available
          };
          setCustomer(customerData);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchCustomerData();
  }, [id]); // Fetch data when the id changes

  if (!customer) {
    return <div className="text-center text-red-500">No customer details available.</div>;
  }

  const orderBodyTemplate = (rowData) => <span>{rowData.orderId}</span>;

  const statusBodyTemplate = (rowData) => (
    <span className={`px-2 py-1 rounded-lg ${rowData.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
      {rowData.status}
    </span>
  );

  const totalBodyTemplate = (rowData) => <span>${rowData.total.toFixed(2)}</span>;

  const handleDelete = () => {
    console.log("Deleting customer:", customer.customer.name);
    // Logic to delete the customer goes here
  };

  const handleConfirmClick = (event) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Are you sure you want to delete this customer?",
      icon: 'pi pi-exclamation-triangle',
      accept: handleDelete,
      reject: () => alert('Action canceled'),
    });
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <div className="flex items-center justify-between mb-6">
        {/* Go Back Button and Order Title */}
        <div className="flex items-center">
          <GoBackButton />
          <h1 className="inline-block ml-4 text-3xl dark:text-white">
            {customer.customer.name}
          </h1>
        </div>
      </div>

      <ConfirmPopup />

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Customer Information</h3>
        <p><strong>Email:</strong> {customer.customer.email}</p>
        <p><strong>Phone:</strong> {customer.customer.phone}</p>
        <p><strong>Address:</strong> {customer.customer.address}</p>
        <img src={customer.customer.image} alt={customer.customer.name} className="w-24 h-24 rounded-full mt-4" />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Order History</h3>
        <DataTable value={customer.orders} responsiveLayout="scroll" pt={dataTabelStyle}>
          <Column field="orderId" header="Order ID" body={orderBodyTemplate} />
          <Column field="status" header="Status" body={statusBodyTemplate} />
          <Column field="total" header="Total Amount" body={totalBodyTemplate} />
        </DataTable>
      </div>
    </div>
  );
};

export default SingleCustomerDetails;

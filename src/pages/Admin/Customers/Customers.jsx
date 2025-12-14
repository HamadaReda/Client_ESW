import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import "primeicons/primeicons.css";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { dataTabelStyle } from "../../../layout/dataTabelStyle";
import { inputTextStyle } from "../../../layout/inputTextStyle";
import { Button } from "primereact/button";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup'; 
import { BASE_URL } from "../../../constants";

export const Customers = () => {
  const [customers, setCustomers] = useState([]); // State for customers
  const [filter, setFilter] = useState({
    "customer.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const navigate = useNavigate(); // Use navigate from react-router-dom

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admins`, {
          withCredentials: true,
        });
        if (response.data.status === "success") {
          // Filter out admin users and map response data
          const allUsers = response.data.data.allUsers
            .filter(user => !user.isAdmin) // Filter out admin users
            .map(user => ({
              id: user._id,
              customer: {
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                phone: user.phone,
                address: user.address || "N/A", // Adjust based on your data
                image: user.avatar.url,
                orders: "0" // Placeholder; update as needed
              }
            }));
          setCustomers(allUsers);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchCustomers(); // Fetch customers when component mounts
  }, []); // Empty dependency array means this runs once on mount

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filter = { ...filter };

    _filter["customer.name"].value = value; 
    setFilter(_filter);
    setGlobalFilterValue(value);
  };

  // Update paginator content
  useEffect(() => {
    document.querySelector(".nextPageButton").innerHTML =
      "Next <i class='pi pi-angle-double-right ml-1'></i>";
    document.querySelector(".prevPageButton").innerHTML =
      " <i class='pi pi-angle-double-left mr-1'></i> Previous";
  }, []);

  const header = () => {
    return (
      <div className="flex flex-col justify-content-end">
        <IconField iconPosition="left" className="relative">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search by Name"
            className="pl-10"
            pt={inputTextStyle}
          />
        </IconField>
      </div>
    );
  };

 

  const customerTemplate = (rowData) => {
    return (
      <div className="flex items-center space-x-2">
        <img
          src={rowData.customer.image}
          alt={rowData.customer.name}
          className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600"
        />
        <Link
          to={`/admin/customers/${rowData.id}`} // Link to single customer details
          className="text-black dark:text-white font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
        >
          {rowData.customer.name}
        </Link>
      </div>
    );
  };

  return (
    <div>
      <Fragment>
        <div className="flex flex-nowrap justify-between mb-5">
          <h1 className="text-3xl dark:text-white">Customers</h1>
        </div>
        <div>
          <DataTable
            value={customers}
            rows={5}
            size="small"
            dataKey="id"
            filters={filter}
            filterDisplay="menu"
            globalFilterFields={["customer.name"]}
            header={header}
            paginator
            paginatorTemplate=" CurrentPageReport PrevPageLink NextPageLink "
            currentPageReportTemplate=" Showing {first} to {last} of {totalRecords} results"
            className="custom-paginator"
            pt={dataTabelStyle}
          >
            <Column field="customer" header="Customer" body={customerTemplate} />
            <Column field="orders" header="Orders" />
          </DataTable>
        </div>
      </Fragment>
      <ConfirmPopup />
    </div>
  );
};

export default Customers;

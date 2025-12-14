import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; 
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
import { Toast } from "primereact/toast";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import {BASE_URL} from "../../../constants"

const OrderDataTable = () => {
  const [allOrders, setAllOrders] = useState([]); 
  const navigate = useNavigate(); 
  const toast = useRef(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/orders`, {
        withCredentials: true, 
      });
      const orders = response.data.data.orders;
      setAllOrders(orders); 
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(); 
  }, []);

  const [filter, setFilter] = useState({
    _id: { value: null, matchMode: FilterMatchMode.CONTAINS }, 
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filter = { ...filter };
    _filter["_id"].value = value; 
    setFilter(_filter);
    setGlobalFilterValue(value);
  };

  const totalBodyTemplate = (rowData) => `${rowData.totalPrice.toFixed(2)} EGP`;

  const header = () => {
    return (
      <div className="flex flex-col justify-content-end">
        <IconField iconPosition="left" className="relative">
          <InputIcon className="pi pi-search absolute top-4 mt-0 left-3" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search by ID"
            className="pl-10 dark:bg-gray-800 dark:text-white"
            pt={inputTextStyle}
          />
        </IconField>
      </div>
    );
  };

  
 
 // Update paginator content
 useEffect(() => {
  document.querySelector(".nextPageButton").innerHTML =
    "Next <i class='pi pi-angle-double-right ml-1'></i>";
  document.querySelector(".prevPageButton").innerHTML =
    " <i class='pi pi-angle-double-left mr-1'></i> Previous";
}, []);

const handleDeleteOrder = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/orders/${id}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json', 
      },
    });

    if (response.status === 200) {
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Order deleted successfully",
        life: 2000,
      });

      // Fetch the updated categories after deletion
      fetchOrders();

    } else {
      throw new Error('Failed to delete the order');
    }
  } catch (error) {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: error.message || 'An error occurred while deleting the order.',
      life: 2000,
    });
  }
};

const confirmDeleteOrder = (event, id) => {
  confirmPopup({
    target: event.currentTarget,
    message: "Are you sure you want to delete this Order?",
    icon: "pi pi-exclamation-triangle",
    accept: () => handleDeleteOrder(id),
    reject: () =>
      toast.current.show({
        severity: "warn",
        summary: "Canceled",
        detail: "Order deletion was canceled",
        life: 2000,
      }),
  });
};

const actionBodyTemplate = (rowData) => (
  <>
    <Button
      icon="pi pi-pencil"
      rounded
      outlined
      className="mr-2"
      aria-label="Edit order"
      onClick={() => navigate(`/admin/products/update/${rowData._id}`)}
    />
    <Button
      icon="pi pi-trash"
      rounded
      outlined
      severity="danger"
      aria-label="Delete order"
      onClick={(e) => confirmDeleteOrder(e, rowData._id)}
    />
  </>
);

  const idTemplate = (rowData) => (
    <Link
      to={`/admin/orders/${rowData._id}`}
      className="text-black dark:text-white font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
    >
      {rowData._id} 
    </Link>
  );

  const nameTemplate = (rowData) => (
    <Link
      to={`admin/customers/${rowData.user._id}`}
      className="text-black dark:text-white font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
    >
      {rowData.user.firstName} {rowData.user.lastName} 
    </Link>
  );

  // New template for status column
  const statusTemplate = (rowData) => (
    <span
      className={`text-sm font-semibold ${
        rowData.status === "Completed"
          ? "text-green-600 dark:text-green-400"
          : rowData.status === "Pending"
          ? "text-yellow-500 dark:text-yellow-400"
          : rowData.status ==="Cancelled"
          ?"text-red-500 dark:text-red-400"
          :rowData.status ==="Shipped"
          ? "text-blue-600 dark:text-blue-400"
          : ""
      }`}
    >
      {rowData.status.charAt(0).toUpperCase() + rowData.status.slice(1)}
    </span>
  );

  return (
    <div className="dark:bg-gray-900 dark:text-white">
      <Toast ref={toast} position="bottom-left" />

      <DataTable
        value={allOrders}
        rows={5}
        size="small"
        dataKey="_id"
        filters={filter}
        filterDisplay="menu"
        globalFilterFields={["_id"]}
        header={header}
        paginator
        paginatorTemplate="CurrentPageReport PrevPageLink NextPageLink"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results"
        className="custom-paginator dark:bg-gray-900"
        pt={dataTabelStyle}
      >
        <Column
          field="_id"
          header="#"
          body={idTemplate}
          style={{ minWidth: "12rem" }}
          sortable
        />
        <Column
          field="user.firstName"
          header="Customer Name"
          body={nameTemplate}
          style={{ minWidth: "12rem" }}
          sortable
        />
        <Column
          field="totalPrice"
          header="Total"
          body={totalBodyTemplate}
          style={{ minWidth: "12rem" }}
          sortable
        />
        <Column
          field="status"
          header="Status" 
          body={statusTemplate} 
          style={{ minWidth: "8rem" }}
          sortable
        />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ minWidth: "12rem" }}
        />
      </DataTable>
      <ConfirmPopup />

    </div>
  );
};

export default OrderDataTable;

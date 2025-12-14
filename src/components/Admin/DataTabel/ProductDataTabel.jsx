import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios"; // Import axios for API requests
import "primeicons/primeicons.css"; // PrimeReact icons
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { dataTabelStyle } from "../../../layout/dataTabelStyle"; // Custom styles
import { inputTextStyle } from "../../../layout/inputTextStyle";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { BASE_URL } from "../../../constants";


const ProductDataTabel = () => {
  const [allProducts, setAllProducts] = useState([]); // State to store fetched products
  const navigate = useNavigate(); // Initialize useNavigate for routing
  const toast = useRef(null);

  // Fetch products from the API with credentials
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products`, {
        withCredentials: true, // Send credentials with the request
      });
      const products = response.data.data.products;
      setAllProducts(products); // Set fetched products
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products on component mount
  }, []);

  // For filtering data on table
  const [filter, setFilter] = useState({
    title: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filter = { ...filter };

    _filter["title"].value = value;

    setFilter(_filter);
    setGlobalFilterValue(value);
  };
  const priceBodyTemplate = (rowData) => `${rowData.price.toFixed(2)} EGP`;

  // Table header section
  const header = () => {
    return (
      <div className="flex flex-col justify-content-end">
        <IconField iconPosition="left" className="relative">
          <InputIcon className="pi pi-search absolute top-4 mt-0 left-3" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search by title"
            className="pl-10"
            pt={inputTextStyle}
          />
        </IconField>
      </div>
    );
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/products/${id}`, {
        withCredentials: true, // This allows credentials to be sent with the request
        headers: {
          'Content-Type': 'application/json', // Set content type if necessary
        },
      });
      // Check if the response indicates success
      if (response.status === 200) {
        // Show success toast notification
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Product deleted successfully",
          life: 2000,
        });
       
        // Navigate to another page or refresh as needed
        setTimeout(() => {
          window.location.reload();
     }, 2000)
      } else {
        throw new Error('Failed to delete the Product');
      }
    } catch (error) {
      // Handle any errors that occur during the Axios request
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || 'An error occurred while deleting the Product.',
        life: 2000,
      });
    }
  };
  
  const confirmDeleteProduct = (event, id) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Are you sure you want to delete this order?",
      icon: "pi pi-exclamation-triangle",
      accept: () => handleDeleteProduct(id),
      reject: () =>
        toast.current.show({
          severity: "warn",
          summary: "Canceled",
          detail: "Product deletion was canceled",
          life: 2000,
        }),
    });
  };

  // Update paginator content
  useEffect(() => {
    document.querySelector(".nextPageButton").innerHTML =
      "Next <i class='pi pi-angle-double-right ml-1'></i>";
    document.querySelector(".prevPageButton").innerHTML =
      " <i class='pi pi-angle-double-left mr-1'></i> Previous";
  }, []);
  const actionBodyTemplate = (rowData) => (
    <>
      <Button
        icon="pi pi-pencil"
        rounded
        outlined
        className="mr-2"
        aria-label="Edit order"
        onClick={() => navigate(`/admin/products/${rowData._id}`)}
      />
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        aria-label="Delete order"
        onClick={(e) => confirmDeleteProduct(e, rowData._id)}
      />
    </>
  );


  // First row body template for product details
  const ProductBodyTemplate = (rowData) => {
    const handleTitleClick = () => {
      navigate(`/admin/products/${rowData._id}`); // Navigate to product update page
    };
   
    return (
      <Fragment>
        <img
          src={rowData.gallery[0]?.url}
          alt={rowData.title}
          className="h-12.5 w-15 rounded-md inline-block mr-5"
          style={{ width: "64px" }}
        />
        <span
          onClick={handleTitleClick}
          className="hover:text-primary cursor-pointer"
        >
          {rowData.title}
        </span>
      </Fragment>
    );
  };

  return (
    <div>
    <Toast ref={toast} position="bottom-right" />

      <DataTable
        value={allProducts}
        rows={5}
        size="small"
        dataKey="_id"
        filters={filter}
        filterDisplay="menu"
        globalFilterFields={["title"]}
        header={header}
        paginator
        paginatorTemplate=" CurrentPageReport PrevPageLink  NextPageLink "
        currentPageReportTemplate=" Showing {first} to {last} of {totalRecords} results"
        className="custom-paginator"
        pt={dataTabelStyle}
      >
        <Column
          field="title"
          header="Product"
          style={{ minWidth: "12rem" }}
          body={ProductBodyTemplate}
          sortable
        />
        <Column
          field="quantity"
          header="Inventory"
          style={{ minWidth: "12rem" }}
          sortable
        />
        <Column
          field="price"
          header="Price"
          body={priceBodyTemplate}
          style={{ minWidth: "12rem" }}
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

export default ProductDataTabel;

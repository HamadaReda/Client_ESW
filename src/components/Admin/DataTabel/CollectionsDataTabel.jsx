import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // استيراد axios

// import prime react icon and components
import "primeicons/primeicons.css";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Toast } from "primereact/toast";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";

// import Custome style
import { dataTabelStyle } from "../../../layout/dataTabelStyle";
import { inputTextStyle } from "../../../layout/inputTextStyle";
import { Button } from "primereact/button";
import { BASE_URL } from "../../../constants";

const CollectionsDataTabel = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate(); 
  const toast = useRef(null);

  // for filtering data on table
  const [filter, setFilter] = useState({
    title: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  // Function to fetch categories data
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/categories`);
      const fetchedCategories = response.data.data.categories;
      setCategories(fetchedCategories); 
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Call fetchCategories on component load
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCollection = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/categories/${id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json', 
        },
      });

      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Collection deleted successfully",
          life: 2000,
        });

        // Fetch the updated categories after deletion
        fetchCategories();

      } else {
        throw new Error('Failed to delete the Collection');
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || 'An error occurred while deleting the Collection.',
        life: 2000,
      });
    }
  };

  const confirmDeleteCollection = (event, id) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Are you sure you want to delete this Collection?",
      icon: "pi pi-exclamation-triangle",
      accept: () => handleDeleteCollection(id),
      reject: () =>
        toast.current.show({
          severity: "warn",
          summary: "Canceled",
          detail: "Collection deletion was canceled",
          life: 2000,
        }),
    });
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filter = { ...filter };

    _filter["title"].value = value;

    setFilter(_filter);
    setGlobalFilterValue(value);
  };

  // table header section
  const header = () => {
    return (
      <div className="flex flex-col justify-content-end">
        <IconField iconPosition="left" className="relative">
          <InputIcon className="pi pi-search absolute top-4 mt-0 left-3" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search by Title"
            className="pl-10"
            pt={inputTextStyle}
          />
        </IconField>
      </div>
    );
  };

  // useEffect to change content for paginator next and prev buttons
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
        onClick={() => navigate(`/admin/products/update/${rowData._id}`)}
      />
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        aria-label="Delete order"
        onClick={(e) => confirmDeleteCollection(e, rowData._id)}
      />
    </>
  );


  const cllectionBodyTemplate = (rowData) => {
    return (
      <Fragment>
        <img
          src={`${rowData.image.url}`}
          alt={rowData.title}
          className="h-12.5 w-15 rounded-md inline-block mr-5"
          style={{ width: "64px" }}
        />
        <Link
          to={`/admin/collections/${rowData._id}`}
          className="hover:text-primary"
        >
          {rowData.title}
        </Link>
      </Fragment>
    );
  };

  return (
    <div>
      <Toast ref={toast} position="bottom-left" />

      <DataTable
        value={categories}
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
        loading={loading}
      >
        <Column
          field="title"
          header="Collection"
          style={{ minWidth: "12rem" }}
          body={cllectionBodyTemplate}
          sortable
        />
        <Column
          field="description"
          header="Description"
          style={{ minWidth: "12rem" }}
          sortable
          body={(rowData) => (
            <span
              className="truncate overflow-hidden w-full  inline-block"
              dangerouslySetInnerHTML={{
                __html: rowData.description,
              }}
            />
          )}
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

export default CollectionsDataTabel;

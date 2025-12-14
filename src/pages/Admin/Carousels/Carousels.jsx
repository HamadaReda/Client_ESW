import React, { Fragment, useEffect, useState, useRef } from "react";
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
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast"; // Import the Toast component
import { BASE_URL } from "../../../constants";

export const Carousels = () => {
  const [carousels, setCarousels] = useState([]);
  const [filter, setFilter] = useState({
    "carousel.title": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const navigate = useNavigate();
  const toast = useRef(null); // Create a ref for the toast

  useEffect(() => {
    const fetchCarousels = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/carousels`, {
          withCredentials: true,
        });
        if (response.data.status === "success") {
          const allCarousels = response.data.data.carousels.map(carousel => ({
            id: carousel._id,
            title: carousel.title,
            description: carousel.description,
            image: carousel.image.url,
            buttonText: carousel.buttonText,
            category: carousel.category.title,
          }));
          setCarousels(allCarousels);
        }
      } catch (error) {
        console.error("Error fetching carousel data:", error);
      }
    };

    fetchCarousels();
  }, []);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filter = { ...filter };

    _filter["carousel.title"].value = value;
    setFilter(_filter);
    setGlobalFilterValue(value);
  };

  const deleteCarousel = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/carousels/${id}`, {
        withCredentials: true,
      });
      if (response.data.status === "success") {
        setCarousels(prevCarousels => prevCarousels.filter(carousel => carousel.id !== id));
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Carousel deleted successfully!', life: 3000 });
      }
    } catch (error) {
      console.error("Error deleting carousel:", error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Could not delete carousel!', life: 3000 });
    }
  };

  const confirmDelete = (event, id) => {
    confirmPopup({
      target: event.currentTarget,
      message: 'Are you sure you want to delete this carousel?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deleteCarousel(id),
    });
  };

  const header = () => {
    return (
      <div className="flex flex-col justify-content-end">
        <IconField iconPosition="left" className="relative">
          <InputIcon className="pi pi-search" />
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

  const carouselTemplate = (rowData) => {
    return (
      <div className="flex items-center space-x-2">
        <img
          src={rowData.image}
          alt={rowData.title}
          className="w-10 h-10 rounded border-2 border-gray-300 dark:border-gray-600"
        />
        <Link
          to={`/admin/carousels/${rowData.id}`}
          className="text-black dark:text-white font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
        >
          {rowData.title}
        </Link>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => (
    <>
      <Button
        icon="pi pi-pencil"
        rounded
        outlined
        className="mr-2"
        aria-label="Edit order"
        onClick={() => navigate(`/admin/carousels/update/${rowData.id}`)}
      />
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        aria-label="Delete order"
        onClick={(e) => confirmDelete(e, rowData.id)}
      />
    </>
  );

  return (
    <div>
      <Fragment>
        <Toast ref={toast}  position="bottom-left"></Toast>
        <div>
          <DataTable
            value={carousels}
            rows={5}
            size="small"
            dataKey="id"
            filters={filter}
            filterDisplay="menu"
            globalFilterFields={["carousel.title"]}
            header={header}
            paginator
            paginatorTemplate=" CurrentPageReport PrevPageLink NextPageLink "
            currentPageReportTemplate=" Showing {first} to {last} of {totalRecords} results"
            className="custom-paginator"
            pt={dataTabelStyle}
          >
            <Column field="title" header="Title" body={carouselTemplate} />
            <Column field="description" header="Description" body={(rowData) => (
              <span
                className="truncate overflow-hidden w-full  inline-block"
                dangerouslySetInnerHTML={{
                  __html: rowData.description,
                }}
              />
            )} />
            <Column field="category" header="Category" />
            <Column
              body={actionBodyTemplate}
              header="Actions"
              style={{ minWidth: "12rem" }}
            />
          </DataTable>
        </div>
      </Fragment>
      <ConfirmPopup />
    </div>
  );
};

export default Carousels;

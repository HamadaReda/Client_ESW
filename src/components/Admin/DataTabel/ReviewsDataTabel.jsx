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
import { Toast } from "primereact/toast";
import { Rating } from "primereact/rating"; // Import Rating for stars
import { BASE_URL } from "../../../constants";

export const ReviewsDataTabel = () => {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState({
    "user.firstName": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const navigate = useNavigate();
  const toast = useRef(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/reviews`, {
          withCredentials: true,
        });
        if (response.data.status === "success") {
          const allReviews = response.data.data.map(review => ({
            id: review._id,
            user: review.user,
            product: review.product,
            rating: review.rating,
            comment: review.comment,
            createdAt: new Date(review.createdAt).toLocaleDateString(),
          }));
          setReviews(allReviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Could not fetch reviews!', life: 3000 });
      }
    };

    fetchReviews();
  }, []);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filter = { ...filter };

    _filter["user.firstName"].value = value;
    setFilter(_filter);
    setGlobalFilterValue(value);
  };

  useEffect(() => {
    document.querySelector(".nextPageButton").innerHTML =
      "Next <i class='pi pi-angle-double-right ml-1'></i>";
    document.querySelector(".prevPageButton").innerHTML =
      " <i class='pi pi-angle-double-left mr-1'></i> Previous";
  }, []);

  const deleteReview = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/reviews/${id}`, {
        withCredentials: true,
      });
      if (response.data.status === "success") {
        setReviews(prevReviews => prevReviews.filter(review => review.id !== id));
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Review deleted successfully!', life: 3000 });
      } else {
        // Handle case where delete was not successful
        toast.current.show({ severity: 'warn', summary: 'Warning', detail: response.data.message || 'Delete unsuccessful', life: 3000 });
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      const errorMessage = error.response?.data?.message || 'Could not delete review!';
      toast.current.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
    }
  };

  const confirmDelete = (event, id) => {
    confirmPopup({
      target: event.currentTarget,
      message: 'Are you sure you want to delete this review?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deleteReview(id),
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
            placeholder="Search by User"
            className="pl-10"
            pt={inputTextStyle}
          />
        </IconField>
      </div>
    );
  };

  const userTemplate = (rowData) => {
    return (
      <div className="flex items-center space-x-2">
        <Link to={`/admin/customers/${rowData.user._id}`} className="text-black dark:text-white font-semibold">
          {`${rowData.user.firstName} ${rowData.user.lastName}`}
        </Link>
      </div>
    );
  };

  const commentTemplate = (rowData) => {
    return (
      <Link to={`/admin/reviews/${rowData.id}`} className="text-blue-600 hover:underline truncate">
        {rowData.comment}
      </Link>
    );
  };

  const ratingTemplate = (rowData) => {
    return <Rating value={rowData.rating} readOnly stars={5} cancel={false} />;
  };

  const actionBodyTemplate = (rowData) => (
    <>
      <Button
        icon="pi pi-pencil"
        rounded
        outlined
        className="mr-2"
        aria-label="Edit review"
        onClick={() => navigate(`/admin/reviews/${rowData.id}`)}
      />
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        aria-label="Delete review"
        onClick={(e) => confirmDelete(e, rowData.id)}
      />
    </>
  );

  return (
    <div>
      <Fragment>
        <Toast ref={toast} position="bottom-left"></Toast>
        <div>
          <DataTable
            value={reviews}
            rows={5}
            size="small"
            dataKey="id"
            filters={filter}
            filterDisplay="menu"
            globalFilterFields={["user.firstName"]}
            header={header}
            paginator
            paginatorTemplate="CurrentPageReport PrevPageLink NextPageLink"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} reviews"
            className="custom-paginator"
            pt={dataTabelStyle}
          >
            <Column field="user" header="User" body={userTemplate} />
            <Column field="comment" header="Comment" body={commentTemplate} />
            <Column field="rating" header="Rating" body={ratingTemplate} />
            <Column field="createdAt" header="Created At" />
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

export default ReviewsDataTabel;

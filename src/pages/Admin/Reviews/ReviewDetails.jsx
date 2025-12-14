import React, { useState, useEffect, Fragment, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Rating } from "primereact/rating"; // For displaying rating stars
import { Button } from "primereact/button"; // For buttons
import { Toast } from "primereact/toast"; // For displaying toast messages
import GoBackButton from "../../../components/Admin/Buttons/GoBackButton";
import { BASE_URL } from "../../../constants";

const ReviewDetails = () => {
    const { id } = useParams();
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [product, setProduct] = useState(null);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const navigate = useNavigate();
    const toast = useRef(null);

    useEffect(() => {
        const fetchReviewDetails = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/reviews/${id}`,
                    { withCredentials: true }
                );

                if (response.data.status === "success") {
                    const fetchedReview = response.data.data;

                    if (fetchedReview) {
                        setReview({
                            id: fetchedReview._id,
                            user: {
                                id: fetchedReview.user?._id,
                                name: `${fetchedReview.user?.firstName || 'Unknown'} ${fetchedReview.user?.lastName || ''}`,
                            },
                            product: fetchedReview.product || 'Unknown Product',
                            rating: fetchedReview.rating || 0,
                            comment: fetchedReview.comment || 'No comments provided.',
                            createdAt: new Date(fetchedReview.createdAt).toLocaleDateString(),
                        });

                        setRating(fetchedReview.rating || 0);
                        setComment(fetchedReview.comment || '');

                        const productResponse = await axios.get(
                            `${BASE_URL}/products/${fetchedReview.product}`,
                            { withCredentials: true }
                        );

                        if (productResponse.data.status === "success") {
                            setProduct(productResponse.data.data);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching review details:", error.response ? error.response.data : error.message);
                setError("Error fetching review details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchReviewDetails();
    }, [id]);

    const handleEditReview = async () => {
        try {
            const response = await axios.patch(
                `${BASE_URL}/reviews/${id}`,
                { comment, rating },
                { withCredentials: true }
            );

            if (response.data.status === "success") {
                setRating(rating);
                setComment(comment);
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Review updated successfully!",
                });

                // Navigate after a 3-second delay
                setTimeout(() => {
                    navigate('/admin/reviews'); // Change this path to your actual reviews list route
                }, 3000);
            }
        } catch (error) {
            console.error("Error updating review:", error.response ? error.response.data : error.message);
            toast.current.show({ severity: "error", summary: "Error", detail: "Failed to update review. Please try again." });
        }
    };

    if (loading) {
        return <p>Loading review details...</p>;
    }

    if (error) {
        return (
            <Toast ref={toast} severity="error" summary="Error" detail={error} />
        );
    }

    if (!review) {
        return <p>No review found.</p>;
    }

    return (
        <Fragment>
            <div className="flex flex-nowrap justify-between mb-5">
                <div>
                    <GoBackButton />
                    <h1 className="inline-block ml-4 text-3xl dark:text-white">Review Details</h1>
                </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            User:
                        </h3>
                        <Link
                            to={`/admin/users/${review.user.id}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            {review.user.name}
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            Product:
                        </h3>
                        <Link
                            to={`/admin/products/${review.product}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            {product ? product.title : 'Loading...'}
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            Rating:
                        </h3>
                        <Rating 
                            value={rating} 
                            onChange={(e) => setRating(e.value)} 
                            stars={5} 
                            cancel={false} 
                            className="text-yellow-500 dark:text-yellow-400" 
                        />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            Comment:
                        </h3>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            rows={4}
                        />
                        <Button label="Update Review" onClick={handleEditReview} className="mt-2" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            Created At:
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">{review.createdAt}</p>
                    </div>
                </div>
            </div>
            <Toast ref={toast} position="bottom-left"/>
        </Fragment>
    );
};

export default ReviewDetails;

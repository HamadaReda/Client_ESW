import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { BASE_URL } from '../../../constants';

const Tailwind = {
  form: {
    fieldWrapper: 'mb-4',
    label: 'block text-sm font-medium text-gray-700 mb-1 dark:text-white/80',
    textarea: 'block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-900 dark:text-white/80 dark:border-gray-600'
  },
  footer: {
    buttonsContainer: 'flex justify-between items-center',
    button: 'p-button'
  }
};

const ReviewForm = ({ productId, onClose }) => {
  const [rating, setRating] = useState(null);
  const [reviewComment, setReviewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [reviewId , setReviewId] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/reviews/product/${productId}/my-review`, { withCredentials: true });
        const reviews = response.data.data;
        
        if (reviews.length > 0) {
          const review = reviews[0];
          setReviewComment(review.comment);
          setRating(review.rating);
          setIsEditing(true);
          setReviewId(review._id);
        } else {
          setIsEditing(false);
        }
      } catch (error) {
        console.error('Error fetching existing review:', error);
        if (error.response?.status === 404) {
          setIsEditing(false);
        } else {
          setError('Failed to load the review.');
        }
      }
    };

    fetchReview();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const reviewData = { rating, comment: reviewComment };

    try {
      let response;
      if (isEditing) {
        response = await axios.patch(
          `${BASE_URL}/reviews/${reviewId}`,
          reviewData,
          { withCredentials: true }
        );
      } else {
        response = await axios.post(
          `${BASE_URL}/reviews/product/${productId}`,
          reviewData,
          { withCredentials: true }
        );
      }

      if (response.data.status === 'success') {
        toast.current.show({ severity: 'success', summary: 'Success', detail: isEditing ? 'Review updated successfully!' : 'Review added successfully!', life: 3000 });
        resetForm();
        onClose();
      } else {
        setError('Failed to process your review. Please try again.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Error submitting review:', errorMessage);
      setError(errorMessage);
      toast.current.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`${BASE_URL}/reviews/${reviewId}`, { withCredentials: true });
      
      if (response.data.status === 'success') {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Review deleted successfully!', life: 3000 });
        resetForm();
        onClose();
      } else {
        setError('Failed to delete the review. Please try again.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Error deleting review:', errorMessage);
      setError(errorMessage);
      toast.current.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setReviewComment('');
    setRating(null);
    setIsEditing(false);
  };

  return (
    <>
      <Toast ref={toast} position="bottom-left" />
      <Dialog
        header={isEditing ? "Edit Your Review" : "Write a Review"}
        visible={true}
        onHide={onClose}
        style={{ width: '50vw' }}
      >
        <form onSubmit={handleSubmit}>
          <div className={Tailwind.form.fieldWrapper}>
            <label htmlFor="rating" className={Tailwind.form.label}>Rating</label>
            <Rating
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.value)}
              stars={5}
              cancel={false}
              required
            />
          </div>

          <div className={Tailwind.form.fieldWrapper}>
            <label htmlFor="reviewComment" className={Tailwind.form.label}>Share your thoughts</label>
            <textarea
              id="reviewComment"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className={Tailwind.form.textarea}
              rows={5}
              placeholder="Your thoughts on the product"
              required
            />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div className={Tailwind.footer.buttonsContainer}>
            <Button label="Cancel" className="p-button-secondary" onClick={onClose} />
            <Button
              label={loading ? (isEditing ? "Updating..." : "Saving...") : (isEditing ? "Update" : "Save")}
              className="p-button-success"
              type="submit"
              disabled={loading || rating === null || reviewComment === ''} 
            />
            {isEditing && (
              <Button
                label={loading ? "Deleting..." : "Delete"}
                className="p-button-danger"
                onClick={handleDelete}
                disabled={loading} 
              />
            )}
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default ReviewForm;

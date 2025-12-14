import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../constants';

const ProductTap = ({ description, id }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch reviews when the reviews tab is clicked
  useEffect(() => {
    if (activeTab === 'reviews') {
      setLoading(true);


      // Make the request with the Authorization header
      axios.get(`${BASE_URL}/reviews/product/${id}`, {
         withCredentials: true 
        })
        .then((response) => {
          if (response.data.status === "success") {
            setReviews(response.data.data); // Update to use the correct structure of the response
          } else {
            setError('Failed to fetch reviews.');
          }
          setLoading(false);
        })
        .catch((error) => {
          setError('Failed to fetch reviews.');
          setLoading(false);
        });
    }
  }, [activeTab, id]);

  // دالة لعرض النجوم بناءً على التقييم
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-blue-500' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return <div>{stars}</div>;
  };

  return (
    <div className="mt-6 p-10">
      <div className="flex border-b">
        <button
          className={`py-2 px-4 text-xl ${
            activeTab === 'description'
              ? 'border-b-2 border-blue-600 font-bold text-blue-600'
              : 'text-gray-600 dark:text-white'
          }`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </button>
        <button
          className={`py-2 px-4 text-xl ${
            activeTab === 'reviews'
              ? 'border-b-2 border-blue-600 font-bold text-blue-600'
              : 'text-gray-600 dark:text-white'
          }`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
      </div>

      {activeTab === 'description' && (
        <div className="mt-4 dark:text-white">
          <p
            className="text-xl dark:text-white"
            dangerouslySetInnerHTML={{ __html: description }}
          ></p>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="mt-4 text-xl">
          {loading ? (
            <p>Loading reviews...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="border-b pb-2 mb-2 dark:text-white">
                <h4 className="font-semibold dark:text-white">
                  {review.user.firstName} {review.user.lastName}
                </h4>
                <p>{review.comment}</p>
                <p>{renderStars(review.rating)}</p> {/* عرض النجوم هنا */}
              </div>
            ))
          ) : (
            <p className="dark:text-white">No reviews available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductTap;













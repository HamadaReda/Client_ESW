import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import ReviewForm from '../../components/Client/ReviewForm/ReviewForm'; // Import the ReviewForm component
import { BASE_URL } from '../../constants';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false); // State for modal visibility
  const [selectedProductId, setSelectedProductId] = useState(null); // State for selected productId
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/my-orders`, {
        withCredentials: true,
      });
      console.log('API Response:', response.data);

      if (response.data && response.data.status === 'success' && Array.isArray(response.data.data)) {
        const validOrders = response.data.data.filter(order =>
          order && 
          order._id && 
          Array.isArray(order.orderItems) && 
          order.orderItems.length > 0
        );
        setOrders(validOrders);
      } else {
        throw new Error('Unexpected response structure');
      }

      setLoading(false);
          } catch (error) {
            if (error.response) {
              console.error('Response error:', error.response);
            } else if (error.request) {
              console.error('Request error:', error.request);
              setError('No response received from the server.');
            } else {
              console.error('General error:', error.message);
              setError('Error occurred while fetching orders.');
            }
      
            setLoading(false);
          }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to open the ReviewForm modal
  const handleWriteReview = (productId) => {
    setSelectedProductId(productId); // Set the selected productId
    setIsReviewFormVisible(true); // Show the modal
  };

  // Function to close the ReviewForm modal
  const handleCloseReviewForm = () => {
    setIsReviewFormVisible(false);
    setSelectedProductId(null); // Clear selected productId when closing the form
  };
// Handle loading and error states
  if (loading) return <div className="text-center">Loading orders...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;
  const getStatusColor = (status) => {

        switch (status) {
          case 'Paid':
            return 'bg-green-500 text-white';
          case 'Unpaid':
            return 'bg-yellow-500 text-white';
          case 'Cancelled':
            return 'bg-red-500 text-white';
          default:
            return 'bg-gray-300 text-black';
        }
      };
    
      const getShippingStatusColor = (status) => {
        switch (status) {
          case 'Shipped':
            return 'bg-blue-500 text-white';
          case 'Pending':
            return 'bg-purple-500 text-white';
          case 'Completed':
            return 'bg-green-500 text-white';
          case 'Cancelled':
            return 'bg-red-500 text-white';
          default:
            return 'bg-gray-300 text-black';
        }
      };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">Order History</h1>
        <p className="text-gray-500 dark:text-gray-300 mb-8">
          Check the status of recent orders, manage returns, and discover similar products.
        </p>
        
        {orders.length === 0 ? (
          <div className="text-center text-lg text-gray-700 dark:text-gray-300">
            <p>No orders found. Please check back later.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order._id} className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-medium">Order number</p>
                    <p className="text-lg text-gray-800 dark:text-gray-200">{order._id}</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="font-medium">Date placed</p>
                    <p className="text-gray-800 dark:text-gray-200">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-900 dark:text-white">Total:</p>
                    <div className="flex items-center space-x-4">
                      <p className="font-medium text-gray-500 line-through hidden md:block">
                        {`EGP ${order.totalPrice.toFixed(2)}`}
                      </p>
                      <p className="font-bold text-lg text-gray-900 dark:text-white">
                        {`EGP ${order.totalPriceAfterDiscount.toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                  <button className="hidden md:block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={() => navigate(`/my-orders/${order._id}`)}>
                    View Order
                  </button>
                  <button className="md:hidden text-blue-500 hover:text-blue-600" onClick={() => navigate(`/my-orders/${order._id}`)}>
                    <FaEye />
                  </button>
                </div>

                <div className="flex gap-4 justify-start mb-4">
                  <div className={`py-1 px-2 rounded-lg text-center text-sm font-semibold shadow ${getStatusColor(order.payment_status)}`}>
                    {order.payment_status}
                  </div>
                  <div className={`py-1 px-2 rounded-lg text-center text-sm font-semibold shadow ${getShippingStatusColor(order.status)}`}>
                    {order.status || 'Unknown'}
                  </div>
                </div>
                
                {order.orderItems.map((item, index) => (
                  item.product ? (
                    <div key={index} className="flex gap-4 p-4 border rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                      {item.product.gallery && Array.isArray(item.product.gallery) && item.product.gallery.length > 0 ? (
                        <img 
                          src={item.product.gallery[0].url} 
                          alt={item.product.title} 
                          className="w-24 h-24 object-cover rounded" 
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-300 rounded" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.product.title || 'Unknown Product'} 
                          <span className="text-gray-500"> (x{item.quantity})</span>
                        </p>
                        <div className="flex items-center">
                          <p className="font-medium text-gray-500 line-through mr-2">
                            EGP {item.subTotalPrice ? item.subTotalPrice.toFixed(2) : '0.00'}
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            EGP {item.subTotalPriceAfterDiscount ? item.subTotalPriceAfterDiscount.toFixed(2) : '0.00'}
                          </p>
                        </div>
                        <div className="flex gap-4 mt-2">
                          <button className="text-blue-500 hover:underline" onClick={() => navigate(`/product/${item.product._id}`)}>
                            View product
                          </button>
                          <button className="text-blue-500 hover:underline" onClick={() => handleWriteReview(item.product._id)}>
                            Write a review
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Render the ReviewForm only when selectedProductId is not null */}
      {isReviewFormVisible && selectedProductId && (
        <ReviewForm productId={selectedProductId} onClose={handleCloseReviewForm} />
      )}
    </div>
  );
};

export default OrderHistory;

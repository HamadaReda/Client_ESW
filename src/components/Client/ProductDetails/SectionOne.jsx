import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import ControlledDemo from './ControlledDemo';
import styled from 'styled-components';
import ProductPrice from './ProductPrice';
import ShoppingCartSidebar from '../SideBar/ShoppingCartSidebar';
import axios from 'axios';
import ProductTap from './ProductTap';
import { BASE_URL } from '../../../constants';

const Paragraph = styled.p`
  font-size: 1.4rem;
  line-height: 1.7;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(5px);
`;

const SectionOne = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isSidebarOpen, setSidebarOpen] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products/${id}`);
        if (response.status === 200) {
          setProduct(response.data.data);
          // Check localStorage for the product
          const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
          const existingItem = cartItems.find(item => item._id === response.data.data._id);
          if (existingItem) {
            setQuantity(existingItem.quantity); // Set quantity from localStorage
          }
        }
      } catch (error) {
        setError("Error fetching product data");
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const handleAddToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const newItem = { ...product, quantity }; // Add quantity to the product
    const existingItemIndex = cartItems.findIndex(item => item._id === product._id);
    
    if (existingItemIndex !== -1) {
      // If the item already exists, update the quantity
      cartItems[existingItemIndex].quantity = quantity; // Update quantity from input
    } else {
      // Otherwise, add the new item
      cartItems.push(newItem);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Save to localStorage
    setSidebarOpen(true); // Open sidebar
  };

  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(1, Number(e.target.value)); // Ensure quantity is at least 1
    setQuantity(newQuantity);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>Product not found</p>;
  }
  
  return (
    <div className="relative">
      {isSidebarOpen && <Overlay onClick={() => setSidebarOpen(false)} />}
      <div className={isSidebarOpen ? 'blur-lg' : ''}>
        <div className="container mx-auto p-4">
          <div className="flex flex-col md:flex-row items-start">
            <div className="w-full md:w-1/2 mb-4 md:mb-0 dark:text-white">
              <ControlledDemo />
            </div>
            <div className="w-full md:w-1/2 md:pl-8">
              <h1 className="text-5xl font-bold mb-4 pl-4 pt-12 pb-5 dark:text-white">{product.title}</h1>
              <ProductPrice product={product} />
              <div className="flex items-center mb-4 pb-5 pl-4 dark:text-white">
                {/* Adjust Rating to show fractional stars */}
                <Rating 
                  value={product.rating} 
                  readOnly 
                  stars={5} 
                  cancel={false} 
                  className="text-yellow-500" 
                />
                <span className="ml-5 text-gray-600 dark:text-white">
                  ({product.numReviews} Reviews)
                </span>
                {/* Show the exact rating value with two decimal places */}
                <span className="ml-3 text-gray-500 dark:text-gray-300">
                  {product.rating.toFixed(2)}
                </span>
              </div>
              <div className="mb-6 pl-4 dark:text-white">
                <Paragraph>{product.excerpt}</Paragraph>
              </div>
              <div className="flex items-center space-x-4 mt-6 pl-4 dark:text-white">
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange} // Update quantity on change
                  min="1"
                  className="w-20 p-3 border border-gray-900 rounded-md text-center text-gray-900" 
                />
                <Button
                  label="Add to Cart"
                  className="p-button-success p-4 text-lg dark:text-white"
                  style={{ width: '400px' }}
                  onClick={handleAddToCart} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ShoppingCartSidebar 
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen} 
      />
      {/* Product Tabs */}
      <ProductTap
         description={product.description}
         id ={id}
      />
    </div>
  );
};

export default SectionOne;


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BASE_URL } from '../../../constants';

const ImageSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch(`${BASE_URL}/carousels`);
        const data = await response.json();

        if (data.status === 'success') {
          setSlides(data.data.carousels);
        }
      } catch (error) {
        console.error('Error fetching slides:', error);
      }
    };

    fetchSlides();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [slides]);

  return (
    <div className="slider-container">
      {slides.map((slide, index) => (
        <motion.div
          key={slide._id}
          className={`slide ${index === currentIndex ? 'active' : ''}`}
          initial={{ opacity: 0, x: 100 }}
          animate={{
            opacity: index === currentIndex ? 1 : 0,
            x: index === currentIndex ? 0 : (index < currentIndex ? -100 : 100),
          }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          style={{
            display: index === currentIndex ? 'block' : 'none',
            position: 'relative',
          }}
        >
          <img
            src={slide.image.url}
            alt={`slide-${index}`}
            className="slide-image"
          />
          <div className="overlay" />
          <div className="slide-content">
            <h1   className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>{slide.title}</h1>
            <h2 dangerouslySetInnerHTML={{
              __html: slide.description,
            }}></h2>
            <Link
  to={`/collections/${slide.category._id}`}  // Dynamic category link
  className="mb-20 block w-full rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-slate-900 hover:bg-slate-100 sm:w-auto"
>
  {slide.buttonText}
</Link>
          </div>
        </motion.div>
      ))}
      <div className="bullet-container">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`bullet ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
      <style>
        {`
          .slider-container {
            position: relative;
            width: 100%;
            max-width: 100vw;
            margin: 0 auto;
            overflow: hidden;
          }

          .slide-image {
            width: 100%;
            height: 650px; /* Set to auto to maintain aspect ratio */
            object-fit: cover; /* Cover to maintain image aspect ratio */
          }

          .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
            z-index: 1;
          }

          .slide-content {
            position: absolute;
            bottom: 5%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #fff;
            text-align: center;
            width: 100%;
            max-width: 600px;
            z-index: 2;
          }

          .slide-content h1 {
            font-size: 2.2rem;
            font-weight: bold;
          }

          .slide-content h2 {
            font-size: 1.7rem;
            text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.5);
            margin-bottom: 20px;
          }

          .button {
            display: block;
            padding: 15px 100px;
            font-size: 1.7rem;
            color: black;
            background-color: white;
            border-radius: 10px;
            text-align: center;
            text-decoration: none;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          .button:hover {
            background-color: lightgray;
          }

          .bullet-container {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 2;
          }

          .bullet {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid lightgray;
            background-color: transparent;
            cursor: pointer;
          }

          .bullet.active {
            background-color: white;
          }

          @media (max-width: 768px) {
            .slide-content h1 {
              font-size: 1.5rem;
            }
            .slide-content h2 {
              font-size: 1.2rem;
            }
            .button {
              font-size: 1.2rem;
              padding: 10px 40px;
            }
          }

          @media (max-width: 480px) {
            .slide-content h1 {
              font-size: 1.2rem;
            }
            .slide-content h2 {
              font-size: 1rem;
            }
            .button {
              font-size: 1rem;
              padding: 8px 30px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ImageSlider;

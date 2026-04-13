import React, { useState, useEffect } from "react";

// --- Helper Components ---
const ChevronLeft = () => (
  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
  </svg>
);

const ChevronRight = () => (
  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
  </svg>
);

// --- Main Hero Component (Image Carousel ONLY) ---
export default function Hero({ product }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = product?.imageUrls || [];

  useEffect(() => {
    setCurrentIndex(0);
    // Remove scroll-to-top from here, we'll keep it in Product_page.jsx
  }, [product]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    // This is now just the carousel card for the left-hand column
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {images.length > 0 ? (
        <div className="relative w-full h-64 md:h-[500px] lg:h-[600px]">
          <img
            src={images[currentIndex]}
            alt={`${product.title} - image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white shadow-md transition"
                aria-label="Previous image"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white shadow-md transition"
                aria-label="Next image"
              >
                <ChevronRight />
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="w-full h-64 md:h-[500px] lg:h-[600px] bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">No image available</p>
        </div>
      )}
    </div>
  );
}
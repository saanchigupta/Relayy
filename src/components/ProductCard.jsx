import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden 
                flex flex-col h-full
                hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      {/* CRITICAL FIX 1: Adjust image height. 
        Use h-48 on mobile (default) and scale up to h-56 on medium screens (md:h-56)
      */}
      <div 
        className="relative w-full h-48 md:h-56 cursor-pointer" 
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <img
          src={product.imageUrls?.[0] || product.image || "/placeholder.jpg"}
          alt={product.title || "Product"}
          className="object-cover w-full h-full"
        />
      </div>

      {/* CRITICAL FIX 2: Adjust content padding. 
        Use p-3 on mobile (default) and scale up to p-4 on medium screens (md:p-4)
      */}
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        
        {/* CRITICAL FIX 3: Adjust Title size. 
          Use text-base on mobile and text-lg on medium screens (md:text-lg)
        */}
        <h3 
          className="text-base md:text-lg font-semibold text-gray-900 line-clamp-1 mb-1 md:mb-2 cursor-pointer hover:text-emerald-700"
          onClick={() => navigate(`/product/${product._id}`)}
        >
          {product.title}
        </h3>
        
        {/* CRITICAL FIX 4: Adjust Price size. 
          Use text-xl on mobile and text-2xl on medium screens (md:text-2xl)
        */}
        <p className="text-xl md:text-2xl font-bold text-emerald-700 mb-1">
          ₹{product.price}
        </p>
        
        {/* Smaller text for secondary info (Hostel) */}
        <p className="text-xs md:text-sm text-gray-800 mb-3 md:mb-4">
          {product.hostel}
        </p>

        <div className="mt-auto">
          {/* CRITICAL FIX 5: Adjust Button padding/size. 
            Use py-1.5 and text-sm on mobile
          */}
          <button
            onClick={() => navigate(`/product/${product._id}`)}
            className="w-full bg-emerald-100 text-emerald-800 font-semibold py-1.5 md:py-2 text-sm 
                        rounded-md hover:bg-emerald-200 transition-colors duration-200"
          >
            View Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
import React from 'react';
import ProductCard from '../components/ProductCard'; 

const RecentlyListed = ({ products = [], loading = false }) => {
  return (
    <div className="py-12 px-4 bg-emerald-50">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Recently Listed Items
          </h1>
          <a 
            href="/all-products" 
            className="text-emerald-700 font-semibold text-sm md:text-base hover:underline"
          >
            See All
          </a>
        </div>
        
        {/* *** CRITICAL CHANGE HERE: grid-cols-2 on the smallest screens. ***
          sm:grid-cols-2 is redundant now, but kept for clarity/legacy.
          The change to 'grid-cols-2' is what fixes the stacking issue and 
          shows two columns on mobile phones.
        */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          !loading && (
            <p className="text-gray-500 text-base md:text-lg text-center mt-12">
              No listings found for your campus yet.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default RecentlyListed;
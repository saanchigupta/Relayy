import React from 'react';

const Hero = ({ title, subtitle }) => {
  return (
    // Using emerald-600 and emerald-700 for a strong accent gradient
    <div className="font-poppins bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-3">
          {title || 'Page Title'}
        </h1>
        {subtitle && (
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default Hero;


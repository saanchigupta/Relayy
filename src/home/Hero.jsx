import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';

const Hero = ({ user }) => { 
  const [hostel, setHostel] = useState('');

  let collegeName = "Your Campus"; 
  if (user?.email) {
    try {
      const emailDomain = user.email.split('@')[1]; 
      const collegePart = emailDomain.split('.')[0]; 
      collegeName = collegePart.charAt(0).toUpperCase() + collegePart.slice(1);
    } catch (e) {
      console.error("Could not parse college from email:", e);
    }
  }

  return (
    <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white 
                   py-24 md:py-32 text-center shadow-lg 
                   rounded-3xl m-4">
      
      {collegeName !== "Your Campus" && (
        <h2 className="text-3xl font-bold text-white mb-6 tracking-wide">
          Welcome to {collegeName}
        </h2>
      )}
      
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        The Campus Marketplace for Awesome Finds
      </h1>
    </div>
  );
};

export default Hero;
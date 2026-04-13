import React from 'react';
import './Landingpage.css';
import { useNavigate } from 'react-router'; // Corrected import

import HeroSection from './Hero';
import JourneySection from './Journey';
import ThreadSection from './Thread';
import CampusSection from './Campus';

const RelayyLandingPage = () => {
  const navigate = useNavigate(); // Keep this if other parts need it, or remove if unused
  return (
    <>
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-hidden">
        {/* --- FIX --- */}
        {/* The redundant Login/Signup buttons that were here have been removed. */}
        {/* They are now correctly handled *inside* the HeroSection component. */}
        {/* --- END FIX --- */}
        {/* --- RESPONSIVE FIX: Replaced two containers with one --- */}
{/* This single container stacks vertically on mobile (flex-col) 
    and becomes a horizontal, space-between bar on larger screens (sm:flex-row) */}
<nav className="fixed top-4 left-4 right-4 z-20 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
  
  {/* Left Group */}
  <div className="flex gap-2 sm:gap-4">
    <button
      onClick={() => navigate('/contact')}
      className="font-body font-medium text-sm sm:text-lg text-emerald-800/80 py-2 px-3 sm:py-3 transition-all duration-300 transform hover:scale-110 hover:text-emerald-900"
    >
      Contact Us
    </button>
    <button
      onClick={() => navigate('/about')}
      className="font-body font-medium text-sm sm:text-lg text-emerald-800/80 py-2 px-3 sm:py-3 transition-all duration-300 transform hover:scale-110 hover:text-emerald-900"
    >
      About Us
    </button>
  </div>

  {/* Right Group */}
  <div className="flex gap-2 sm:gap-4">
    <button
      onClick={() => navigate('/login')}
      className="font-display font-bold text-sm sm:text-lg text-emerald-800 bg-white/70 backdrop-blur-md border border-white/80 rounded-full px-4 py-2 sm:px-8 sm:py-3 shadow-lg shadow-emerald-500/20 hover:bg-white transition-all duration-300 transform hover:scale-105"
    >
      Login
    </button>
    <button
      onClick={() => navigate('/signup')}
      className="font-display font-bold text-sm sm:text-lg text-white bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full px-4 py-2 sm:px-8 sm:py-3 shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-600/60 transition-all duration-300 transform hover:scale-105 hover:from-emerald-600 hover:to-emerald-500"
    >
      Signup
    </button>
  </div>
</nav>
        <HeroSection />
        <JourneySection />
        <ThreadSection />
        <CampusSection />
      </div>
    </>
  );
};

export default RelayyLandingPage;
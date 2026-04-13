import React from 'react';
import './Landingpage.css';
// Import useNavigate to handle clicks
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  // Initialize navigate
  const navigate = useNavigate();

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-emerald-100 p-4 text-center clip-path-swoop">
      

      {/* --- Rest of your Hero Section Code --- */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 via-emerald-100 to-white/50 opacity-90"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-60"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-carbon.png')] opacity-[0.05]"></div>
      <div
        className="absolute -top-1/3 -left-1/4 w-3/5 h-3/5 bg-gradient-to-br from-emerald-400/50 to-emerald-300/50 organic-shape animate-float"
        style={{ animationDelay: '-2s' }}
      ></div>
      <div
        className="absolute -bottom-1/3 -right-1/4 w-3/4 h-3/4 bg-gradient-to-tl from-emerald-500/50 to-emerald-400/50 organic-shape animate-float"
        style={{ animationDelay: '-5s' }}
      ></div>

      <div className="relative z-10 animate-fade-in-up">
        {/* --- RESPONSIVE FIX: Scaled down text for mobile --- */}
        <h1 className="font-display text-6xl sm:text-8xl md:text-9xl font-extrabold uppercase tracking-widest text-gray-900 [text-shadow:_0_8px_20px_rgb(16_185_129_/_0.2)]">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700">
            R
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700">
            E
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800">
            L
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900">
            A
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800">
            Y
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800">
            Y
          </span>
        </h1>
        {/* --- RESPONSIVE FIX: Scaled down text for mobile --- */}
        <p className="font-body mt-4 text-lg sm:text-xl md:text-3xl font-medium text-emerald-800/90 [text-shadow:_0_2px_4px_rgb(255_25f_255_/_80%)]">
          The story of stuff. Relayed.
        </p>
        {/* --- RESPONSIVE FIX: Reduced margin-top on mobile --- */}
        <div className="mt-16 sm:mt-24 flex flex-col items-center gap-3">
          <p className="font-body text-base text-emerald-700/80">
            Scroll to begin the journey
          </p>
          <span className="material-symbols-outlined animate-bounce text-emerald-700/80 text-3xl">
            south
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
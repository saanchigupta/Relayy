import React from 'react';
import './Landingpage.css';
import { useNavigate } from 'react-router-dom';

const CampusSection = () => {
  const navigate = useNavigate();
  return (
    <section className="w-full bg-emerald-100 py-32 px-4 md:px-10 lg:px-20 relative overflow-hidden section-transition clip-path-swoop-inverted">
      {/* ...other divs... */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-100 via-emerald-100/70 to-transparent"></div>

      {/* --- 1. CHANGE THIS LINE --- */}
      <div className="mx-auto max-w-6xl text-center relative z-10 pt-16">
        <h2 className="font-display text-5xl md:text-7xl font-bold text-gray-900 [text-shadow:_0_4px_8px_rgb(209_250_229_/_90%)]">
          Campus Curiosities
        </h2>
        <p className="font-body text-emerald-800/90 mt-6 text-xl md:text-2xl max-w-3xl mx-auto">
          Discover the unexpected treasures and forgotten gems that give our
          campus its unique character. A collage of stories waiting to be told.
        </p>

        {/* --- 2. CHANGE THIS LINE --- */}
        <div className="mt-24 relative grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 h-[800px] group">
          
          {/* --- STEP 2: Removed 'animate-pulse-visual' from this line --- */}
          <div className="absolute inset-0 -top-10 -bottom-10 bg-gradient-to-br from-emerald-300/30 to-emerald-400/30 rounded-full blur-3xl opacity-50"></div>
          
          <div className="flex flex-col gap-4 md:gap-8 pt-12">
            {/* --- STEP 1: Changed 'bg-white/60 backdrop-blur-lg' to 'bg-white/90' --- */}
            <div className="relative aspect-square bg-white/90 border border-emerald-300/70 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center p-4 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3">
              <span className="material-symbols-outlined text-emerald-600 text-6xl md:text-9xl opacity-80 drop-shadow-lg">
                calculate
              </span>
            </div>
            {/* --- STEP 1: Applied here --- */}
            <div className="relative aspect-square bg-white/90 border border-emerald-300/70 rounded-3xl shadow-xl shadow-emerald-500/20 flex items-center justify-center p-4 transition-transform duration-500 group-hover:scale-95 group-hover:rotate-2">
              <span className="material-symbols-outlined text-emerald-600 text-6xl md:text-9xl opacity-80 drop-shadow-lg">
                emoji_objects
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:gap-8">
            {/* --- STEP 1: Applied here --- */}
            <div className="relative aspect-square bg-white/90 border border-emerald-300/70 rounded-3xl shadow-xl shadow-emerald-500/20 flex items-center justify-center p-4 transition-transform duration-500 group-hover:scale-90 group-hover:rotate-6">
              <span className="material-symbols-outlined text-emerald-600 text-6xl md:text-9xl opacity-80 drop-shadow-lg">
                biotech
              </span>
            </div>
            {/* --- STEP 1: Applied here --- */}
            <div className="relative aspect-square bg-white/90 border border-emerald-300/70 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center p-4 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-1">
              <span className="material-symbols-outlined text-emerald-600 text-6xl md:text-9xl opacity-80 drop-shadow-lg">
                stadia_controller
              </span>
            </div>
            {/* --- STEP 1: Applied here --- */}
            <div className="relative aspect-square bg-white/90 border border-emerald-300/70 rounded-3xl shadow-xl shadow-emerald-500/20 flex items-center justify-center p-4 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-4">
              <span className="material-symbols-outlined text-emerald-600 text-6xl md:text-9xl opacity-80 drop-shadow-lg">
                skateboarding
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:gap-8 pt-24">
            {/* --- STEP 1: Applied here --- */}
            <div className="relative aspect-square bg-white/90 border border-emerald-300/70 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center p-4 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2">
              <span className="material-symbols-outlined text-emerald-600 text-6xl md:text-9xl opacity-80 drop-shadow-lg">
                ramen_dining
              </span>
            </div>
            {/* --- STEP 1: Applied here --- */}
            <div className="relative aspect-square bg-white/90 border border-emerald-300/70 rounded-3xl shadow-xl shadow-emerald-500/20 flex items-center justify-center p-4 transition-transform duration-500 group-hover:scale-95 group-hover:-rotate-5">
              <span className="material-symbols-outlined text-emerald-600 text-6xl md:text-9xl opacity-80 drop-shadow-lg">
                camera
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:gap-8 pt-8">
            {/* --- STEP 1: Applied here --- */}
            <div className="relative aspect-square bg-white/90 border border-emerald-300/70 rounded-3xl shadow-xl shadow-emerald-500/20 flex items-center justify-center p-4 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-4">
              <span className="material-symbols-outlined text-emerald-600 text-6xl md:text-9xl opacity-80 drop-shadow-lg">
                brush
              </span>
            </div>
            {/* --- STEP 1: Applied here --- */}
            <div className="relative aspect-square bg-white/90 border border-emerald-300/70 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center p-4 transition-transform duration-500 group-hover:scale-90 group-hover:rotate-8">
              <span className="material-symbols-outlined text-emerald-600 text-6xl md:text-9xl opacity-80 drop-shadow-lg">
                headphones
              </span>
            </div>
            {/* --- STEP 1: Applied here (and fixed typo) --- */}
            <div className="relative aspect-square bg-white/90 border border-emerald-300/70 rounded-3xl shadow-xl shadow-emerald-500/20 flex items-center justify-center p-4 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2">
              <span className="material-symbols-outlined text-emerald-600 text-6xl md:text-9xl opacity-80 drop-shadow-lg">
                menu_book
              </span>
            </div>
          </div>
        </div>

        <div className="mt-28 flex flex-wrap justify-center gap-6">
          <button onClick={() => navigate('/signup')} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-16 px-10 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xl font-bold leading-normal tracking-wide shadow-2xl shadow-emerald-500/50 transition-all hover:from-emerald-600 hover:to-emerald-500 hover:shadow-emerald-600/60 transform hover:scale-110">
            <span className="truncate font-display">
              Find Your Curiosity
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CampusSection;
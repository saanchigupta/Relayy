import React from 'react';
import './Landingpage.css';

const JourneySection = () => {
  return (
    <section className="relative w-full bg-emerald-100 py-24 md:py-32 px-4 md:px-10 lg:px-20 overflow-hidden bg-dot-pattern section-transition clip-path-swoop-inverted">
      <div className="absolute -top-40 -left-60 w-96 h-96 bg-gradient-to-br from-emerald-300/60 to-emerald-400/60 organic-shape animate-float"></div>
      <div
        className="absolute -bottom-40 -right-60 w-96 h-96 bg-gradient-to-tl from-emerald-400/60 to-emerald-500/60 organic-shape animate-float"
        style={{ animationDelay: '-4s' }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-100/10 via-emerald-100/90 to-emerald-100/10"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-emerald-400 to-transparent opacity-50"></div>
      <div className="mx-auto max-w-5xl relative">
        {/* --- RESPONSIVE FIX: Reduced margin-bottom on mobile --- */}
        <h2 className="font-display text-center text-5xl md:text-7xl font-bold text-gray-900 mb-16 md:mb-28 [text-shadow:_0_4px_8px_rgb(209_250_229_/_90%)]">
          Journey of an Item
        </h2>
        <div className="relative">
          <svg
            className="absolute inset-0 w-full h-full"
            width="100%"
            height="100%"
            viewBox="0 0 800 1000"
            preserveAspectRatio="none"
          >
            <path
              className="path-line"
              d="M 400 50 C 700 150, 100 250, 400 350 S 700 450, 400 550 S 100 650, 400 750 S 700 850, 400 950"
              fill="none"
              stroke="url(#line-gradient)"
              strokeDasharray="10 10"
              strokeLinecap="round"
              strokeWidth="4"
            ></path>
            <defs>
              <linearGradient
                id="line-gradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: '#6ee7b7', stopOpacity: 0 }}
                ></stop>
                <stop
                  offset="20%"
                  style={{ stopColor: '#34d399', stopOpacity: 1 }}
                ></stop>
                <stop
                  offset="80%"
                  style={{ stopColor: '#10b981', stopOpacity: 1 }}
                ></stop>
                <stop
                  offset="100%"
                  style={{ stopColor: '#059669', stopOpacity: 0 }}
                ></stop>
              </linearGradient>
            </defs>
          </svg>
          {/* --- RESPONSIVE FIX: Changed to w-full on mobile, hidden spacer --- */}
          <div className="relative z-10 flex items-center mb-24 md:mb-64">
            <div className="w-1/3 hidden md:block"></div> {/* Spacer */}
            <div className="w-full md:w-2/3 md:pl-16">
              <div
                className="p-6 md:p-8 bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl shadow-emerald-500/40 border border-emerald-300/90 animate-pulse-item"
                style={{ animationDelay: '1s' }}
              >
                <span className="material-symbols-outlined text-emerald-600 text-4xl sm:text-5xl">
                  edit_square
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold mt-3 text-gray-900">
                  The Spark
                </h3>
                <p className="font-body text-emerald-800/90 mt-2 text-base sm:text-lg">
                  A textbook, once a final exam's nemesis, seeks a new quest.
                </p>
              </div>
            </div>
          </div>
          {/* --- RESPONSIVE FIX: Changed to w-full on mobile, hidden spacer --- */}
          <div className="relative z-10 flex items-center mb-24 md:mb-64">
            <div className="w-full md:w-2/3 md:pr-16">
              <div
                className="p-6 md:p-8 bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl shadow-emerald-500/40 border border-emerald-300/90 text-right animate-pulse-item"
                style={{ animationDelay: '2s' }}
              >
                <span className="material-symbols-outlined text-emerald-600 text-4xl sm:text-5xl">
                  swap_horiz
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold mt-3 text-gray-900">
                  The Exchange
                </h3>
                <p className="font-body text-emerald-800/9f0 mt-2 text-base sm:text-lg">
                  A quick chat, a friendly price, a new story begins.
                </p>
              </div>
            </div>
            <div className="w-1/3 hidden md:block"></div> {/* Spacer */}
          </div>
          {/* --- RESPONSIVE FIX: Changed to w-full on mobile, hidden spacer --- */}
          <div className="relative z-10 flex items-center">
            <div className="w-1/3 hidden md:block"></div> {/* Spacer */}
            <div className="w-full md:w-2/3 md:pl-16">
              <div
                className="p-6 md:p-8 bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl shadow-emerald-500/40 border border-emerald-300/90 animate-pulse-item"
                style={{ animationDelay: '3s' }}
              >
                <span className="material-symbols-outlined text-emerald-600 text-4xl sm:text-5xl">
                  local_library
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold mt-3 text-gray-900">
                  New Chapter
                </h3>
                <p className="font-body text-emerald-800/90 mt-2 text-base sm:text-lg">
                  The same pages, now fueling a different student's dream.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
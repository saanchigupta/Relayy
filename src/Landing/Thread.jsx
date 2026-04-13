import React from 'react';
import './Landingpage.css';

const ThreadSection = () => {
  return (
    // --- RESPONSIVE FIX: Reduced vertical padding on mobile ---
    <section className="relative w-full py-24 md:py-40 px-4 overflow-hidden section-transition clip-path-swoop bg-gradient-to-br from-emerald-100 to-emerald-300">
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/30 via-emerald-200/20 to-emerald-300/10 opacity-70"></div>

      {/* --- STEP 2: Removed 'animate-float' from the organic shapes --- */}
      <div
        className="absolute -bottom-60 -left-60 w-[500px] h-[500px] bg-white/20 organic-shape"
        style={{ animationDelay: '-2s', animationDuration: '15s' }}
      ></div>
      {/* --- STEP 2: Removed 'animate-float' from the organic shapes --- */}
      <div
        className="absolute -top-60 -right-60 w-[500px] h-[500px] bg-white/20 organic-shape"
        style={{ animationDelay: '-7s', animationDuration: '15s' }}
      ></div>

      <div className="relative max-w-6xl mx-auto flex flex-col items-center text-center">
        <h2 className="font-display text-5xl md:text-7xl font-extrabold text-emerald-900 [text-shadow:_0_5px_15px_rgb(255_255_255_/_50%)]">
          A Thread of Connections
        </h2>
        <p className="font-body text-emerald-800/90 mt-6 text-xl md:text-2xl max-w-3xl">
          Each item weaves a new thread, connecting students, stories, and
          semesters into a vibrant campus tapestry.
        </p>
        {/* --- RESPONSIVE FIX: Removed fixed height, made it responsive --- */}
        <div className="mt-16 md:mt-24 w-full h-[400px] sm:h-[500px] md:h-[600px] relative">
          <svg
            className="absolute inset-0 opacity-40"
            width="100%"
            height="100%"
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* This SVG animation is performant and can stay */}
            <path
              className="thread"
              d="M 50 550 Q 250 50, 450 300 T 850 50"
              fill="none"
              stroke="url(#thread-gradient)"
              strokeDasharray="20 15"
              strokeWidth="6"
            ></path>
            <path
              className="thread"
              d="M 950 550 Q 750 50, 550 300 T 150 50"
              fill="none"
              stroke="url(#thread-gradient)"
              strokeDasharray="20 15"
              strokeWidth="6"
              style={{ animationDelay: '-5s' }}
            ></path>
            <defs>
              <linearGradient
                id="thread-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#ecfdf5" stopOpacity="1"></stop>
                <stop
                  offset="50%"
                  stopColor="#a7f3d0"
                  stopOpacity="1"
                ></stop>
                <stop
                  offset="100%"
                  stopColor="#ecfdf5"
                  stopOpacity="1"
                ></stop>
              </linearGradient>
            </defs>
          </svg>

          {/* --- Item 1 --- */}
          {/* --- RESPONSIVE FIX: Made item smaller on mobile --- */}
          <div
            className="absolute top-[50%] left-[5%] md:left-[10%] w-24 h-24 md:w-32 md:h-32 -translate-y-1/2 animate-float"
            style={{ animationDuration: '8s' }}
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-full bg-white/90 shadow-2xl shadow-emerald-400/60 border-2 border-white"></div>
              <div className="absolute inset-2 flex flex-col items-center justify-center text-center p-2">
                <span className="material-symbols-outlined text-emerald-600 text-2xl md:text-3xl">
                  sell
                </span>
                <p className="font-body text-xs font-bold text-emerald-900 mt-1">
                  Chem Lab Coat
                </p>
                <p className="font-display text-xs text-emerald-700">
                  'Never worn!'
                </p>
              </div>
            </div>
          </div>

          {/* --- Item 2 --- */}
          {/* --- RESPONSIVE FIX: Made item smaller on mobile --- */}
          <div
            className="absolute top-[20%] left-[40%] md:left-[45%] w-24 h-24 md:w-32 md:h-32 -translate-y-1/2 animate-float"
            style={{ animationDuration: '7s', animationDelay: '-2s' }}
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-full bg-white/90 shadow-2xl shadow-emerald-400/60 border-2 border-white"></div>
              <div className="absolute inset-2 flex flex-col items-center justify-center text-center p-2">
                <span className="material-symbols-outlined text-emerald-600 text-2xl md:text-3xl">
                  music_note
                </span>
                <p className="font-body text-xs font-bold text-emerald-900 mt-1">
                  Ukelele
                </p>
                <p className="font-display text-xs text-emerald-700">
                  'Slightly off-key'
                </p>
              </div>
            </div>
          </div>

          {/* --- Item 3 --- */}
          {/* --- RESPONSIVE FIX: Made item smaller on mobile --- */}
          <div
            className="absolute top-[80%] left-[20%] md:left-[30%] w-24 h-24 md:w-32 md:h-32 -translate-y-1/2 animate-float"
            style={{ animationDuration: '9s', animationDelay: '-4s' }}
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-full bg-white/90 shadow-2xl shadow-emerald-400/60 border-2 border-white"></div>
              <div className="absolute inset-2 flex flex-col items-center justify-center text-center p-2">
                <span className="material-symbols-outlined text-emerald-600 text-2xl md:text-3xl">
                  auto_stories
                </span>
                <p className="font-body text-xs font-bold text-emerald-900 mt-1">
                  Plato's Republic
                </p>
                <p className="font-display text-xs text-emerald-700">
                  'Heavily annotated'
                </p>
              </div>
            </div>
          </div>

          {/* --- Item 4 --- */}
          {/* --- RESPONSIVE FIX: Made item smaller on mobile --- */}
          <div
            className="absolute top-[10%] left-[75%] md:left-[80%] w-24 h-24 md:w-32 md:h-32 -translate-y-1/2 animate-float"
            style={{ animationDuration: '6s', animationDelay: '-1s' }}
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-full bg-white/90 shadow-2xl shadow-emerald-400/60 border-2 border-white"></div>
              <div className="absolute inset-2 flex flex-col items-center justify-center text-center p-2">
                <span className="material-symbols-outlined text-emerald-600 text-2xl md:text-3xl">
                  sports_esports
                </span>
                <p className="font-body text-xs font-bold text-emerald-900 mt-1">
                  Game Controller
                </p>
                <p className="font-display text-xs text-emerald-700">
                  'Right trigger sticks'
                </p>
              </div>
            </div>
          </div>

          {/* --- Item 5 --- */}
          {/* --- RESPONSIVE FIX: Made item smaller on mobile --- */}
          <div
            className="absolute top-[65%] left-[70%] md:left-[75%] w-24 h-24 md:w-32 md:h-32 -translate-y-1/2 animate-float"
            style={{ animationDuration: '8s', animationDelay: '-5s' }}
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-full bg-white/90 shadow-2xl shadow-emerald-400/60 border-2 border-white"></div>
              <div className="absolute inset-2 flex flex-col items-center justify-center text-center p-2">
                <span className="material-symbols-outlined text-emerald-600 text-2xl md:text-3xl">
                  palette
                </span>
                <p className="font-body text-xs font-bold text-emerald-900 mt-1">
                  Acrylic Paints
                </p>
                <p className="font-display text-xs text-emerald-700">
                  'Mostly full tubes'
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThreadSection;
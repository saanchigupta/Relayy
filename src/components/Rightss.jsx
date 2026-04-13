import React from "react";

function Rightss({ id, title, points = [], image }) {
  return (
    <section
      id={id}
      className="relative bg-white py-20 px-6 lg:px-12 font-poppins"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left: Text */}
        <div className="w-full lg:w-1/2 space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug">
            {title}
          </h2>
          <ul className="space-y-4 text-xl text-gray-700">
            {points && points.length > 0 ? (
              points.map((point, index) => (
                <li
                  key={`point-${id}-${index}`}
                  className="flex items-center space-x-3 hover:text-purple-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-purple-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{point}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic">No points available</li>
            )}
          </ul>
        </div>

        {/* Right: Browser Mockup */}
        <div className="flex justify-center w-full lg:w-1/2">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-[600px] border border-gray-200">
            {/* Browser Bar */}
            <div className="flex items-center bg-gray-700 h-8 px-4 space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-400"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span className="w-3 h-3 rounded-full bg-green-400"></span>
              <div className="ml-4 text-white text-sm truncate">Relayy.com</div>
            </div>
            {/* Website Image */}
            <img
              src={image}
              alt="Feature preview"
              className="w-full h-[350px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Rightss;

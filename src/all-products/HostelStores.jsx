import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// --- Single Source of Truth ---
const hostelData = [
  { name: "Agira Hall", imageFile: "agirahall.jpg" },
  { name: "Ambaram Hall", imageFile: "ambaramhall.jpg" },
  { name: "Amritam Hall", imageFile: "amritamhall.jpg" },
  { name: "Ananta Hall", imageFile: "anantahall.jpg" },
  { name: "Anantam Hall", imageFile: "anantamhall.jpg" },
  { name: "Dhriti Hall", imageFile: "dhritihall.jpg" },
  { name: "Neeram Hall", imageFile: "neeramhall.jpg" },
  { name: "Prithvi Hall", imageFile: "prithvihall.jpg" },
  { name: "Tejas Hall", imageFile: "tejashall.png" },
  { name: "Vahni Hall", imageFile: "vahnihall.jpeg" },
  { name: "Viyat Hall", imageFile: "viyathall.jpeg" },
  { name: "Vyan Hall", imageFile: "vyanhall.png" },
  { name: "Vyom Hall", imageFile: "vyomhall.png" },
];

// Automatically generate hostel data objects
const hostels = hostelData.map((hostel) => ({
  name: hostel.name,
  img: `/hostels/${hostel.imageFile}`,
}));

const HostelStores = () => {
  const scrollContainerRef = useRef(null);

  const scroll = (scrollOffset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* --- Title and Scroll Buttons --- */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-emerald-800">Browse by Hostel</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => scroll(-250)}
              className="p-1.5 rounded-full bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(250)}
              className="p-1.5 rounded-full bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* --- Scrollable Container --- */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 pb-3 scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {hostels.map((hostel) => (
            <div
              key={hostel.name}
              className="flex-shrink-0 w-40 bg-white rounded-lg border border-emerald-100 shadow-sm 
                         hover:shadow-md hover:border-emerald-300 transition-all duration-300"
            >
              <img
                src={hostel.img}
                alt={hostel.name}
                className="w-full h-28 object-cover rounded-t-lg bg-gray-100"
                loading="lazy"
              />
              <div className="p-2 text-center">
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                  {hostel.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HostelStores;

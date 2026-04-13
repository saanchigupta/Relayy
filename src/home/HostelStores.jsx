import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// --- Central mapping: college -> hostel entries (name + image file) ---
const collegeHostels = {
  "Thapar University": [
    { name: 'Agira Hall',   imageFile: 'agirahall.jpg' },
    { name: 'Ambaram Hall', imageFile: 'ambaramhall.jpg' },
    { name: 'Amritam Hall', imageFile: 'amritamhall.jpg' },
    { name: 'Ananta Hall',  imageFile: 'anantahall.jpg' },
    { name: 'Anantam Hall', imageFile: 'anantamhall.jpg' },
    { name: 'Dhriti Hall',  imageFile: 'dhritihall.jpg' },
    { name: 'Neeram Hall',  imageFile: 'neeramhall.jpg' },
    { name: 'Prithvi Hall', imageFile: 'prithvihall.jpg' },
    { name: 'Tejas Hall',   imageFile: 'tejashall.png' },
    { name: 'Vahni Hall',   imageFile: 'vahnihall.jpeg' },
    { name: 'Viyat Hall',   imageFile: 'viyathall.jpeg' },
    { name: 'Vyan Hall',    imageFile: 'vyanhall.png' },
    { name: 'Vyom Hall',    imageFile: 'vyomhall.png' },
  ],
  "Manipal University Jaipur": [
    { name: 'Good Hostel Space (GHS)', imageFile: 'GHS_manipal.avif' }
  ],
  "NIT Jalandhar": [
    { name: 'Aryabhatta Hostel', imageFile: 'aryabhatta.jpg' },
    { name: 'Tagore Hostel', imageFile: 'tagore.jpg' }
  ],
  "IIT Ropar": [
    { name: 'Satluj Hostel', imageFile: 'satluj.jpg' },
    { name: 'Beas Hostel', imageFile: 'beas.jpg' }
  ],
};

// --- fallback: flattened list of all hostels (used if college not detected) ---
const allHostels = Object.values(collegeHostels).flat();

// small helper: decode JWT payload (return object or null)
function decodeJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
}

const HostelStores = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [visibleHostels, setVisibleHostels] = useState(allHostels);

  const handleHostelClick = (hostelName) => {
    // navigate to all-products with a query param for hostel
    navigate(`/all-products?userHostel=${encodeURIComponent(hostelName)}`);
  };

  const scroll = (scrollOffset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollOffset,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // 1) Try localStorage user object first
    let college = null;
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed?.college) college = parsed.college;
      }
    } catch (err) {
      // ignore parse errors
    }

    // 2) If not found, try decoding token payload
    if (!college) {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      if (token) {
        const payload = decodeJwtPayload(token);
        // payload might have 'email' or 'college' depending on your auth implementation
        if (payload?.college) {
          college = payload.college;
        } else if (payload?.email) {
          // optional: infer college from email domain (if you have a map)
          const domain = String(payload.email).split('@')[1]?.toLowerCase();
          if (domain === 'muj.manipal.edu') college = 'Manipal University Jaipur';
          else if (domain === 'nitj.ac.in') college = 'NIT Jalandhar';
          else if (domain === 'iitrpr.ac.in') college = 'IIT Ropar';
          else if (domain === 'thapar.edu') college = 'Thapar University';
        }
      }
    }

    // 3) Normalize and pick hostels
    if (college) {
      // try direct match
      const match = Object.keys(collegeHostels).find(
        (c) => c.toLowerCase() === String(college).toLowerCase()
      );
      if (match) {
        setVisibleHostels(collegeHostels[match]);
        return;
      }

      // try contains (e.g., user stored "Manipal University Jaipur - CS" etc.)
      const containsMatch = Object.keys(collegeHostels).find((c) =>
        String(college).toLowerCase().includes(c.toLowerCase()) ||
        c.toLowerCase().includes(String(college).toLowerCase())
      );
      if (containsMatch) {
        setVisibleHostels(collegeHostels[containsMatch]);
        return;
      }
    }

    // fallback: show all hostels
    setVisibleHostels(allHostels);
  }, []);

  return (
    <section className="py-8 sm:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Browse by Hostel
          </h1>

          <div className="hidden md:flex space-x-2">
            <button
              onClick={() => scroll(-300)}
              className="p-2 rounded-full bg-white shadow-md text-gray-800 hover:bg-gray-100 transition"
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll(300)}
              className="p-2 rounded-full bg-white shadow-md text-gray-800 hover:bg-gray-100 transition"
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-4 md:space-x-6 pb-4 touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {visibleHostels.map((hostel) => {
            const imgPath = `/hostels/${hostel.imageFile}`; // adjust if your images are in a different folder
            return (
              <div
                key={hostel.name}
                className="w-40 sm:w-48 md:w-72 flex-shrink-0 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => handleHostelClick(hostel.name)}
              >
                <img
                  src={imgPath}
                  alt={hostel.name}
                  className="w-full h-28 sm:h-36 md:h-48 object-cover bg-gray-200"
                  loading="lazy"
                />
                <div className="p-2 text-center">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-800 line-clamp-1">{hostel.name}</h3>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-gray-500 mt-4 md:hidden">
          ← Scroll horizontally to see more hostels →
        </p>
      </div>
    </section>
  );
};

export default HostelStores;

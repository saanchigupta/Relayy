// src/components/FilterSort.jsx
import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

// --- Static data (move to a config file later if you want) ---
const categories = ["Electronics", "Books", "Furniture", "Clothing", "Others"];
const prices = [
  { value: "under-100", label: "Under ₹100" },
  { value: "100-500", label: "₹100 - ₹500" },
  { value: "500-1000", label: "₹500 - ₹1000" },
  { value: "over-1000", label: "Over ₹1000" },
];

// Per-college hostel lists (single source of truth)
const collegeHostels = {
  "Thapar University": [
    "Agira Hall",
    "Ambaram Hall",
    "Amritam Hall",
    "Ananta Hall",
    "Anantam Hall",
    "Dhriti Hall",
    "Neeram Hall",
    "Prithvi Hall",
    "Tejas Hall",
    "Vahni Hall",
    "Viyat Hall",
    "Vyan Hall",
    "Vyom Hall",
  ],
  "Manipal University Jaipur": [
    "Good Hostel Space (GHS)",
  ],
  "NIT Jalandhar": ["Aryabhatta Hostel", "Tagore Hostel"],
  "IIT Ropar": ["Satluj Hostel", "Beas Hostel"],
};

// fallback combined hostel list
const allHostels = Array.from(new Set(Object.values(collegeHostels).flat()));

// small helper: decode JWT payload safely
function decodeJwtPayload(token) {
  try {
    if (!token) return null;
    const parts = String(token).split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Helper component for a single dropdown
const FilterDropdown = ({ options, value, onChange, placeholder }) => (
  <div className="relative min-w-[160px]">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none w-full md:w-auto bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8
                 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
    >
      <option value="all">{placeholder}</option>
      {options.map((option) => {
        const isObject = typeof option === "object" && option !== null && !Array.isArray(option);
        const optionValue = isObject ? option.value : option;
        const optionLabel = isObject ? option.label : option;
        return (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        );
      })}
    </select>
    <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
  </div>
);

// Helper component for a single sort button
const SortButton = ({ value, label, sortBy, setSortBy }) => {
  const isActive = sortBy === value;
  return (
    <button
      onClick={() => setSortBy(value)}
      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors
        ${isActive ? "bg-emerald-700 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
    >
      {label}
    </button>
  );
};

// --- Main Combined Component ---
const FilterSort = ({ filters, setFilters, sortBy, setSortBy }) => {
  const [hostelOptions, setHostelOptions] = useState(allHostels);

  // Detect college from localStorage.user or token
  useEffect(() => {
    let college = null;

    // 1) try localStorage.user
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.college) college = parsed.college;
      }
    } catch (err) {
      // ignore parse errors
    }

    // 2) try token/auth_token payload fallback
    if (!college) {
      const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
      if (token) {
        const payload = decodeJwtPayload(token);
        if (payload?.college) {
          college = payload.college;
        } else if (payload?.email) {
          const domain = String(payload.email).split("@")[1]?.toLowerCase();
          // map common domains -> college names (extend as needed)
          if (domain === "muj.manipal.edu") college = "Manipal University Jaipur";
          if (domain === "thapar.edu") college = "Thapar University";
          if (domain === "nitj.ac.in") college = "NIT Jalandhar";
          if (domain === "iitrpr.ac.in") college = "IIT Ropar";
        }
      }
    }

    // 3) pick hostels for matched college, or fallback to all
    if (college) {
      const matchKey = Object.keys(collegeHostels).find(
        (k) =>
          k.toLowerCase() === String(college).toLowerCase() ||
          String(college).toLowerCase().includes(k.toLowerCase()) ||
          k.toLowerCase().includes(String(college).toLowerCase())
      );
      if (matchKey) {
        setHostelOptions(collegeHostels[matchKey]);
        return;
      }
    }

    setHostelOptions(allHostels);
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // memoized options for other dropdowns
  const priceOptions = useMemo(() => prices, []);
  const categoryOptions = useMemo(() => categories, []);

  return (
    <>
      {/* --- Filter Dropdowns (Single Row Always) --- */}
      <div className="flex gap-4 mb-6 overflow-x-auto whitespace-nowrap pb-1 [&>*]:flex-shrink-0">
        <FilterDropdown
          options={categoryOptions}
          value={filters.category}
          onChange={(val) => handleFilterChange("category", val)}
          placeholder="Category"
        />

        <FilterDropdown
          options={priceOptions}
          value={filters.price}
          onChange={(val) => handleFilterChange("price", val)}
          placeholder="Price"
        />

        <FilterDropdown
          options={hostelOptions}
          value={filters.userHostel}
          onChange={(val) => handleFilterChange("userHostel", val)}
          placeholder="Hostel"
        />

        <button
          onClick={() => {
            /* Apply is handled by parent via filters state — if you want immediate effect, parent should observe filters */
          }}
          className="bg-emerald-700 text-white font-semibold px-6 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
        >
          Apply
        </button>
      </div>

      {/* --- Sort Options (Also single row) --- */}
      <div className="flex items-center gap-4 mb-6 overflow-x-auto whitespace-nowrap pb-1">
        <span className="text-gray-800 font-semibold flex-shrink-0">Sort by:</span>

        <div className="flex gap-2 flex-shrink-0">
          <SortButton value="newest" label="Newest" sortBy={sortBy} setSortBy={setSortBy} />
          <SortButton value="priceLowToHigh" label="Price: Low to High" sortBy={sortBy} setSortBy={setSortBy} />
          <SortButton value="priceHighToLow" label="Price: High to Low" sortBy={sortBy} setSortBy={setSortBy} />
        </div>
      </div>
    </>
  );
};

export default FilterSort;

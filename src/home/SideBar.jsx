import React from "react";

const Sidebar = ({ filters, setFilters }) => {
  const categories = ["Books", "Bags", "Electronics", "Accessories", "Clothes"];
  const ratings = [5, 4, 3, 2];

  const toggleFilter = (type, value) => {
    setFilters((prev) => {
      let newValues = [...prev[type]];
      if (newValues.includes(value)) {
        newValues = newValues.filter((v) => v !== value);
      } else {
        newValues.push(value);
      }
      return { ...prev, [type]: newValues };
    });
  };

  return (
    <aside className="w-64 p-4 bg-white border-r hidden md:block">
      {/* Categories */}
      <h3 className="font-bold text-purple-800 mb-3">Categories</h3>
      <ul className="space-y-1 text-sm">
        {categories.map((cat) => (
          <li key={cat}>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleFilter("categories", cat)}
                className="accent-pink-500"
              />
              <span>{cat}</span>
            </label>
          </li>
        ))}
      </ul>

      {/* Rating */}
      <h3 className="font-bold text-purple-800 mt-6 mb-3">Rating</h3>
      <ul className="space-y-1 text-sm">
        {ratings.map((stars) => (
          <li key={stars}>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.ratings.includes(stars)}
                onChange={() => toggleFilter("ratings", stars)}
                className="accent-pink-500"
              />
              <span>{"⭐".repeat(stars)}</span>
            </label>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;

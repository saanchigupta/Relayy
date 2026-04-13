import React from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. Import useNavigate
import { Package, Book, Sofa, Shirt, Dices } from 'lucide-react'; // Example icons

const categories = [
  { name: 'Electronics', icon: Package, color: 'bg-teal-400' },
  { name: 'Books', icon: Book, color: 'bg-blue-400' },
  { name: 'Furniture', icon: Sofa, color: 'bg-purple-400' },
  { name: 'Clothing', icon: Shirt, color: 'bg-lime-400' },
  { name: 'Other', icon: Dices, color: 'bg-orange-400' },
];

// 2. Remove selectedCategory and setSelectedCategory props
const Categories = () => {
  const navigate = useNavigate(); // <-- 3. Initialize navigate

  // 4. Change the click handler to navigate
  const handleCategoryClick = (categoryName) => {
    // This creates the URL: /all-products?category=Electronics
    navigate(`/all-products?category=${categoryName}`);
  };
  
  return (
    <div className="py-12 px-4 bg-emerald-50">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleCategoryClick(cat.name)} // <-- 5. This uses the new handler
            className={`
              ${cat.color} text-white font-semibold p-6 rounded-lg 
              flex flex-col items-center justify-center 
              shadow-lg hover:shadow-xl transform hover:-translate-y-1 
              transition-all duration-300
              // 6. Remove the 'ring' style since it's no longer needed
            `}
          >
            <cat.icon size={32} className="mb-2" />
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
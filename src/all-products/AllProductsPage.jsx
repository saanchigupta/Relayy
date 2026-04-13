import React from 'react';
import Navbar from '../Navbar';
import Products from './products'; // Import the new logic component
import { useState } from 'react';

const AllProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="font-poppins min-h-screen bg-emerald-50">
      
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <Products />
    </div>
  );
};

export default AllProductsPage;
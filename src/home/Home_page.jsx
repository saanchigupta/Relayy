import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

// Import all your sections
import Navbar from '../Navbar'; // Adjust path if needed
import Footer from '../Footer'; // Adjust path if needed
import Hero from './Hero';
import Categories from './Categories';
import HostelStores from './HostelStores'; // This is correct
import RecentlyListed from './RecentlyListed';

// Icons for the features section
import { PlusCircle, ShieldCheck, Truck } from 'lucide-react';

// --- Helper function ---
function decodeJwtPayload(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}



// --- The Main Page Component ---
const Home_page = () => {
  //
  // --- 1. ADD ALL YOUR STATE HOOKS ---
  //
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true); // <-- "loading" is now defined
  const [user, setUser] = useState(null);

  const backendURL = "https://relayy-backend-9war.onrender.com";

  //
  // --- 2. ADD YOUR DATA FETCHING LOGIC ---
  //
  useEffect(() => {
    const loadUserAndProducts = async () => {
      try {
        setLoading(true);

        // 1. Get user email
        let email = null;
        try {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (storedUser?.email) email = storedUser.email;
        } catch {}
        if (!email) {
          const token = localStorage.getItem("token");
          if (token) {
            const payload = decodeJwtPayload(token);
            if (payload?.email) email = payload.email;
          }
        }
        if (!email) email = localStorage.getItem("userEmail");

        if (!email) {
          setLoading(false);
          return;
        }

        // 2. Fetch user details
        const userRes = await axios.get(`${backendURL}/api/v1/users/${email}`);
        setUser(userRes.data || null);

        // 3. Fetch all products
        const productRes = await axios.get(`${backendURL}/api/v1/products`);
        const allProductsData = Array.isArray(productRes.data)
          ? productRes.data
          : productRes.data.products || [];

        // 4. Filter by college domain
        const domain = email.split("@")[1].toLowerCase();
        const sameCollege = allProductsData.filter(
          (p) =>
            p.userEmail &&
            p.userEmail.split("@")[1]?.toLowerCase() === domain
        );

        setAllProducts(sameCollege);
      } catch (err) {
        console.error("Error loading user or products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndProducts();
  }, [backendURL]);

  //
  // --- 3. ADD YOUR FILTERING LOGIC ---
  //
  const filteredProducts = allProducts.filter((p) => {
    const title = (p.title || p.name || "").toLowerCase();
    
    // Filter by search query
    if (searchQuery && !title.includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by selected category
    if (selectedCategory && p.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
    }
    
    return true;
  });

  //
  // --- 4. "recentProducts" IS NOW DEFINED ---
  //
  const recentProducts = filteredProducts.slice(0, 8);


  // Show main loader
  if (loading && allProducts.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader" /> 
      </div>
    );
  }

  //
  // --- 5. YOUR RETURN STATEMENT (NOW WITH PROPS) ---
  //
  return (
    <div className="font-poppins min-h-screen bg-emerald-50">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <main>
        {/* Stack all your sections here */}
        <Hero user={user} />
        <Categories />
        
        <HostelStores /> {/* This component is self-contained */}
        
        {/* These props now exist! */}
        <RecentlyListed 
          products={recentProducts} 
          loading={loading}
        />
        
        
      </main>

    </div>
  );
};

export default Home_page;
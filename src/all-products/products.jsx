// ProductBrowser.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import FilterSort from "./FilterSort";
import PageNav from "./PageNav";

// Helper to decode JWT payload (to extract email)
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

const ProductBrowser = () => {
  const [searchParams] = useSearchParams();
  const hostelFromUrl = searchParams.get("userHostel") || "all";
  const categoryFromUrl = searchParams.get("category") || "all";
  const qFromUrl = (searchParams.get("q") || "").trim(); // search term from URL

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDomain, setUserDomain] = useState(null);

  const [filters, setFilters] = useState({
    category: categoryFromUrl,
    price: "all",
    userHostel: hostelFromUrl,
  });

  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

  const backendURL = import.meta.env.VITE_BACKEND_URL || "https://relayy-backend-9war.onrender.com";

  // Get user email domain from localStorage or token (runs once)
  useEffect(() => {
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

    if (email) {
      const domain = email.split("@")[1]?.toLowerCase();
      setUserDomain(domain);
    }
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productRes = await axios.get(`${backendURL}/api/v1/products`);
        const allProductsData = Array.isArray(productRes.data)
          ? productRes.data
          : productRes.data.products || [];
        setProducts(allProductsData);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [backendURL]);

  // Apply filters + search + sorting
  useEffect(() => {
    let tempProducts = [...products];

    // Campus/domain filter (if available)
    if (userDomain) {
      tempProducts = tempProducts.filter((p) =>
        p.userEmail && p.userEmail.split("@")[1]?.toLowerCase() === userDomain
      );
    }

    // Category filter
    if (filters.category !== "all") {
      tempProducts = tempProducts.filter(
        (p) => p.category && p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Hostel filter
    if (filters.userHostel !== "all") {
      tempProducts = tempProducts.filter(
        (p) => p.userHostel && p.userHostel.toLowerCase() === filters.userHostel.toLowerCase()
      );
    }

    // Price filter
    if (filters.price !== "all") {
      tempProducts = tempProducts.filter((p) => {
        const price = Number(p.price) || 0;
        switch (filters.price) {
          case "under-100":
            return price < 100;
          case "100-500":
            return price >= 100 && price <= 500;
          case "500-1000":
            return price >= 500 && price <= 1000;
          case "over-1000":
            return price > 1000;
          default:
            return true;
        }
      });
    }

    // SEARCH: apply qFromUrl if present
    if (qFromUrl) {
      const qLower = qFromUrl.toLowerCase();
      tempProducts = tempProducts.filter((p) => {
        const title = (p.title || p.name || "").toLowerCase();
        const desc = (p.description || p.desc || "").toLowerCase();
        const category = (p.category || "").toLowerCase();
        const tags = Array.isArray(p.tags) ? p.tags.join(" ").toLowerCase() : (p.tags || "").toLowerCase();
        return title.includes(qLower) || desc.includes(qLower) || category.includes(qLower) || tags.includes(qLower);
      });
    }

    // Sorting
    if (sortBy === "priceLowToHigh") {
      tempProducts.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === "priceHighToLow") {
      tempProducts.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (tempProducts.length > 0 && tempProducts[0].createdAt) {
      tempProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(tempProducts);
    setCurrentPage(1);
  }, [products, filters, sortBy, userDomain, qFromUrl]); // note: qFromUrl included

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <main className="max-w-6xl mx-auto py-6 md:py-8 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">Find Your Next Treasure</h1>

      <FilterSort
        filters={filters}
        setFilters={setFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24 text-gray-600">
          No items found{qFromUrl ? ` for "${qFromUrl}"` : ""}.
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-12">
          {currentProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      <PageNav currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </main>
  );
};

export default ProductBrowser;

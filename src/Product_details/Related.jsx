import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 🔑 NEW: Helper function to decode JWT payload (Needed to get the user's email/domain)
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

const Related = ({ category, currentProductId }) => {
  const navigate = useNavigate();

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔑 NEW: State to store the current user's college domain
  const [userDomain, setUserDomain] = useState(null);

  const backendURL = "https://relayy-backend-9war.onrender.com";

  // 🔑 NEW: useEffect to get user email and domain from local storage/token
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
        // Extract the domain (e.g., 'college.edu')
        const domain = email.split("@")[1]?.toLowerCase();
        setUserDomain(domain);
    }
  }, []); // Runs only on mount to set the domain

  // 1. Fetch products and apply filters (MODIFIED useEffect)
  useEffect(() => {
    // We must wait for the userDomain to be set before fetching/filtering
    if (!category || !userDomain) return;

    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        // Step 1: Fetch all products (Still inefficient, but matches your current approach)
        const res = await axios.get(`${backendURL}/api/v1/products`);
        const allProducts = Array.isArray(res.data)
          ? res.data
          : res.data.products || [];

        // Step 2: Apply ALL filters, starting with the MANDATORY Campus Filter
        const filteredByCampusAndCategory = allProducts
          .filter(
            (p) =>
              // 🔑 NEW: Mandatory Campus Filter
              p.userEmail && 
              p.userEmail.split("@")[1]?.toLowerCase() === userDomain &&
              // Existing Category Filter
              p.category === category &&
              // Existing Exclusion Filter
              p._id !== currentProductId &&
              p.imageUrls?.length > 0
          )
          // Limit to 4 items
          .slice(0, 4);

        setRelatedProducts(filteredByCampusAndCategory);
      } catch (err) {
        console.error("❌ Error fetching related products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
    // ⚠️ IMPORTANT: Add userDomain to the dependency array
  }, [category, currentProductId, backendURL, userDomain]); 

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // --- LOADING / EMPTY STATES (Existing logic) ---
  if (loading)
    return (
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-center text-gray-800">Loading related items...</p>
      </div>
    );

  if (relatedProducts.length === 0) {
    return null; // Don't show the section if there are no related items
  }

  // --- Main Related Component (Existing JSX) ---
  return (
    <section className="max-w-6xl mx-auto px-4 font-sans">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        You might also like
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <div
            key={product._id}
            onClick={() => handleProductClick(product._id)}
            className="bg-gray-50 rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg cursor-pointer border border-gray-200"
          >
            <img
              src={product.imageUrls?.[0] || "/placeholder.jpg"}
              alt={product.title}
              className="w-full h-36 sm:h-48 object-cover"
            />
            <div className="p-3">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1">
                {product.title}
              </h3>
              <p className="text-gray-800 text-sm sm:text-base mt-1">
                ₹{Number(product.price).toFixed(0)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Related;
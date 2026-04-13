// Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Search, User, Plus, LogOut, LayoutList, MessageSquare, Home } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import relayyLogo from "./relayy(logo).svg";
import { useAuth } from "./Context/AuthContext";

function Navbar({ searchQuery, setSearchQuery }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileMenuRef = useRef(null);
  const { authUser, socket } = useAuth();

  const backendURL = import.meta.env.VITE_BACKEND_URL || "https://relayy-backend-9war.onrender.com";

  const [user, setUser] = useState(null);

useEffect(() => {
  axios.get(`${backendURL}/api/v1/users/verify`, { withCredentials: true })
       .then(res => setUser(res.data.user))
       .catch(err => console.error(err));
}, []);

  // --- Sync input value with URL 'q' param when on /all-products
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    if (location.pathname.startsWith("/all-products")) {
      // only set when on product page to avoid clobbering other pages' input
      setSearchQuery(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  // Reliable navigate that forces update even if on same pathname
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = (searchQuery || "").trim();
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);

    navigate(
      {
        pathname: "/all-products",
        search: params.toString() ? `?${params.toString()}` : "",
      },
      { state: { ts: Date.now() } } // ensure a distinct navigation object so React Router updates
    );
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "/api/v1/users/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  };

  const fetchUnreadCount = async () => {
    if (!authUser) return;
    try {
      const res = await axios.get(`${backendURL}/api/v1/chats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });

      const totalUnread = res.data.reduce((count, chat) => {
        const unread = chat.messages.filter((msg) => {
          const isSender = msg.sender?._id === authUser._id || msg.sender === authUser._id;
          return !isSender && !msg.read;
        });
        return count + unread.length;
      }, 0);

      setUnreadCount(totalUnread);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, [authUser, backendURL]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (data) => {
      if (location.pathname !== "/inbox" && data.senderId !== authUser._id) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.on("new-message-notification", handleNewNotification);

    return () => {
      socket.off("new-message-notification", handleNewNotification);
    };
  }, [socket, authUser, location.pathname]);

  const hideSearch = location.pathname.startsWith("/product/");

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="w-full bg-white shadow-md px-6 md:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="flex items-center space-x-2 flex-shrink-0">
          <img src={relayyLogo} alt="Relayy Logo" className="w-9 h-9" />
          <span className="text-2xl font-extrabold text-emerald-700">RELAYY</span>
        </Link>

        {/* Center Links (Desktop Only) */}
        <div className="hidden md:flex items-center space-x-7 font-medium ml-8 flex-grow-0">
          <Link to="/home" className={`relative text-gray-700 hover:text-emerald-700 transition ${isActive("/home") ? "text-emerald-700 font-semibold before:absolute before:-bottom-1 before:left-0 before:w-full before:h-0.5 before:bg-emerald-600" : ""}`}>
            Home
          </Link>
          <Link to="/all-products" className={`relative text-gray-700 hover:text-emerald-700 transition ${isActive("/all-products") ? "text-emerald-700 font-semibold before:absolute before:-bottom-1 before:left-0 before:w-full before:h-0.5 before:bg-emerald-600" : ""}`}>
            Browse
          </Link>

          {authUser && (
            <Link to="/inbox" className={`relative text-gray-700 hover:text-emerald-700 transition flex items-center gap-1 ${isActive("/inbox") ? "text-emerald-700 font-semibold before:absolute before:-bottom-1 before:left-0 before:w-full before:h-0.5 before:bg-emerald-600" : ""}`}>
              Messages
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ml-1 animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )}

          <Link to="/contact" className={`relative text-gray-700 hover:text-emerald-700 transition ${isActive("/contact") ? "text-emerald-700 font-semibold before:absolute before:-bottom-1 before:left-0 before:w-full before:h-0.5 before:bg-emerald-600" : ""}`}>
            Contact Us
          </Link>
          <Link to="/about" className={`relative text-gray-700 hover:text-emerald-700 transition ${isActive("/about") ? "text-emerald-700 font-semibold before:absolute before:-bottom-1 before:left-0 before:w-full before:h-0.5 before:bg-emerald-600" : ""}`}>
            About Us
          </Link>
        </div>

        {/* Right Section: Search + Buttons */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Desktop Search */}
          {!hideSearch && (
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center">
              <div className="items-center bg-gray-100 border border-gray-200 rounded-full px-4 py-2 w-80 shadow-inner focus-within:ring-2 focus-within:ring-emerald-300 transition-all duration-200 flex">
                <Search className="w-5 h-5 text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none bg-transparent text-gray-800 placeholder-gray-500 text-base"
                />
              </div>
            </form>
          )}

          {/* List an Item */}
          <Link to="/sell" className="hidden md:flex items-center bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-5 py-2.5 rounded-full font-semibold hover:from-emerald-700 hover:to-emerald-800 transition shadow-md whitespace-nowrap">
            <Plus className="w-5 h-5 mr-2" />
            List an Item
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
    onClick={() => setIsProfileOpen(!isProfileOpen)}
    className="rounded-full p-0.5 bg-gradient-to-br from-emerald-200 via-emerald-400 to-emerald-500 hover:opacity-90 transition"
    title="Account"
  >
    <img
  src={`https://ui-avatars.com/api/?name=${user?.username || "A"}&background=fff&color=10755e&size=64&bold=true`}
  alt="User Avatar"
  className="w-9 h-9 rounded-full border-2 border-white"
/>

  </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-white rounded-lg shadow-xl z-50 py-2 border border-gray-100 animate-fade-in-down">
                <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition">
                  <User className="w-4 h-4 mr-2 text-emerald-500" /> My Profile
                </Link>
                <Link to="/inbox" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition">
                  <MessageSquare className="w-4 h-4 mr-2 text-emerald-500" /> Messages
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition">
                  <LogOut className="w-4 h-4 mr-2 text-red-500" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      {!hideSearch && (
        <MobileSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchSubmit={handleSearchSubmit}
        />
      )}

      {/* Bottom Navbar (Mobile) */}
      <BottomNavbar isActive={isActive} unreadCount={unreadCount} />
    </>
  );
}

/* MobileSearchBar component */
function MobileSearchBar({ searchQuery, setSearchQuery, handleSearchSubmit }) {
  return (
    <div className="lg:hidden w-full bg-white px-6 pb-2 pt-2 shadow-sm border-b border-gray-100">
      <form onSubmit={handleSearchSubmit}>
        <div className="flex items-center bg-gray-100 border border-gray-200 rounded-full px-4 py-2 shadow-inner focus-within:ring-2 focus-within:ring-emerald-300 transition-all duration-200">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none bg-transparent text-gray-800 placeholder-gray-500 text-base"
          />
          <button type="submit" className="text-emerald-600 hover:text-emerald-700 transition ml-2 p-1 rounded-full">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

/* BottomNavbar component */
function BottomNavbar({ isActive, unreadCount }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 z-40 md:hidden flex items-center justify-around shadow-lg px-2">
      <Link to="/home" className={`flex flex-col items-center justify-center p-2.5 flex-1 transition-colors ${isActive("/home") ? "text-emerald-600" : "text-gray-500 hover:text-emerald-500"}`}>
        <Home className="w-6 h-6" />
        <span className="text-xs font-medium">Home</span>
      </Link>

      <Link to="/all-products" className={`flex flex-col items-center justify-center p-2.5 flex-1 transition-colors ${isActive("/all-products") ? "text-emerald-600" : "text-gray-500 hover:text-emerald-500"}`}>
        <LayoutList className="w-6 h-6" />
        <span className="text-xs font-medium">Browse</span>
      </Link>

      <Link to="/sell" className="p-4 bg-emerald-600 rounded-full text-white shadow-xl hover:bg-emerald-700 transition transform hover:scale-105 flex-shrink-0 mx-4">
        <Plus className="w-6 h-6" />
      </Link>

      <Link to="/inbox" className={`flex flex-col items-center justify-center p-2.5 relative flex-1 transition-colors ${isActive("/inbox") ? "text-emerald-600" : "text-gray-500 hover:text-emerald-500"}`}>
        <MessageSquare className="w-6 h-6" />
        <span className="text-xs font-medium">Messages</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-3 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9' : unreadCount}
          </span>
        )}
      </Link>

      <Link to="/profile" className={`flex flex-col items-center justify-center p-2.5 flex-1 transition-colors ${isActive("/profile") ? "text-emerald-600" : "text-gray-500 hover:text-emerald-500"}`}>
        <User className="w-6 h-6" />
        <span className="text-xs font-medium">Profile</span>
      </Link>
    </div>
  );
}

export default Navbar;

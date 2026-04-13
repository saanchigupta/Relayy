import React, { useState } from "react";
import { useNavigate } from "react-router";
import relayyLogo from "./relayy(logo).svg";
import { Menu, X } from "lucide-react"; // Import icons

function NavbarLanding() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close menu on navigation
  };

  return (
    <header className="relative w-full px-6 lg:px-12 py-4 flex items-center justify-between bg-emerald-50">
      {/* Logo */}
      <div
        className="flex items-center cursor-pointer z-20"
        onClick={() => handleNavigate("/")}
      >
        <img src={relayyLogo} alt="Relayy Logo" className="w-8 h-8 mr-2" />
        <span className="font-bold text-emerald-800 text-xl">RELAYY</span>
      </div>

      {/* Navigation Links (Desktop) */}
      <nav className="hidden md:flex space-x-8 font-medium text-emerald-800 absolute left-1/2 -translate-x-1/2">
        <a href="/" className="hover:text-emerald-600 transition-colors">
          Home
        </a>
        <a href="/about" className="hover:text-emerald-600 transition-colors">
          About Us
        </a>
        <a href="/contact" className="hover:text-emerald-600 transition-colors">
          Contact Us
        </a>
      </nav>

      {/* Action Buttons (Desktop) & Mobile Toggle */}
      <div className="flex items-center space-x-3">
        {/* Desktop Buttons */}
        {/* <div className="hidden md:flex space-x-3">
          <button
            onClick={() => handleNavigate("/login")}
            className="px-5 py-2 border-2 border-emerald-700 rounded-full text-emerald-700 font-semibold hover:bg-emerald-700 hover:text-white transition"
          >
            Login
          </button>
          <button
            onClick={() => handleNavigate("/signup")}
            className="px-5 py-2 bg-emerald-700 text-white rounded-full font-semibold hover:bg-emerald-800 transition"
          >
            Sign Up
          </button>
        </div> */}

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden text-emerald-800 z-20"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMobileMenuOpen && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-lg md:hidden pt-20">
          <nav className="flex flex-col p-6 space-y-4">
            <a
              href="/"
              className="font-medium text-emerald-800 hover:text-emerald-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="/about"
              className="font-medium text-emerald-800 hover:text-emerald-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </a>
            <a
              href="/contact"
              className="font-medium text-emerald-800 hover:text-emerald-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact Us
            </a>
            <hr className="border-emerald-200" />
            {/* <div className="flex flex-col space-y-3">
              <button
                onClick={() => handleNavigate("/login")}
                className="px-5 py-2 border-2 border-emerald-700 rounded-full text-emerald-700 font-semibold hover:bg-emerald-700 hover:text-white transition"
              >
                Login
              </button>
              <button
                onClick={() => handleNavigate("/signup")}
                className="px-5 py-2 bg-emerald-700 text-white rounded-full font-semibold hover:bg-emerald-800 transition"
              >
                Sign Up
              </button>
            </div> */}
          </nav>
        </div>
      )}
    </header>
  );
}

export default NavbarLanding;
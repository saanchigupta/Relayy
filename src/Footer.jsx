import React, { useState } from "react";
import { Mail } from "lucide-react";
import relayyLogo from "./relayy(logo).svg";
import { Recycle, Layers, Clock, Zap } from "lucide-react";


function Footer() {
  const [openSection, setOpenSection] = useState(null);

  const toggle = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer
      className="w-full text-emerald-100 "
      style={{
        background:
          "linear-gradient(180deg, #065F46 0%, #047857 50%, #064E3B 100%)",
        boxShadow: "inset 0 2px 10px rgba(0,0,0,0.3)",
      }}
    >
      <div className="container mx-auto px-6 py-8 md:px-20 md:py-12">

        {/* -------------------- DESKTOP FOOTER (unchanged) -------------------- */}
        <div className="hidden md:grid grid-cols-2 gap-10 border-b border-emerald-700/40 pb-10">

          {/* COLUMN 1 */}
          <div className="flex flex-col gap-10">

            {/* BRAND */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                  <img src={relayyLogo} className="w-12 h-12" alt="logo" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  RELAYY
                </h2>
              </div>

              <p className="text-sm text-emerald-100/90 leading-relaxed">
                The campus marketplace for sustainable living. Buy, sell, and reduce waste within your institution’s community.
              </p>

              <a
                href="/signup"
                className="inline-flex px-6 py-2 mt-6 border border-emerald-300 text-sm rounded-md shadow-sm text-emerald-100 hover:bg-emerald-300 hover:text-emerald-900 transition"
              >
                GET STARTED
              </a>
            </div>

            {/* COMPANY */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white mb-4">
                COMPANY
              </h3>
              <ul className="space-y-2 text-base text-emerald-200">
                <li><a href="/about" className="hover:text-white">About Us</a></li>
                <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>

          </div>

          {/* CAMPUS CIRCULAR ECONOMY – DESKTOP */}
<div>
  <h3 className="text-sm font-semibold uppercase text-white tracking-wide mb-4">
    CAMPUS CIRCULAR ECONOMY
  </h3>

  <div className="space-y-4 text-emerald-200">

    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-emerald-800/40 flex justify-center items-center">
        <Recycle className="w-5 h-5 text-emerald-300" />
      </div>
      <p className="leading-snug">
        Reduce waste by extending product life inside your own campus community.
      </p>
    </div>

    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-emerald-800/40 flex justify-center items-center">
        <Layers className="w-5 h-5 text-emerald-300" />
      </div>
      <p className="leading-snug">
        Make exchanges faster and smarter with peer-to-peer reuse.
      </p>
    </div>

    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-emerald-800/40 flex justify-center items-center">
        <Clock className="w-5 h-5 text-emerald-300" />
      </div>
      <p className="leading-snug">
        Save time, money, and effort by accessing essentials right on campus.
      </p>
    </div>

    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-emerald-800/40 flex justify-center items-center">
        <Zap className="w-5 h-5 text-emerald-300" />
      </div>
      <p className="leading-snug">
        Enable a cleaner future with small actions that create campus-wide impact.
      </p>
    </div>

  </div>
</div>








        </div>

        {/* -------------------- MOBILE FOOTER (accordion) -------------------- */}
        <div className="md:hidden border-b border-emerald-700/40 pb-8 space-y-4">

          {/* BRAND SECTION */}
          <div>
            <button
              className="flex justify-between items-center w-full py-3"
              onClick={() => toggle("brand")}
            >
              <span className="font-semibold text-white text-base">About Relayy</span>
              <span className="text-xl">{openSection === "brand" ? "−" : "+"}</span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openSection === "brand" ? "max-h-80" : "max-h-0"
              }`}
            >
              <div className="pt-2">
                <p className="text-sm text-emerald-100/90 leading-relaxed">
                  The campus marketplace for sustainable living. Buy, sell, and reduce waste within your institution’s community.
                </p>

                <a
                  href="/signup"
                  className="inline-flex px-6 py-2 mt-4 border border-emerald-300 text-sm rounded-md shadow-sm text-emerald-100 hover:bg-emerald-300 hover:text-emerald-900 transition"
                >
                  GET STARTED
                </a>
              </div>
            </div>
          </div>

          {/* COMPANY SECTION */}
          <div>
            <button
              className="flex justify-between items-center w-full py-3"
              onClick={() => toggle("company")}
            >
              <span className="font-semibold text-white text-base">Company</span>
              <span className="text-xl">{openSection === "company" ? "−" : "+"}</span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openSection === "company" ? "max-h-40" : "max-h-0"
              }`}
            >
              <ul className="pt-2 space-y-2 text-base text-emerald-200">
                <li><a href="/about" className="hover:text-white">About Us</a></li>
                <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
          </div>

          {/* CAMPUS CIRCULAR ECONOMY – MOBILE */}
<div>
  <button
    className="flex justify-between items-center w-full py-3"
    onClick={() => toggle("circular")}
  >
    <span className="font-semibold text-white text-base">Campus Circular Economy</span>
    <span className="text-xl">{openSection === "circular" ? "−" : "+"}</span>
  </button>

  <div
    className={`overflow-hidden transition-all duration-300 ${
      openSection === "circular" ? "max-h-[500px]" : "max-h-0"
    }`}
  >
    <div className="pt-2 space-y-4">

      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-800/40 flex justify-center items-center">
          <Recycle className="w-5 h-5 text-emerald-300" />
        </div>
        <p className="text-sm text-emerald-100/90 leading-snug">
          Reduce waste by extending product life within campus.
        </p>
      </div>

      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-800/40 flex justify-center items-center">
          <Layers className="w-5 h-5 text-emerald-300" />
        </div>
        <p className="text-sm text-emerald-100/90 leading-snug">
          Smarter peer-to-peer reuse for students.
        </p>
      </div>

      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-800/40 flex justify-center items-center">
          <Clock className="w-5 h-5 text-emerald-300" />
        </div>
        <p className="text-sm text-emerald-100/90 leading-snug">
          Save time and money by accessing essentials nearby.
        </p>
      </div>

      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-800/40 flex justify-center items-center">
          <Zap className="w-5 h-5 text-emerald-300" />
        </div>
        <p className="text-sm text-emerald-100/90 leading-snug">
          Your actions contribute to a cleaner, smarter campus.
        </p>
      </div>

    </div>
  </div>
</div>


        </div>

        {/* ----------------- BOTTOM ----------------- */}
        <div className="text-center text-xs text-emerald-200 mt-6 pt-6">
          © 2025 Moon |
          <a href="/terms" className="underline ml-1 hover:text-white">Terms</a> |
          <a href="/privacy" className="underline ml-1 hover:text-white">Privacy</a>
        </div>

      </div>
    </footer>
  );
}

export default Footer;

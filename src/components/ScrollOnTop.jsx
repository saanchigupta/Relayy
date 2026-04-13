// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router";

export default function ScrollOnTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]); // run every time route changes

  return null; // no UI
}

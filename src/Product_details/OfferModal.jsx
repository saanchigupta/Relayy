import React, { useState, useEffect } from "react";
import axios from "axios";

const CloseIcon = () => (
  <svg className="w-6 h-6 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

const ModalIcon = () => (
  <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
  </svg>
);

export default function OfferModal({
  productId,
  productName,
  currentPrice,
  onClose,
}) {
  const [offerAmount, setOfferAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const handleClose = () => {
    setIsMounted(false);
    setTimeout(onClose, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!offerAmount || parseFloat(offerAmount) <= 0)
      return alert("Please enter a valid offer amount.");

    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser || !currentUser._id)
      return alert("Please log in to make an offer.");

    setLoading(true);
    try {
      const payload = {
        productId,
        buyerId: currentUser._id, // ✅ send only buyerId
        offerAmount,
        message,
      };

      console.log("📤 Sending Offer Payload:", payload);

      await axios.post("https://relayy-backend-9war.onrender.com/api/send-offer", payload);
      alert("✅ Offer submitted! Seller has been notified.");
      setOfferAmount("");
      setMessage("");
      handleClose();
    } catch (error) {
      console.error("❌ Error sending offer:", error);
      alert("Failed to send offer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center p-4 z-50 transition-opacity duration-300 ${
        isMounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative transform transition-all duration-300 ${
          isMounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <CloseIcon />
        </button>

        <div className="mx-auto flex items-center justify-center h-16 w-16 bg-emerald-100 rounded-full">
          <ModalIcon />
        </div>

        <div className="mt-3 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Make an Offer</h2>
          <p className="text-gray-600 mb-6">
            You're offering on{" "}
            <span className="font-semibold">"{productName}"</span>. Current price:{" "}
            <span className="font-bold">₹{currentPrice}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="offerAmount" className="block text-gray-700 text-sm font-bold mb-2">
              Your Offer Amount (₹)
            </label>
            <input
              type="number"
              id="offerAmount"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              placeholder="e.g., 34000"
              className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
              Message to Seller (Optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="3"
              placeholder="e.g., 'I can pick this up tomorrow if you accept!'"
              className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-emerald-500"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-bold shadow-md transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
              }`}
            >
              {loading ? "Sending..." : "Submit Offer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

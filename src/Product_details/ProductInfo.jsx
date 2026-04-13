import React, { useState } from "react";
import OfferModal from "./OfferModal";
import RelayyChat from "../components/RelayyChat";
import { useAuth } from "../Context/AuthContext";

// --- SVG ICONS ---
const MessageIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
  </svg>
);

const OfferIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5l7 7-7 7H7V3z"></path>
  </svg>
);

// --- Rating Stars ---
const Star = ({ fill, half }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <defs>
      {half && (
        <clipPath id="half-star">
          <rect x="0" y="0" width="12" height="24" />
        </clipPath>
      )}
    </defs>
    <path
      d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
      fill={fill}
      clipPath={half ? "url(#half-star)" : ""}
    />
  </svg>
);

export default function ProductInfo({ product, currentUser }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const { authUser } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const description = product.description || "No description available.";
  const canTruncate = description.length > 150;
  const displayDescription =
    canTruncate && !isExpanded ? `${description.substring(0, 150)}...` : description;

  // ✅ Check if logged-in user owns this product
  const isOwner = authUser?._id === product.userId;

  return (
    <div className="lg:sticky lg:top-8 flex flex-col gap-6">
      {/* --- Description Card --- */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-3">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
            {product.title || "Product Title"}
          </h1>
          <span className="flex-shrink-0 bg-emerald-100 text-emerald-700 text-2xl font-bold px-4 py-2 rounded-lg">
            ₹{product.price || "0.00"}
          </span>
        </div>
        <p className="text-gray-800 text-base leading-relaxed">{displayDescription}</p>
        {canTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-emerald-700 font-semibold mt-2 hover:underline"
          >
            {isExpanded ? "Read less" : "Read more"}
          </button>
        )}
      </div>

      {/* --- Seller Info --- */}
      <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center border border-gray-100">
        <div className="flex items-center mb-4 sm:mb-0">
          <img
            src={`https://ui-avatars.com/api/?name=${product.username || "Seller"}&background=random`}
            alt={product.username || "Seller"}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <p className="text-sm text-gray-500">Sold By</p>
            <p className="text-lg font-semibold text-gray-900">{product.username}</p>
            {product.userEmail && (
              <p className="text-sm text-gray-700">{product.userEmail}</p>
            )}
            {product.userHostel && (
              <p className="text-sm text-gray-700">{product.userHostel}</p>
            )}
          </div>
        </div>
      </div>

      {/* --- Action Buttons --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ✅ If product is listed by current user */}
        {isOwner ? (
          <div className="col-span-2 flex flex-col items-center justify-center bg-yellow-50 border border-yellow-200 rounded-lg py-4">
            <p className="text-lg font-semibold text-yellow-700">
              This is your own listing
            </p>
            <p className="text-sm text-gray-600 mt-1">
              You can edit or delete it from your profile page.
            </p>
          </div>
        ) : (
          <>
            {/* CHAT WITH SELLER */}
            {!authUser ? (
              <button
                onClick={() => (window.location.href = "/login")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
              >
                <MessageIcon />
                Login to Chat
              </button>
            ) : (
              <button
                onClick={() => setIsChatOpen(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
              >
                <MessageIcon />
                Chat with Seller
              </button>
            )}

            {/* MAKE OFFER */}
            <button
              onClick={() => setIsOfferModalOpen(true)}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white text-lg font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
            >
              <OfferIcon />
              Make Offer
            </button>
          </>
        )}
      </div>

      {/* --- Offer Modal --- */}
      {isOfferModalOpen && (
        <OfferModal
          productId={product._id}
          productName={product.title}
          currentPrice={product.price}
          productImage={product.imageUrls?.[0]}
          buyerName={currentUser?.name}
          buyerEmail={currentUser?.email}
          onClose={() => setIsOfferModalOpen(false)}
        />
      )}

      {/* --- Chat Modal --- */}
      {isChatOpen && authUser && !isOwner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="w-full max-w-4xl h-full max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden">
            <RelayyChat
              receiverId={product.userId}
              productId={product._id}
              receiverName={product.username}
              onClose={() => setIsChatOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Loader2, School, MapPin, Phone } from "lucide-react";

const Hero = () => {
  const [user, setUser] = useState(null);
  const [myAds, setMyAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const backendURL = "https://relayy-backend-9war.onrender.com";

  useEffect(() => {
    const fetchUserAndAds = async () => {
      try {
        const userRes = await axios.get(`${backendURL}/api/v1/users/verify`, {
          withCredentials: true,
        });
        setUser(userRes.data.user);

        const adsRes = await axios.get(`${backendURL}/api/v1/products/my`, {
          withCredentials: true,
        });
        setMyAds(adsRes.data);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndAds();
  }, [backendURL, navigate]);


  if (loading)
    return (
      <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );

  return (
    <div className="w-full bg-white min-h-screen font-sans">

      {/* TOP BANNER */}
      <div className="w-full h-40 bg-gradient-to-r from-emerald-600 to-emerald-700"></div>

      <div className="max-w-5xl mx-auto px-6 relative">

        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mt-[-4rem]">
          <div className="flex flex-col items-center text-center">

            {/* Avatar (UNCHANGED) */}
            <div className="relative w-32 h-32 mx-auto mb-4 p-1 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-600 shadow-md">
              <img
                src={`https://ui-avatars.com/api/?name=${user?.username || "A"}&background=fff&color=10755e&size=128&bold=true`}
                alt="Profile Avatar"
                className="w-full h-full rounded-full border-4 border-white"
              />
            </div>

            {/* Name & Email */}
            <h2 className="text-3xl font-bold text-gray-900">{user?.username}</h2>
            <p className="text-gray-600 text-sm mt-1">{user?.email}</p>

            {/* User Info */}
            <div className="mt-5 space-y-2 text-gray-700 text-sm">
              <p className="flex justify-center items-center">
                <School size={16} className="mr-2 text-emerald-600" />
                {user?.college || "Campus University"}
              </p>
              <p className="flex justify-center items-center">
                <MapPin size={16} className="mr-2 text-emerald-600" />
                {user?.hostel || "Campus Hostel"}
              </p>
              {user?.mobile && (
                <p className="flex justify-center items-center">
                  <Phone size={16} className="mr-2 text-emerald-600" />
                  {user.mobile}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => navigate("/edit-profile")}
                className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
              >
                Edit Profile
              </button>

              {/* delete button */}
              {/* <button
              onClick={handleDeleteProfile}
                className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition"
              >
              {isDeleting ? <Loader2 className="animate-spin w-5 h-5" /> : "Delete Profile"}
              
              </button> */}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-gray-200 my-10"></div>

        {/* LISTINGS */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Your Listings ({myAds.length})
          </h3>

          {myAds.length === 0 ? (
            <p className="text-gray-600 text-lg">No items listed yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

              {myAds.map((ad) => (
                <div
                  key={ad._id}
                  onClick={() => navigate(`/Myproduct/${ad._id}`)}
                  className="cursor-pointer bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={
                        ad.imageUrls?.[0] ||
                        "https://placehold.co/300x300/e2e8f0/64748b?text=No+Image"
                      }
                      alt={ad.title}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Text */}
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-gray-900 truncate">
                      {ad.title}
                    </h4>
                    <p className="text-emerald-700 text-xl font-bold mt-1">
                      ₹{ad.price}
                    </p>
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>

        <div className="h-20" />
      </div>
    </div>
  );
};

export default Hero;

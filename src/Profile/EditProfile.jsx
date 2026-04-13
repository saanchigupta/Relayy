// EditProfile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2, User, School, MapPin, Save, ArrowLeft } from "lucide-react";

const EditProfile = () => {
  const navigate = useNavigate();
  const backendURL = "https://relayy-backend-9war.onrender.com";

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    college: "",
    hostel: "",
  });
  const [loading, setLoading] = useState(true);
  const [hostelOptions, setHostelOptions] = useState([]); // array of strings
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Local mapping (single source of truth on client)
  const collegeHostels = {
    "Thapar University": [
      "Agira Hall",
      "Ambaram Hall",
      "Amritam Hall",
      "Ananta Hall",
      "Anantam Hall",
      "Dhriti Hall",
      "Neeram Hall",
      "Prithvi Hall",
      "Tejas Hall",
      "Vahni Hall",
      "Viyat Hall",
      "Vyan Hall",
      "Vyom Hall",
    ],
    "Manipal University Jaipur": ["Good Hostel Space (GHS)"],
    "NIT Jalandhar": ["Aryabhatta Hostel", "Tagore Hostel"],
    "IIT Ropar": ["Satluj Hostel", "Beas Hostel"],
  };

  // Fetch user on mount (verify) and set hostel options from local mapping
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backendURL}/api/v1/users/verify`, { withCredentials: true });
        const u = res.data.user;
        setUser(u);
        setFormData({
          username: u.username || "",
          email: u.email || "",
          college: u.college || "",
          hostel: u.hostel || "",
        });

        // Set hostel options from the local mapping only (no backend call)
        const hostels = collegeHostels[u.college] || [];
        setHostelOptions(hostels);
      } catch (err) {
        console.error("Failed to fetch user data for editing:", err);
        // not authenticated or error -> go to login
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError(null);
    if (successMessage) setSuccessMessage(null);
  };

  // When user selects a hostel from dropdown, update formData.hostel
  const handleHostelSelect = (e) => {
    setFormData((p) => ({ ...p, hostel: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Build payload: send username & hostel
      const payload = {
        username: formData.username,
        hostel: formData.hostel,
      };

      const updateRes = await axios.patch(`${backendURL}/api/v1/users/updateMe`, payload, {
        withCredentials: true,
      });

      setUser(updateRes.data.user);
      setSuccessMessage("Profile updated successfully!");
      // redirect after brief pause
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err) {
      console.error("Update failed:", err);
      const errMsg = err.response?.data?.message || "Failed to update profile. Please try again.";
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  // Render
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 ">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <h1 className="text-3xl font-extrabold text-gray-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-800">
              Edit Your Profile
            </span>
          </h1>
          <button onClick={() => navigate("/profile")} className="flex items-center text-gray-600 hover:text-emerald-600 transition">
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to Profile
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700 flex items-center">
              <User className="w-4 h-4 mr-2 text-emerald-600" /> Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 shadow-sm"
            />
          </div>

          {/* College (read-only) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <School className="w-4 h-4 mr-2 text-emerald-600" /> College/University
            </label>
            <input
              type="text"
              value={formData.college || ""}
              readOnly
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
            />
          </div>

          {/* Hostel field — SELECT if hostels available, else fallback to text input */}
          <div className="space-y-2">
            <label htmlFor="hostel" className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-emerald-600" /> Hostel/Residence
            </label>

            {Array.isArray(hostelOptions) && hostelOptions.length > 0 ? (
              <select
                id="hostel"
                name="hostel"
                value={formData.hostel || ""}
                onChange={handleHostelSelect}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 shadow-sm bg-white"
              >
                <option value="" disabled>
                  Select your hostel
                </option>
                {hostelOptions.map((h, idx) => (
                  <option key={idx} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            ) : (
              // fallback input if we have no hostel list
              <input
                type="text"
                id="hostel"
                name="hostel"
                value={formData.hostel}
                onChange={handleChange}
                placeholder="e.g., Himalaya Hostel"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 shadow-sm"
              />
            )}
          </div>

          {/* Status messages */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {successMessage && (
            <div className="bg-emerald-100 border border-emerald-400 text-emerald-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg transition-all duration-300 ${
              isSubmitting ? "bg-emerald-400 cursor-not-allowed" : "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 transform hover:scale-[1.01]"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-3" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-3" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

import axios from "axios";
import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Header from "../components/Header";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";

function Register() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode");

  const [isLogin, setIsLogin] = useState(mode !== "signup");
  const [isLoading, setIsLoading] = useState(false); // ✅ Loader state

  useEffect(() => {
    setIsLogin(mode !== "signup");
  }, [mode]);

  // ✅ Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();

// inside your Register component handlers (replace existing handlers)

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    setIsLoading(true);
    const res = await axios.post(
      "http://localhost:8000/api/v1/users/login",
      { username, password }
    );

    // Try to extract a user object from common API shapes:
    const user = res.data?.user || res.data?.data || res.data || null;
    const token = res.data?.token || (res.data?.data && res.data.data.token) || null;

    if (token) localStorage.setItem("token", token);
    if (user) {
      // ensure user has an email property (backend should return it)
      localStorage.setItem("user", JSON.stringify(user));
      if (user.email) localStorage.setItem("userEmail", user.email);
    } else if (res.data?.email) {
      // fallback: backend returned just an email
      localStorage.setItem("userEmail", res.data.email);
      localStorage.setItem("user", JSON.stringify({ email: res.data.email, username }));
    }

    // small delay for loader UX
    setTimeout(() => {
      setIsLoading(false);
      navigate("/home");
    }, 800);
  } catch (err) {
    setIsLoading(false);
    console.error(err.response?.data || err.message);
    alert(err.response?.data?.message || "Login failed");
  }
};

const handleSignup = async (e) => {
  e.preventDefault();
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    setIsLoading(true);
    const res = await axios.post(
      "https://relayy-backend-9war.onrender.com/api/v1/users/register",
      { username, email, password }
    );

    // Extract returned user and/or token if backend returns them
    const user = res.data?.user || res.data?.data || (res.data?.email ? { email: res.data.email, username } : null);
    const token = res.data?.token || (res.data?.data && res.data.data.token) || null;

    if (token) localStorage.setItem("token", token);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      if (user.email) localStorage.setItem("userEmail", user.email);
    } else {
      // If backend doesn't return user, we have at least the email from the form:
      localStorage.setItem("userEmail", email);
      localStorage.setItem("user", JSON.stringify({ email, username }));
    }

    setTimeout(() => {
      setIsLoading(false);
      navigate("/home");
    }, 800);
  } catch (err) {
    setIsLoading(false);
    console.error(err.response?.data || err.message);
    alert(err.response?.data?.message || "Signup failed");
  }
};


  // ---------------- VERIFY OTP ----------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://relayy-backend-9war.onrender.com/api/v1/users/verify-otp", {
        email,
        otp,
      });
      alert("Email verified successfully! You can now login.");
      setIsLogin(true);
      setShowOtp(false);
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setOtp("");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className=" relative">
      {/* ✅ Loader Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 flex justify-center items-center z-50 transition-opacity duration-300">
          <div className="loader"></div>
        </div>
      )}

      {/* ✅ Navbar */}
      <div className="w-full">
        <Navbar />
      </div>

      {/* Header */}
      <Header title={isLogin ? "Login" : "Signup"} />

      {/* Main Form Area */}
      <div className="flex-grow flex justify-center items-center py-10 bg-white">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg grid md:grid-cols-2 overflow-hidden">
          {/* Form Section */}
          <div className="p-8">
            <h3 className="text-2xl font-bold mb-3">{isLogin ? "Login" : "Signup"}</h3>
            <p className="text-sm text-gray-500 mb-6">
              {isLogin ? (
                <>
                  Do not have an account?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-purple-700 font-medium hover:underline"
                  >
                    Create a new one.
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-purple-700 font-medium hover:underline"
                  >
                    Login
                  </button>
                </>
              )}
            </p>

            {/* ---------------- LOGIN FORM ---------------- */}
            {isLogin ? (
              <form className="space-y-4" onSubmit={handleLogin}>
                <div>
                  <label className="text-sm text-gray-600">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
                >
                  Login
                </button>

                <div className="text-center">
                  <a href="/forgot" className="text-xs text-gray-500 hover:underline">
                    Forgot Your Password?
                  </a>
                </div>
              </form>
            ) : (
              // ---------------- SIGNUP FORM ----------------
              <>
                <form className="space-y-4" onSubmit={handleSignup}>
                  <div>
                    <label className="text-sm text-gray-600">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">College Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="w-4 h-4" required />
                    <span>
                      I have read and agreed to the Terms of Service and Privacy Policy
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
                  >
                    Create Account
                  </button>
                </form>

                {/* ---------------- OTP FORM ---------------- */}
                {showOtp && (
                  <form className="space-y-4 mt-4" onSubmit={handleVerifyOtp}>
                    <div>
                      <label className="text-sm text-gray-600">Enter OTP sent to your email</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      Verify OTP
                    </button>
                  </form>
                )}
              </>
            )}
          </div>

          {/* Right Side (Gray Placeholder) */}
          <div className="hidden md:block bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}

export default Register;

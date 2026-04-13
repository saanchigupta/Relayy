import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import NavbarLanding from "../NavbarLanding";
import loginimg from "./loginimage.png";
import { useAuth } from "../Context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");        // ⬅️ email instead of username
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const backendURL = "https://relayy-backend-9war.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${backendURL}/api/v1/users/login`,
        { email, password },                     // ⬅️ send email
        { withCredentials: true }
      );

      const { user, token } = res.data || {};

      // Optional: Only set cookie if backend doesn't issue HttpOnly cookie
      if (token) {
        Cookies.set("auth_token", token, {
          expires: 1 / 24,
          sameSite: "Strict",
        });
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      login(user, token);
      navigate("/home");
    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data ||
        err.message;

      console.error("Login failed:", backendMessage);
      setError(backendMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarLanding />

      {isLoading && (
        <div className="fixed inset-0 bg-white/80 flex justify-center items-center z-50">
          <div className="loader border-4 border-emerald-700 border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
        </div>
      )}

      <main className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 flex-wrap">
          {/* LEFT SECTION */}
          <div
            className="w-full lg:w-1/2 flex items-start justify-center p-8 lg:p-12 order-1 lg:order-1"
            style={{
              background:
                "linear-gradient(to bottom right, #D1FAE5, #FFFFFF, #A7F3D0)",
            }}
          >
            <div className="layout-content-container flex flex-col max-w-[480px] w-full">
              <div className="flex flex-col gap-3 pb-8 text-center lg:text-left">
                <p className="text-4xl font-black leading-tight tracking-tight text-gray-900">
                  Welcome Back!
                </p>
                <p className="text-emerald-700 text-base font-normal">
                  Your campus marketplace awaits.
                </p>
              </div>

              {/* Tabs */}
              <div className="pb-3">
                <div className="flex border-b border-emerald-300 gap-8">
                  <button className="flex-1 py-4 border-b-[3px] border-b-emerald-700 text-emerald-700 font-bold">
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="flex-1 py-4 border-b-[3px] border-b-transparent text-emerald-500 hover:text-emerald-700 transition"
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              {/* FORM */}
              <form onSubmit={handleLogin} className="flex flex-col gap-4 py-6">
                {/* Email */}
                <label className="flex flex-col">
                  <p className="text-base font-medium pb-2">College Email</p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl h-14 p-4 bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800"
                    placeholder="Enter your college email"
                    required
                  />
                </label>

                {/* Password */}
                <label className="flex flex-col">
                  <p className="text-base font-medium pb-2">Password</p>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-xl h-14 p-4 pr-12 bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800 w-full"
                      placeholder="Enter your password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-700 hover:text-emerald-900"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </label>

                {/* Error message (optional UI) */}
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <a
                    href="/forgot"
                    className="text-sm font-medium text-emerald-700 hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="gradient-button flex items-center justify-center h-12 rounded-xl text-white text-base font-bold bg-gradient-to-r from-emerald-700 to-emerald-600 hover:opacity-90 transition"
                >
                  Login
                </button>

                <p className="text-sm text-emerald-700 text-center pt-6">
                  By continuing, you agree to our{" "}
                  <a
                    href="/terms"
                    className="font-medium text-emerald-700 hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="font-medium text-emerald-700 hover:underline"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </form>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="w-full lg:w-1/2 flex items-center justify-center order-1 lg:order-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-200 opacity-30"></div>
            <img
              src={loginimg}
              alt="Campus illustration"
              className="w-full h-full object-cover relative z-10"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;

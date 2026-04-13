import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarLanding from "../NavbarLanding";
import loginimg from "./loginimage.png";
import { Eye, EyeOff } from "lucide-react";


function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [autoDetected, setAutoDetected] = useState(false);
  const [hostel, setHostel] = useState("");
  const [hostelOptions, setHostelOptions] = useState([]); // ✅ Dynamic hostel list
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState(""); // <-- new
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState(""); // <-- new
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const backendURL = "https://relayy-backend-9war.onrender.com";

  // ✅ College dropdown options (fallback)
  const collegeOptions = [
    "Thapar University",
    "Manipal University Jaipur",
    "NIT Jalandhar",
    "IIT Ropar",
  ];

  // ✅ Email domain → college mapping (only these domains allowed)
  const domainToCollege = {
    "thapar.edu": "Thapar University",
    "muj.manipal.edu": "Manipal University Jaipur",
    "nitj.ac.in": "NIT Jalandhar",
    "iitrpr.ac.in": "IIT Ropar",
  };

  // ✅ Hostel data grouped by college
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

  // helper: extract domain safely and normalize
  const extractDomain = (emailStr) => {
    if (!emailStr || typeof emailStr !== "string") return "";
    const parts = emailStr.trim().toLowerCase().split("@");
    return parts.length === 2 ? parts[1] : "";
  };

  // simple mobile validator (10 digits)
  const validateMobile = (m) => {
    if (!m) return ""; // allow empty (optional)
    const digits = String(m).trim();
    if (!/^[0-9]{10}$/.test(digits)) return "Enter a valid 10-digit mobile number.";
    return "";
  };

  // Handle email input → must be one of allowed domains
  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setEmailError(""); // reset

    const domain = extractDomain(inputEmail);

    // Only allow emails whose domain exists in domainToCollege
    if (domain && domainToCollege[domain]) {
      const detectedCollege = domainToCollege[domain];
      setCollege(detectedCollege);
      setAutoDetected(true);
      setHostelOptions(collegeHostels[detectedCollege] || []);
      setEmailError("");
    } else {
      // Not an allowed domain — block
      setCollege("");
      setAutoDetected(false);
      setHostelOptions([]);
      if (inputEmail.trim() === "") {
        setEmailError("");
      } else {
        setEmailError("Only official college emails are allowed.");
      }
    }
  };

  // Handle manual college change (if you still want user to pick college)
  const handleCollegeChange = (e) => {
    const selectedCollege = e.target.value;
    setCollege(selectedCollege);
    setHostelOptions(collegeHostels[selectedCollege] || []);
    setAutoDetected(false); // since user manually selected
  };

  // Mobile change handler + validation
  const handleMobileChange = (e) => {
    const val = e.target.value;
    // Allow only digits in input (helps UX)
    if (val && !/^[0-9]*$/.test(val)) return;
    setMobile(val);
    const err = validateMobile(val);
    setMobileError(err);
  };

  // Handle Signup Submit (strict domain check)
  const handleSignup = async (e) => {
    e.preventDefault();

    const domain = extractDomain(email);

    // The email must belong exactly to one of the allowed domains
    if (!domain || !domainToCollege[domain]) {
      setEmailError(
        "Signup blocked: please use your official college email from the supported colleges."
      );
      return;
    }

    // Ensure selected college matches the email's college
    const emailCollege = domainToCollege[domain];
    if (college !== emailCollege) {
      setEmailError(
        `Email domain belongs to "${emailCollege}". Please select that college or use the corresponding college email.`
      );
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Validate mobile one more time before sending
    const finalMobileErr = validateMobile(mobile);
    if (finalMobileErr) {
      setMobileError(finalMobileErr);
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${backendURL}/api/v1/users/signup`,
        { username, email, college, hostel, password, mobile },
        { withCredentials: true }
      );

      alert(res.data.message || "OTP sent to your email. Please verify.");
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Signup failed. Please try again.";
      alert(backendMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarLanding />

      {/* Loader */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 flex justify-center items-center z-50">
          <div className="loader border-4 border-emerald-700 border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
        </div>
      )}

      <main className="layout-container flex flex-col flex-1">
        <div className="flex flex-1 flex-wrap">
          {/* LEFT SECTION */}
          <div
            className="w-full lg:w-1/2 flex items-start justify-center p-8 lg:p-12 order-1 lg:order-1"
            style={{
              background:
                "linear-gradient(to bottom right, #D1FAE5, #FFFFFF, #A7F3D0)",
            }}
          >
            <div className="max-w-[480px] w-full">
              <div className="text-center lg:text-left pb-8">
                <h1 className="text-4xl font-black text-gray-900 leading-tight">
                  Create Your Account
                </h1>
                <p className="text-emerald-700 text-base">
                  Join your campus marketplace today.
                </p>
              </div>

              {/* Tabs */}
              <div className="pb-3 border-b border-emerald-300 flex gap-8">
                <button
                  onClick={() => navigate("/login")}
                  className="flex-1 py-4 border-b-[3px] border-b-transparent text-emerald-500 hover:text-emerald-700 transition"
                >
                  Login
                </button>
                <button className="flex-1 py-4 border-b-[3px] border-b-emerald-700 text-emerald-700 font-bold">
                  Sign Up
                </button>
              </div>

              {/* FORM */}
              <form onSubmit={handleSignup} className="flex flex-col gap-4 py-6">
                {/* Username */}
                <label className="flex flex-col">
                  <p className="text-base font-medium pb-2">Username</p>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="rounded-xl h-14 p-4 bg-emerald-100 focus:ring-2 focus:ring-emerald-400 outline-none"
                    placeholder="Enter your username"
                    required
                  />
                </label>

                {/* Email */}
                <label className="flex flex-col">
                  <p className="text-base font-medium pb-2">College Email</p>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    className="rounded-xl h-14 p-4 bg-emerald-100 focus:ring-2 focus:ring-emerald-400 outline-none"
                    placeholder="Enter your college email"
                    required
                  />
                  {/* Inline validation message */}
                  {emailError && (
                    <p className="text-sm text-red-600 pt-2">{emailError}</p>
                  )}
                </label>
                
                  {/* Mobile */}
                <label className="flex flex-col">
                  <p className="text-base font-medium pb-2">Mobile</p>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={mobile}
                    onChange={handleMobileChange}
                    className="rounded-xl h-14 p-4 bg-emerald-100 focus:ring-2 focus:ring-emerald-400 outline-none"
                    placeholder="Enter 10-digit mobile number"
                  />
                  {mobileError && (
                    <p className="text-sm text-red-600 pt-2">{mobileError}</p>
                  )}
                </label>

                {/* College */}
                <label className="flex flex-col">
                  <p className="text-base font-medium pb-2">College</p>
                  {autoDetected ? (
                    <input
                      type="text"
                      value={college}
                      readOnly
                      className="rounded-xl h-14 p-4 bg-emerald-50 text-gray-700 border border-emerald-200 cursor-not-allowed"
                    />
                  ) : (
                    <select
                      value={college}
                      onChange={handleCollegeChange}
                      className="rounded-xl h-14 p-4 bg-emerald-100 focus:ring-2 focus:ring-emerald-400 outline-none text-gray-700"
                      required
                    >
                      <option value="" disabled>
                        Select your College
                      </option>
                      {collegeOptions.map((col, index) => (
                        <option key={index} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  )}
                </label>

                {/* Hostel */}
                <label className="flex flex-col">
                  <p className="text-base font-medium pb-2">Hostel</p>
                  {hostelOptions.length > 0 ? (
                    <select
                      value={hostel}
                      onChange={(e) => setHostel(e.target.value)}
                      className="rounded-xl h-14 p-4 bg-emerald-100 focus:ring-2 focus:ring-emerald-400 outline-none text-gray-700"
                      required
                    >
                      <option value="" disabled>
                        Select your Hostel
                      </option>
                      {hostelOptions.map((h, index) => (
                        <option key={index} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={hostel}
                      onChange={(e) => setHostel(e.target.value)}
                      className="rounded-xl h-14 p-4 bg-emerald-100 focus:ring-2 focus:ring-emerald-400 outline-none"
                      placeholder="Enter your hostel name"
                      required
                    />
                  )}
                </label>

                
                {/* Password */}
                <label className="flex flex-col">
  <p className="text-base font-medium pb-2">Password</p>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="rounded-xl h-14 p-4 pr-12 bg-emerald-100 focus:ring-2 focus:ring-emerald-400 outline-none w-full"
      placeholder="Enter your password"
      required
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
    >
      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
    </button>
  </div>
</label>


                {/* Confirm Password */}
                <label className="flex flex-col">
  <p className="text-base font-medium pb-2">Confirm Password</p>

  <div className="relative">
    <input
      type={showConfirmPassword ? "text" : "password"}
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      className="rounded-xl h-14 p-4 pr-12 bg-emerald-100 focus:ring-2 focus:ring-emerald-400 outline-none w-full"
      placeholder="Confirm your password"
      required
    />

    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
    >
      {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
    </button>
  </div>
</label>


                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading || Boolean(emailError) || Boolean(mobileError)}
                  className={`h-12 rounded-xl text-white font-bold bg-gradient-to-r from-emerald-700 to-emerald-600 hover:opacity-90 transition ${
                    emailError || mobileError ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>

                <p className="text-sm text-emerald-700 text-center pt-6">
                  By signing up, you agree to our{" "}
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
              alt="Campus community illustration"
              className="w-full h-full object-cover relative z-10"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Signup;

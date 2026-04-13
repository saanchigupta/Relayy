import React, { useState, useCallback } from "react";
// Assuming these imports are available in the project structure
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, Loader2, CheckCircle, AlertTriangle, KeyRound } from 'lucide-react';
import NavbarLanding from "../NavbarLanding";

// --- Custom Toast Message Component (Reused for consistent experience) ---
const MessageToast = ({ message, isError, onClose }) => {
    if (!message) return null;

    const Icon = isError ? AlertTriangle : CheckCircle;
    const bgColor = isError ? "bg-red-500" : "bg-emerald-600";

    return (
        <div className={`fixed bottom-6 right-6 p-4 rounded-xl text-white shadow-xl max-w-sm ${bgColor} z-50 transition-all duration-300 ease-in-out transform`}>
            <div className="flex items-start">
                <Icon className="w-6 h-6 mr-3 mt-0.5" />
                <div className="flex-1">
                    <p className="font-semibold">{isError ? "Error" : "Success"}</p>
                    <p className="text-sm opacity-90">{message}</p>
                </div>
                <button onClick={onClose} className="ml-4 -mt-1 opacity-70 hover:opacity-100 transition">
                    &times;
                </button>
            </div>
        </div>
    );
};

// --- Main Component ---
function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const navigate = useNavigate();
    const backendURL = "https://relayy-backend-9war.onrender.com";

    const location = useLocation();
    const email = new URLSearchParams(location.search).get("email");
    const otp = new URLSearchParams(location.search).get("otp");
    
    const handleCloseMessage = useCallback(() => {
        setMessage("");
        setIsError(false);
    }, []);

    const handleReset = async (e) => {
        e.preventDefault();
        handleCloseMessage();

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match. Please try again.");
            setIsError(true);
            return;
        }
        
        // Basic complexity check (optional, but good practice)
        if (newPassword.length < 8) {
            setMessage("Password must be at least 8 characters long.");
            setIsError(true);
            return;
        }

        setIsLoading(true);
        try {
            // Simulated API call - replace with actual axios call in a real environment
            // const res = await axios.post(`${backendURL}/api/v1/users/reset-password`, { email, otp, newPassword });
            
            // Simulating a successful response for demonstration
            await new Promise(resolve => setTimeout(resolve, 1500));
            const res = { data: { message: "Password reset successfully!" } };

            setMessage(res.data.message || "Password reset successfully!");
            setIsError(false);
            
            // Navigate after showing success message briefly
            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (err) {
            console.error("Password Reset Error:", err);
            const errorMessage = err.response?.data?.message || "Failed to reset password. The link may have expired.";
            setMessage(errorMessage);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className=" min-h-screen flex flex-col bg-emerald-50">
            <NavbarLanding />
            
            {/* Custom Message Toast */}
            <MessageToast 
                message={message} 
                isError={isError} 
                onClose={handleCloseMessage} 
            />

            {/* Main Content Area */}
            <main className="flex flex-1 justify-center items-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-lg bg-white rounded-2xl p-6 sm:p-10 shadow-xl border border-emerald-100 transform transition duration-500 hover:shadow-2xl hover:scale-[1.01]">
                    
                    {/* Header */}
                    <div className="flex flex-col items-center mb-6 sm:mb-8">
                        <KeyRound className="w-12 h-12 text-emerald-600 mb-3" />
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center tracking-tight">
                            Set New Password
                        </h1>
                        <p className="text-gray-700 text-center mt-2 max-w-sm">
                            Your email ({email || "..."}) has been verified. Enter and confirm your new password below.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleReset} className="flex flex-col gap-5">
                        
                        {/* New Password Input */}
                        <div className="relative">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-800 mb-1">
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                className="w-full h-12 rounded-xl p-4 pl-12 bg-emerald-50 text-gray-900 border border-emerald-200 
                                           focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition duration-150 ease-in-out 
                                           shadow-inner"
                                placeholder="Min 8 characters"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                            <Lock className="absolute left-4 top-[2.4rem] w-5 h-5 text-emerald-400 pointer-events-none" />
                        </div>

                        {/* Confirm Password Input */}
                        <div className="relative">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 mb-1">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                className="w-full h-12 rounded-xl p-4 pl-12 bg-emerald-50 text-gray-900 border border-emerald-200 
                                           focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition duration-150 ease-in-out 
                                           shadow-inner"
                                placeholder="Re-enter new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                            <Lock className="absolute left-4 top-[2.4rem] w-5 h-5 text-emerald-400 pointer-events-none" />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`
                                w-full h-12 rounded-xl text-white font-bold text-lg tracking-wide 
                                bg-gradient-to-r from-emerald-700 to-emerald-600 
                                shadow-lg shadow-emerald-700/50 
                                transition duration-300 ease-in-out 
                                ${isLoading 
                                    ? 'opacity-70 cursor-not-allowed' 
                                    : 'hover:from-emerald-600 hover:to-emerald-700 hover:scale-[1.01] active:scale-100'
                                }
                            `}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Resetting...</span>
                                </div>
                            ) : (
                                "Reset Password"
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default ResetPassword;
import React, { useState, useCallback } from "react";
// Assuming these imports are available in the project structure
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, Loader2, CheckCircle, AlertTriangle, Mail } from 'lucide-react';
import NavbarLanding from "../NavbarLanding";

// --- Custom Toast Message Component (Copied from ForgotPassword) ---
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
const VerifyResetOtp = () => {
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    
    const navigate = useNavigate();
    const backendURL = "https://relayy-backend-9war.onrender.com";
    
    const location = useLocation();
    const email = new URLSearchParams(location.search).get("email");

    const handleCloseMessage = useCallback(() => {
        setMessage("");
        setIsError(false);
    }, []);

    const handleVerify = async (e) => {
        e.preventDefault();
        handleCloseMessage();
        setIsLoading(true);

        try {
            // Simulated API call - replace with actual axios call in a real environment
            // const res = await axios.post(`${backendURL}/api/v1/users/verify-reset-otp`, { email, otp });
            
            // Simulating a successful response for demonstration
            await new Promise(resolve => setTimeout(resolve, 1500));
            const res = { data: { message: "OTP verified successfully." } };


            setMessage(res.data.message || "OTP verified successfully");
            setIsError(false);

            // Navigate after showing success message briefly
            setTimeout(() => {
                navigate(`/reset-password?email=${email}&otp=${otp}`);
            }, 1000);
            
        } catch (err) {
            console.error("OTP Verification Error:", err);
            const errorMessage = err.response?.data?.message || "Invalid or expired OTP. Please check your email.";
            setMessage(errorMessage);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-emerald-50">
            <NavbarLanding />

            {/* Custom Message Toast */}
            <MessageToast 
                message={message} 
                isError={isError} 
                onClose={handleCloseMessage} 
            />
            
            <main className="flex flex-1 justify-center items-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-lg bg-white rounded-2xl p-6 sm:p-10 shadow-xl border border-emerald-100 transform transition duration-500 hover:shadow-2xl hover:scale-[1.01]">
                    
                    {/* Header */}
                    <div className="flex flex-col items-center mb-6 sm:mb-8">
                        <LockKeyhole className="w-12 h-12 text-emerald-600 mb-3" />
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center tracking-tight">
                            Verify Security Code
                        </h1>
                        <p className="text-gray-700 text-center mt-2">
                            Please enter the 6-digit code sent to: <strong className="text-emerald-700 font-semibold">{email || "your email"}</strong>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleVerify} className="flex flex-col gap-5">
                        
                        <div className="relative">
                            <label htmlFor="otp" className="sr-only">One-Time Password (OTP)</label>
                            <input
                                id="otp"
                                type="text"
                                maxLength={6}
                                className="w-full h-14 rounded-xl p-4 bg-emerald-50 text-gray-900 border border-emerald-200 
                                           focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition duration-150 ease-in-out 
                                           text-center tracking-widest text-2xl font-mono shadow-inner"
                                placeholder="• • • • • •"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
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
                                    <span>Verifying...</span>
                                </div>
                            ) : (
                                "Verify Code"
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default VerifyResetOtp;
import React, { useState, useEffect, useCallback } from "react";
// Assuming these imports are available in the project structure
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router";
import { LockKeyhole, Loader2, CheckCircle, AlertTriangle, Clock, Send } from 'lucide-react';
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
export default function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const [params] = useSearchParams();
    const email = params.get("email");
    const navigate = useNavigate();
    const backendURL = "https://relayy-backend-9war.onrender.com";
    
    const [isLoadingVerify, setIsLoadingVerify] = useState(false);
    const [isLoadingResend, setIsLoadingResend] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleCloseMessage = useCallback(() => {
        setMessage("");
        setIsError(false);
    }, []);

    // Timer effect
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleVerify = async (e) => {
        e.preventDefault();
        handleCloseMessage();
        setIsLoadingVerify(true);

        try {
            // Simulated API call - replace with actual axios call in a real environment
            const res = await axios.post(`${backendURL}/api/v1/users/verify-otp`, { email, otp });
            
            // Simulating a successful response for demonstration
            await new Promise(resolve => setTimeout(resolve, 1500));
            // const res = { data: { message: "Email verified successfully!" } };

            setMessage(res.data.message);
            setIsError(false);
            
            setTimeout(() => {
                navigate("/login");
            }, 1000);
            
        } catch (err) {
            console.error("OTP Verification Error:", err);
            const errorMessage = err.response?.data?.message || "OTP verification failed. Please check the code and try again.";
            setMessage(errorMessage);
            setIsError(true);
        } finally {
            setIsLoadingVerify(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;

        handleCloseMessage();
        setIsLoadingResend(true);
        
        try {
            // Simulated API call - replace with actual axios call in a real environment
            // const res = await axios.post(`${backendURL}/api/v1/users/resend-otp`, { email });
            
            // Simulating a successful response for demonstration
            await new Promise(resolve => setTimeout(resolve, 1500));
            const res = { data: { message: "New OTP sent to your email." } };

            setResendTimer(60);
            setMessage(res.data.message);
            setIsError(false);
            
        } catch (err) {
            console.error("Resend OTP Error:", err);
            const errorMessage = err.response?.data?.message || "Failed to resend OTP. Try again shortly.";
            setMessage(errorMessage);
            setIsError(true);
            setResendTimer(0);
        } finally {
            setIsLoadingResend(false);
        }
    };

    return (
        <div className=" min-h-screen flex flex-col bg-emerald-50">
            {/* Using a mock Navbar since the original file didn't include it but other files did */}
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
                            Verify Your Email
                        </h1>
                        <p className="text-gray-700 text-center mt-2">
                            Enter the 6-digit code sent to: <strong className="text-emerald-700 font-semibold">{email || "your email"}</strong>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleVerify} className="flex flex-col gap-5">
                        
                        {/* OTP Input */}
                        <div className="relative">
                            <label htmlFor="otp" className="sr-only">One-Time Password (OTP)</label>
                            <input
                                id="otp"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
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

                        {/* Verify Button */}
                        <button
                            type="submit"
                            disabled={isLoadingVerify}
                            className={`
                                w-full h-12 rounded-xl text-white font-bold text-lg tracking-wide 
                                bg-gradient-to-r from-emerald-700 to-emerald-600 
                                shadow-lg shadow-emerald-700/50 
                                transition duration-300 ease-in-out 
                                ${isLoadingVerify
                                    ? 'opacity-70 cursor-not-allowed' 
                                    : 'hover:from-emerald-600 hover:to-emerald-700 hover:scale-[1.01] active:scale-100'
                                }
                            `}
                        >
                            {isLoadingVerify ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Verifying...</span>
                                </div>
                            ) : (
                                "Verify Email"
                            )}
                        </button>
                    </form>
                    
                    {/* Resend Button */}
                    <div className="mt-6 border-t border-emerald-100 pt-6 flex justify-center">
                        <button 
                            onClick={handleResendOtp} 
                            disabled={resendTimer > 0 || isLoadingResend}
                            className={`
                                flex items-center justify-center space-x-2 px-6 py-2 rounded-xl text-sm font-semibold transition duration-200
                                ${resendTimer > 0 
                                    ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed opacity-80' // Disabled/Countdown Style (Kept)
                                    : 'bg-gradient-to-r from-emerald-700 to-emerald-600 text-white shadow-lg shadow-emerald-700/50 hover:from-emerald-600 hover:to-emerald-700 hover:scale-[1.05]' // Enabled Style (Updated)
                                }
                            `}
                        >
                            {isLoadingResend ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Sending...</span>
                                </>
                            ) : resendTimer > 0 ? (
                                <>
                                    <Clock className="w-4 h-4" />
                                    <span>Resend in {resendTimer}s</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>Resend Code</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
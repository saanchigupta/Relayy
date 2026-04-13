import React, { useState, useCallback, useEffect } from "react";
// Assuming these imports are available in the project structure
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import NavbarLanding from "../NavbarLanding";

// --- Custom Toast Message Component ---
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
const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    // Use environment variables or configuration for the backend URL in a real app
    const backendURL = "https://relayy-backend-9war.onrender.com";

    const handleCloseMessage = useCallback(() => {
        setMessage("");
        setIsError(false);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        handleCloseMessage(); // Clear previous messages
        setIsLoading(true);

        try {
            const res = await axios.post(
    `${backendURL}/api/v1/users/forgot-password`,
    { email }
);


            setMessage(res.data.message || "OTP sent to your email for password reset");
            setIsError(false);
            
            // Navigate after showing success message briefly
            setTimeout(() => {
                navigate(`/verify-reset-otp?email=${email}`);
            }, 1000);

        } catch (err) {
            console.error("Forgot Password Error:", err);
            console.log("FULL ERROR --->", err.response); 
            const errorMessage = err.response?.data?.message || "Failed to send OTP. Please try again later.";
            setMessage(errorMessage);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
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
                        <Mail className="w-12 h-12 text-emerald-600 mb-3" />
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center tracking-tight">
                            Reset Your Password
                        </h1>
                        <p className="text-gray-700 text-center mt-2 max-w-xs">
                            We'll send a One-Time Password (OTP) to your registered email.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        
                        <div className="relative">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
                                College Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full h-12 rounded-xl p-4 pl-12 bg-emerald-50 text-gray-900 border border-emerald-200 
                                           focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition duration-150 ease-in-out 
                                           shadow-inner"
                                placeholder="e.g., your.name@college.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Mail className="absolute left-4 top-[2.4rem] w-5 h-5 text-emerald-400 pointer-events-none" />
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
                                    <span>Sending OTP...</span>
                                </div>
                            ) : (
                                "Send OTP"
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default ForgotPassword;
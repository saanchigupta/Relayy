import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router";

const AuthWrapper = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await axios.get(
         "https://relayy-backend-9war.onrender.com/api/v1/users/verify",
          { withCredentials: true }
        );
        if (res.status === 200) {
          // ✅ If authenticated and on login/signup/landing → go home
          if (
            location.pathname === "/" ||
            location.pathname === "/login" ||
            location.pathname === "/signup"
          ) {
            navigate("/home", { replace: true });
          }
        }
      } catch (err) {
        // ❌ If not authenticated and trying to access protected routes → go to login
        if (
          location.pathname.startsWith("/home") ||
          location.pathname.startsWith("/contact") ||
          location.pathname.startsWith("/product") ||
          location.pathname.startsWith("/faqs") ||
          location.pathname.startsWith("/about")
        ) {
          navigate("/login", { replace: true });
        }
      } finally {
        setIsChecking(false);
      }
    };

    verifySession();
  }, [location.pathname, navigate]);

  // ✅ Show loader while verifying
  // if (isChecking) {
  //   return (
  //     <div className="flex justify-center items-center h-screen text-lg text-gray-600">
  //       Checking your session...
  //     </div>
  //   );
  // }

  return children;
};

export default AuthWrapper;

import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import axios from "axios";

function AutoRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(
          "https://relayy-backend-9war.onrender.com/api/v1/users/verify",
          { withCredentials: true }
        );

        if (res.status === 200 && res.data.user) {
          // ✅ redirect only if currently at "/", "/login", or "/signup"
          if (
            location.pathname === "/" ||
            location.pathname === "/login" ||
            location.pathname === "/signup"
          ) {
            navigate("/home", { replace: true });
          }
        }
      } catch (err) {
        // user not authenticated — no redirect
      }
    };

    checkSession();
  }, [navigate, location.pathname]);

  return null;
}

export default AutoRedirect;

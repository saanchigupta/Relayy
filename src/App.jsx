import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing_page from "./Landing/Landing_page";
import Home_page from "./home/Home_page";
import Product_page from "./Product_details/Product_page";
import Contact_page from "./contactUs/Contact_page";
import About from "./AboutUs/About";
import Footer from "./Footer";
import { ReactLenis } from "lenis/react";
import Faqs from "./faqs/Faqs";
import Forgot from "./ForgotPass/Forgot";
import Login from "./register/Login";
import Signup from "./register/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import AutoRedirect from "./components/AutoRedirect"; 
import axios from "axios";
import Profile_page from "./Profile/Profile_page";
import Seller_page from "./Profile/Seller_page";
import EditProduct from "./Profile/EditProduct";
import Myproduct_page from "./Profile/Myproduct_page";
import AllProductsPage from "./all-products/AllProductsPage"; 
import HostelStores from "./home/HostelStores"; 
import VerifyOtp from "./register/VerifyOtp";
import EditProfile from "./Profile/EditProfile";
import RelayyInbox from "./components/RelayyInbox";
import UserListPage from "./components/UserListPage";
import ResetPassword from "./ForgotPass/ResetPass";
import ForgotPassword from "./ForgotPass/Forgot";
import VerifyResetOtp from "./ForgotPass/verify_reset";
import PricePredictor from "./Profile/PricePredictor";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://relayy-backend-9war.onrender.com/api/v1";

function App() {
  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1, smoothWheel: true }}>
      <BrowserRouter>
        <AutoRedirect />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing_page />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          {/* Forgot Password Flow */}
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/price-predictor" element={<ProtectedRoute><PricePredictor /></ProtectedRoute>} />

          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home_page />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <Product_page />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
                <Contact_page />
            }
          />
          <Route
            path="/faqs"
            element={
              <ProtectedRoute>
                <Faqs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
                <About />
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile_page />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile" 
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sell"
            element={
              <ProtectedRoute>
                <Seller_page />
              </ProtectedRoute>
            }
          />
          <Route
          path="/Myproduct/:id"
          element={
            <ProtectedRoute>
              <Myproduct_page />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />

        <Route
            path="/all-products" // For the "All Products" page
            element={
              <ProtectedRoute>
                <AllProductsPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/hostels" // For the "Browse by Hostel" page
            element={
              <ProtectedRoute>
                <HostelStores />
              </ProtectedRoute>
            }
          />
           <Route
            path="/inbox"
            element={
              <ProtectedRoute>
                <RelayyInbox />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UserListPage />
              </ProtectedRoute>
            }
          />
          
          {/* <Route
            path="/hostel/:hostelName" 
            element={
              <ProtectedRoute>
                <HostelProducts_page /> 
              </ProtectedRoute>
            }
          />  */}
        </Routes>
        

      </BrowserRouter>
      <Footer />
    </ReactLenis>
  );
}

export default App;

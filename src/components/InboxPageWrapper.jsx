import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Navbar from "../Navbar";
import Footer from "../Footer";
import RelayyInbox from "./RelayyInbox";

function InboxPageWrapper() {
  const navigate = useNavigate();
  const [showInbox, setShowInbox] = useState(false);

  useEffect(() => {
    setShowInbox(true);
  }, []);

  const handleClose = () => {
    setShowInbox(false);
    setTimeout(() => navigate(-1), 300);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1">
        {/* Main content can go here */}
      </div>
      <Footer />
      
      {showInbox && <RelayyInbox onClose={handleClose} />}
    </div>
  );
}

export default InboxPageWrapper;

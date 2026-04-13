// src/components/HeaderSection.jsx
import React from "react";

const Header = ({ title}) => {
  return (
    <div className="bg-[#F3E9FB]">
      <div className="max-w-6xl py-10">
        <h1 className="text-3xl font-bold text-purple-800 mx-20">{title}</h1>
      </div>
    </div>
  );
};

export default Header;

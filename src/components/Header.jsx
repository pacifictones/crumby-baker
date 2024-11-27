import React from "react";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className=" bg-gray-800 text-white w-full">
      <div className=" max-w-screen-lg mx-auto  sm:p-4 text-center sm:text-left">
        {/* Title disappears on small screens */}
        <h1 className="text-3xl font-bold hidden sm:block">The Crumby Baker</h1>
      </div>
      <Navbar />
    </header>
  );
};

export default Header;

import React from "react";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="sticky top-0 w-full bg-white">
      <div className=" max-w-screen-lg mx-auto  sm:p-4 text-center sm:text-left">
        {/* Title disappears on small screens */}
        <h1 className="font-chelseaMarket text-4xl font-bold hidden sm:block text-center">
          The Crumby Baker
        </h1>
      </div>
      <Navbar />
    </header>
  );
};

export default Header;

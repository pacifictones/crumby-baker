import React from "react";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className=" bg-gray-800 text-white w-full">
      <div className=" max-w-screen-lg mx-auto p-4 text-center sm:text-left">
        <h1 className="text-3xl">The Crumby Baker</h1>
      </div>
      <Navbar />
    </header>
  );
};

export default Header;

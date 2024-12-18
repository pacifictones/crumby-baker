import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="relative bg-gray-100">
      <div className="container mx-auto px-4 py-2">
        {/* Small Screen Layout */}
        <div className="flex items-center justify-between sm:hidden">
          {/* Title (Visible on Small Screens) */}
          <h1 className="font-chelseaMarket text-lg font-bold">
            The Crumby Baker
          </h1>

          {/* Hamburger Menu */}
          <button
            className="block sm:hidden text-black focus:outline-none bg-transparent border-0"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              xmlns="http:/www.w3.org/2000/svg"
            >
              <path
                d={isOpen ? "M6 18L18 6M6 6L18 18" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Full Menu (visible on Large Screens) */}
        <ul className="font-heading text-lg  hidden sm:flex justify-center gap-8 ">
          <li>
            <Link className=" block py-1 sm:py-2 " to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="block py-1 sm:py-2 " to="/recipes">
              Recipes
            </Link>
          </li>
          <li>
            <Link className="block py-1 sm:py-2" to="/blog">
              Blog
            </Link>
          </li>
          <li>
            <Link className="block py-1 sm:py-2" to="/about">
              About
            </Link>
          </li>
          <li>
            <Link className="block py-1 sm:py-2" to="/contact">
              Contact
            </Link>
          </li>
        </ul>
      </div>

      {/* Dropdown Menu (visible on Small Screens) */}
      {isOpen && (
        <ul className=" absolute top-full left-0 w-full  bg-gray-800 text-white text-center z-50 shadow-lg sm:hidden">
          <li>
            <Link className="block py-2" to="/" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link className="block py-2" to="/recipes" onClick={closeMenu}>
              Recipes
            </Link>
          </li>
          <li>
            <Link className="block py-2" to="/blog" onClick={closeMenu}>
              Blog
            </Link>
          </li>
          <li>
            <Link className="block py-2" to="/about" onClick={closeMenu}>
              About
            </Link>
          </li>
          <li>
            <Link className="block py-2" to="/contact" onClick={closeMenu}>
              Contact
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;

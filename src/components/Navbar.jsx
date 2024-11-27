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
    <nav className="w-full bg-gray-700">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <h1 className="text-lg font-bold block sm:hidden">The Crumby Baker</h1>
        {/* Hamburger Icon */}
        <button
          className="block sm:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http:/www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6L18 18" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
        {/* Full Menu (visible on Large Screens) */}

        <ul className=" hidden sm:grid grid-cols-5 sm:gap-2 text-center text-white">
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
        <ul className="sm:hidden bg-gray-800 text-white text-center max-h-64 overflow-y-auto">
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

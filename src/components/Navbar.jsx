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
    <header className="sticky top-0 w-full  bg-gray-100">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Title */}
        <Link
          className="font-chelseaMarket text-lg sm:text-2xl font-bold hover:text-gray-700"
          to="/"
        >
          The Crumby Baker
        </Link>

        {/* Links */}
        <nav className="flex space-x-4">
          <ul className="font-heading text-lg  hidden sm:flex space-x-4 ">
            <li>
              <Link className="hover:text-gray-600 block py-1 sm:py-2 " to="/">
                Home
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-gray-600 block py-1 sm:py-2 "
                to="/recipes"
              >
                Recipes
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-gray-600 block py-1 sm:py-2"
                to="/blog"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-gray-600 block py-1 sm:py-2"
                to="/about"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-gray-600 block py-1 sm:py-2"
                to="/contact"
              >
                Contact
              </Link>
            </li>
          </ul>

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
        </nav>
      </div>

      {/* Dropdown Menu (visible on Small Screens) */}
      {isOpen && (
        <ul className=" absolute top-full left-0 w-full  bg-gray-800 text-white text-center z-50 shadow-lg sm:hidden">
          <li>
            <Link
              className="block py-2 hover:bg-gray-700"
              to="/"
              onClick={closeMenu}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className="block py-2 hover:bg-gray-700"
              to="/recipes"
              onClick={closeMenu}
            >
              Recipes
            </Link>
          </li>
          <li>
            <Link
              className="block py-2 hover:bg-gray-700"
              to="/blog"
              onClick={closeMenu}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              className="block py-2 hover:bg-gray-700"
              to="/about"
              onClick={closeMenu}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              className="block py-2 hover:bg-gray-700"
              to="/contact"
              onClick={closeMenu}
            >
              Contact
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
};

export default Navbar;

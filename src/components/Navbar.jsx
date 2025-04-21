import React, { useState } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Search from "./Search";
import SocialIcons from "./SocialIcons";
import Breadcrumbs from "./Breadcrumbs";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const closeMenu = () => {
    setIsOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    ` block py-1 sm:py-2 ${
      isActive
        ? "text-brand-primary pointer-events-none"
        : "hover:text-brand-hover"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full  bg-white">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Title */}
        <Link
          className="font-chelseaMarket text-lg sm:text-2xl font-bold hover:text-black whitespace-nowrap"
          to="/"
        >
          The Crumby Baker
        </Link>

        {/* Links */}
        <nav className="ml-2 mr-4">
          <ul className=" font-heading text-lg  hidden sm:flex space-x-8 ">
            <li>
              <NavLink className={navLinkClass} to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink className={navLinkClass} to="/recipes" end>
                Recipes
              </NavLink>
            </li>
            <li>
              <NavLink className={navLinkClass} to="/blog" end>
                Blog
              </NavLink>
            </li>
            <li>
              <NavLink className={navLinkClass} to="/about">
                About
              </NavLink>
            </li>
            <li>
              <NavLink className={navLinkClass} to="/contact">
                Contact
              </NavLink>
            </li>
            <li>
              <Search />
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
          <li className="p-2 border-b border-gray-600 text-black">
            <Search />
          </li>
          <li>
            <NavLink className={navLinkClass} to="/" onClick={closeMenu}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink className={navLinkClass} to="/recipes" onClick={closeMenu}>
              Recipes
            </NavLink>
          </li>
          <li>
            <NavLink className={navLinkClass} to="/blog" onClick={closeMenu}>
              Blog
            </NavLink>
          </li>
          <li>
            <NavLink className={navLinkClass} to="/about" onClick={closeMenu}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink className={navLinkClass} to="/contact" onClick={closeMenu}>
              Contact
            </NavLink>
          </li>
          <li className="border-t pt-4 mt-4 pb-4">
            <SocialIcons size="w-7 h-7" className="justify-center" />
          </li>
        </ul>
      )}
    </header>
  );
};

export default Navbar;

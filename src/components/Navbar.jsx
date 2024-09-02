import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full bg-gray-700">
      <ul className=" grid grid-cols-5 sm:gap-2 text-center">
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
    </nav>
  );
};

export default Navbar;

import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full bg-gray-700">
      <ul className="max-w-screen-lg mx-auto grid grid-cols-5 gap-4 p-4 text-center">
        <li>
          <Link className="block py-2" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="block py-2" to="/recipes">
            Recipes
          </Link>
        </li>
        <li>
          <Link className="block py-2" to="/blog">
            Blog
          </Link>
        </li>
        <li>
          <Link className="block py-2" to="/about">
            About
          </Link>
        </li>
        <li>
          <Link className="block py-2" to="/contact">
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

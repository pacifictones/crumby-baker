// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Search from "./Search";
import SocialIcons from "./SocialIcons";
import client from "../sanityClient";

const Navbar = () => {
  /* ── state ─────────────────────────────────────────────── */
  const [isOpen, setIsOpen] = useState(false); // hamburger
  const [cats, setCats] = useState([]); // categories

  const closeMenu = () => setIsOpen(false); // helper

  /* ── fetch categories once ─────────────────────────────── */
  useEffect(() => {
    async function fetchCats() {
      try {
        const data = await client.fetch(`
          *[_type=="category" && defined(image)]
          | order(title asc){
            _id, title, slug
          }
        `);
        setCats(data);
      } catch (err) {
        console.error("Navbar: category fetch failed", err);
      }
    }
    fetchCats();
  }, []);

  /* ── shared link style helper ──────────────────────────── */
  const navLinkClass = ({ isActive }) =>
    `block py-1 sm:py-2 ${
      isActive ? "text-brand-primary" : "hover:text-brand-hover"
    }`;

  /* ──────────────────────────────────────────────────────── */
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo/Title */}
        <div className="flex items-center gap-3">
          <img
            src="/photos/blackToaster.png"
            alt="Heather smiling"
            className="w-10 h-10 hidden sm:block"
          />
          <Link
            to="/"
            className="font-chelseaMarket text-lg sm:text-2xl font-bold hover:text-black whitespace-nowrap"
          >
            The Crumby Baker
          </Link>
        </div>

        {/* ========== DESKTOP NAV ========== */}
        <nav className="ml-2 mr-4">
          <ul
            className="
      font-heading text-lg hidden sm:flex
      gap-6 md:gap-4           /* smaller gap under 768 px */
      whitespace-nowrap
"
          >
            <li>
              <NavLink className={navLinkClass} to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink className={navLinkClass} to="/recipes">
                Recipes
              </NavLink>
            </li>
            <li>
              <NavLink className={navLinkClass} to="/blog">
                Blog
              </NavLink>
            </li>

            {/* Categories dropdown */}
            <li className="relative group">
              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  `inline-flex items-center pointer-events-auto relative z-10
       
       ${navLinkClass({ isActive })}`
                }
              >
                Categories
                <svg
                  className="ml-1 h-3 w-3 transition-transform group-hover:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </NavLink>

              <ul
                className="
        invisible opacity-0 group-hover:visible group-hover:opacity-100
        absolute left-0 top-full w-48 bg-white shadow-lg rounded
        transition-opacity duration-150 z-50
      "
              >
                {cats.slice(0, 12).map((c) => (
                  <li key={c._id}>
                    <NavLink
                      to={`/category/${c.slug.current}`}
                      className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
                    >
                      {c.title}
                    </NavLink>
                  </li>
                ))}
                {!cats.length && (
                  <li className="px-4 py-2 text-sm text-gray-400">Loading…</li>
                )}
              </ul>
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

          {/* ========== HAMBURGER BUTTON ========== */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="block sm:hidden text-black focus:outline-none bg-transparent border-0"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path
                d={isOpen ? "M6 18L18 6M6 6L18 18" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </nav>
      </div>

      {/* ========== MOBILE DRAWER ========== */}
      {isOpen && (
        <ul className="absolute top-full left-0 w-full bg-gray-800 text-white text-center z-50 shadow-lg sm:hidden">
          <li className="p-2 border-b border-gray-600">
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
            <NavLink
              className={navLinkClass}
              to="/categories"
              onClick={closeMenu}
            >
              Categories
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

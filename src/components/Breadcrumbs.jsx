import React from "react";
import { Link, useLocation } from "react-router-dom";

// Convert "cherry-pie" → "Cherry Pie", "duhoh" → "Duhoh", "applePie" → "Apple Pie"
function humanizeSlug(str = "") {
  return str
    .replace(/[-_]+/g, " ") // hyphens / underscores → space
    .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase → space before caps
    .replace(/\s+/g, " ") // collapse multiple spaces
    .trim()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  //   Hide breadcrumbs on the home page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <nav className="text-md text-gray-600 mb-4">
      <div className="font-heading max-w-screen-xl mx-auto ">
        <ul className="flex space-x-2">
          {/* Home Link */}
          <li>
            <Link to="/" className="text-[#ED6A5A] hover:text-brand-hover">
              Home
            </Link>
          </li>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;

            return (
              <li key={to} className="flex items-center">
                <span className="mx-2">{">"}</span>
                {isLast ? (
                  <span className="text-gray-500">{humanizeSlug(value)}</span>
                ) : (
                  <Link
                    to={to}
                    className="text-[#ED6A5A] hover:text-brand-hover"
                  >
                    {humanizeSlug(value)}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Breadcrumbs;

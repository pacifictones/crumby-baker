import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  //   Hide breadcrumbs on the home page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <nav className="text-sm text-gray-600 my-4">
      <div className="max-w-screen-lg mx-auto px-4">
        <ul className="flex space-x-2">
          {/* Home Link */}
          <li>
            <Link to="/" className="text-blue-600 hover:underLine">
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
                  <span className="text-gray-500">
                    {value.replace(/-/g, "")}
                  </span>
                ) : (
                  <Link to={to} className="text-blue-600 hover:underline">
                    {value.replace(/-/g, "")}
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
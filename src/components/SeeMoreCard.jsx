import React from "react";
import { Link } from "react-router-dom";

const SeeMoreCard = ({
  to,
  title = "See More",
  description = "",
  className = "",
  backgroundImage = null, // Optional prop for background image
}) => (
  <Link
    to={to}
    className={`flex flex-col items-center rounded shadow w-80 h-196 bg-gray-50 hover:shadow-lg transition ${className}`}
  >
    <div
      className={`w-full aspect-square ${
        backgroundImage
          ? "bg-cover bg-center"
          : "bg-gray-200 flex items-center justify-center"
      }`}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
            }
          : {}
      }
    >
      {!backgroundImage && (
        <span className="text-xl font-bold text-gray-700">{title}</span>
      )}
    </div>

    {/* <div className="p-4 flex-1 flex flex-col justify-between">
      <p className="text-gray-600 text-sm text-center">{description}</p>
    </div> */}
  </Link>
);

export default SeeMoreCard;

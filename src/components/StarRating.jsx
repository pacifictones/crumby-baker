import React from "react";

function StarRating({ rating, setRating, maxStars = 5 }) {
  const stars = [];
  for (let i = 1; i <= maxStars; i++) {
    stars.push(i);
  }
  const handleClick = (starIndex) => {
    if (typeof setRating === "function") {
      setRating(starIndex);
    }
  };

  return (
    <div className="flex space-x-1">
      {stars.map((i) => (
        <svg
          key={i}
          onClick={() => handleClick(i)}
          className={
            typeof setRating === "function"
              ? "w-6 h-6 cursor-pointer"
              : "w-6 h-6"
          }
          viewBox="0 0 24 24"
          fill={i <= rating ? "#FFC107" : "#E5E7EB"} //Gold if active, gray if not
        >
          <path d="M12 .587l3.668 7.431 8.213 1.193-5.93 5.779 1.401 8.178L12 18.896l-7.352 3.872 1.401-8.178L.119 9.211l8.213-1.193z" />
        </svg>
      ))}
    </div>
  );
}
export default StarRating;

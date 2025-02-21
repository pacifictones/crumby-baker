import React from "react";
import StarRating from "./StarRating";

function StarBreakdown({ reviews, maxStars = 5 }) {
  // Count reviews per star rating
  const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((rev) => {
    if (rev.rating >= 1 && rev.rating <= maxStars) {
      starCounts[rev.rating]++;
    }
  });

  const total = reviews.length || 1;

  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = starCounts[star];
        const percentage = (count / total) * 100;
        return (
          <div key={star} className="flex items-center gap-3 w-full h-6">
            {/* Number */}
            <span className="w-6 text-right font-semibold">{star}</span>
            {/* Star icon */}
            <svg
              className="w-4 h-4 text-[#FFC107]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              {" "}
              <path d="M12 .587l3.668 7.431 8.213 1.193-5.93 5.779 1.401 8.178L12 18.896l-7.352 3.872 1.401-8.178L.119 9.211l8.213-1.193z" />
            </svg>
            {/* <div className="w-24 flex justify-start">
              <StarRating rating={star} />
            </div> */}

            {/* Bar */}
            <div className=" flex-1 h-4 bg-gray-200 rounded overflow-hidden">
              <div
                className="h-full transition-all bg-[#ED6A5A] rounded duration-300"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>

            {/* Number of reviews */}
            <span className=" text-gray-700 w-8 text-right ml-2">{count}</span>
          </div>
        );
      })}
    </div>
  );
}
export default StarBreakdown;

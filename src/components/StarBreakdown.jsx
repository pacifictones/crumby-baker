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
          <div key={star} className="flex items-center gap-2">
            {/* Star label */}
            <div className="w-16 flex items-center">
              <StarRating rating={star} />
            </div>

            {/* Bar */}
            <div className="flex-1 bg-gray-200 h-3 rounded">
              <div
                className="h-3 bg-[#ED6A5A] rounded"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>

            {/* Number of reviews */}
            <span className="text-sm text-gray-700 w-8 text-right">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
export default StarBreakdown;

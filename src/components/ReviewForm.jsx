import React, { useState } from "react";

import StarRating from "./StarRating";

function ReviewForm({ recipeId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [authorName, setAuthorName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        recipeId,
        rating,
        reviewText,
        authorName,
      };

      const response = await fetch("/api/submitReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response", errorData);
        alert(errorData.message || "Error submitting review");
        return;
      }

      const newReview = await response.json();
      onReviewSubmitted(newReview);

      // Reset form
      setRating(0);
      setReviewText("");
      setAuthorName("");
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label className="block mb-1 font-semibold text-gray-700">
          Rating (1-5):
        </label>
        <StarRating rating={rating} setRating={setRating} />
        {/* <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        /> */}
      </div>
      <div>
        <label className="block mb-1 font-semibold text-gray-700">
          Your Name (optional):
        </label>
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="border border-[#DEE7E7] rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ED6A5A]"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">
          Review:
        </label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="border border-[#DEE7E7] rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ED6A5A]"
        />
      </div>

      <button
        type="submit"
        className="bg-[#ED6A5A] py-2 rounded text-white px-4 mt-4"
      >
        Submit Review
      </button>
    </form>
  );
}

export default ReviewForm;

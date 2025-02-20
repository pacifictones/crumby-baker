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
    <form onSubmit={handleSubmit}>
      <h3>Leave a Review</h3>

      <div>
        <label>Rating (1-5):</label>
        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Your Name (optional):</label>
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
        />
      </div>

      <div>
        <label>Review</label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
      </div>

      <button type="submit" className="bg-[#ED6A5A]">
        Submit Reivew
      </button>
    </form>
  );
}

export default ReviewForm;

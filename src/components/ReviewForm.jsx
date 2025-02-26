import React, { useState } from "react";

import StarRating from "./StarRating";
import { useTransition } from "react";

function ReviewForm({ recipeId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Disable form interaction and clear old messages
    setIsSubmitting(true);
    setMessage("");

    console.log("revieved recipeId in submitReview:", recipeId);
    console.log("Form data:", { rating, reviewText, authorName });

    try {
      const payload = {
        recipeId,
        rating,
        reviewText,
        authorName,
        email,
      };

      const response = await fetch("/api/submitReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const newReview = await response.json();

      if (!response.ok) {
        console.error("Error response", newReview);
        alert(newReview.message || "Error submitting review");
        return;
      }
      console.log("Review successfully submitted:", newReview);
      onReviewSubmitted(newReview);

      // Show confirmation message
      setMessage("✅ Confirmation email sent! Check your inbox.");

      // Reset form
      setRating(0);
      setReviewText("");
      setAuthorName("");
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("⚠️ Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false); // Re-enable form after submission
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
        <label className="block">Email (required)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full"
          required
        />
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

      {message && (
        <div className="text-center text-sm font-semibold text-gray-700 bg-gray-100 p-2 rounded-md">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`bg-[#ED6A5A] py-2 rounded text-white px-4 mt-4 ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-[#D65A4A]"
        }`}
      >
        {isSubmitting ? "Submit..." : "Submit Review"}
      </button>
    </form>
  );
}

export default ReviewForm;

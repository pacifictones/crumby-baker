import React, { useState } from "react";

import StarRating from "./StarRating";

function ReviewForm({ recipeId, onReviewSubmitted }) {
  // Form fields
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [email, setEmail] = useState("");

  // States for submission feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [wasSuccessful, setWasSuccessful] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Disable form interaction and clear old messages
    setIsSubmitting(true);
    setModalMessage("");

    // console.log("revieved recipeId in submitReview:", recipeId);
    // console.log("Form data:", { rating, reviewText, authorName });

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

      const result = await response.json();

      if (!response.ok) {
        console.error("Error response", result);
        setModalMessage(result.message || "Error submitting review");
        setShowModal(true);
        return;
      }

      // Success
      setModalMessage("Confirmation email sent! Check your inbox.");
      setWasSuccessful(true);
      setShowModal(true);

      //
      console.log("Review successfully submitted:", result);

      // Reset form
    } catch (error) {
      console.error("Fetch error:", error);
      setModalMessage("⚠️ Something went wrong. Please try again.");
      setShowModal(true);
    } finally {
      setIsSubmitting(false); // Re-enable form after submission
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);

    if (wasSuccessful) {
      setRating(0);
      setReviewText("");
      setAuthorName("");
      setEmail("");

      onReviewSubmitted && onReviewSubmitted();
    }
  };

  return (
    <div className="p-4">
      {/* ============ The Modal ============ */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md text-center max-w-sm w-full">
            <p className="font-heading mb-4 text-lg font-semibold">
              {modalMessage}
            </p>
            <button
              onClick={handleCloseModal}
              className="font-heading bg-[#ED6A5A] text-white px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ============ Form ============ */}

      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        {/* Rating Field */}
        <div>
          <label className="font-heading block mb-1 font-semibold text-gray-700">
            Rating (1-5):
          </label>
          <StarRating rating={rating} setRating={setRating} />
        </div>

        {/* Email Field */}
        <div>
          <label className=" font-heading block">Email (required)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="font-body border p-2 w-full"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Author Name Field */}
        <div>
          <label className="font-heading block mb-1 font-semibold text-gray-700">
            Your Name (optional):
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="font-body border border-[#DEE7E7] rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ED6A5A]"
            disabled={isSubmitting}
          />
        </div>

        {/* Review Textarea */}
        <div>
          <label className="font-heading block mb-1 font-semibold text-gray-700">
            Review:
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="font-body border border-[#DEE7E7] rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ED6A5A]"
            disabled={isSubmitting}
          />
        </div>

        {/* {message && (
          <div className="text-center text-sm font-semibold text-gray-700 bg-gray-100 p-2 rounded-md">
            {message}
          </div>
        )} */}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`font-heading bg-[#ED6A5A] py-2 rounded text-white px-4 mt-4 ${
            isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#D65A4A]"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;

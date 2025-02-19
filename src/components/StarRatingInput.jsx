import React from "react";

function StarRatingInput({ onRatingChange }) {
  const [currentRating, setCurrentRating] = useState(0);

  const handleRating = (newRating) => {
    setCurrentRating(newRating);
    onRatingChange(newRating);
  };

  return <></>;
}

export default StarRatingInput;

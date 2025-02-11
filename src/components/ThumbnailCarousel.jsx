import React, { useRef } from "react";

export default function ThumbnailCarousel({ images, onThumbnailClick }) {
  const scrollContainer = useRef(null);

  const scrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-gray-700 px-2 rounded shadow z-10"
      >
        &larr;
      </button>

      {/* Thumbnail Container */}
      <div
        ref={scrollContainer}
        className="flex overflow-x-auto space-x-2 mx-8"
      >
        {images.map((image, idx) => (
          <img
            key={idx}
            src={image.src}
            alt={`Thumbnail ${idx + 1}`}
            onClick={() => onThumbnailClick(idx)}
            className="w-24 h-24 object-cover rounded shadow cursor-pointer flex-shrink-0"
          />
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transorm -translate-y-1/2 bg-white text-gray-700 px-2 py-1 rounded shadow z-10"
      >
        &rarr;
      </button>
    </div>
  );
}

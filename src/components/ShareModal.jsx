import { useEffect, useRef } from "react";
import { useState } from "react";
import {
  FaPinterest,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";

const ShareModal = ({ url, image, title }) => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef(null);

  const shareLinks = {
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
      url
    )}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(
      title
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/dialog/share?app_id=672094871929706&href=${encodeURIComponent(
      url || window.location.href
    )}&display=popup`,
  };

  const emailShare = `mailto:?subject=${encodeURIComponent(
    title
  )}&body=Check this out: ${encodeURIComponent(url)}`;

  //   Close Modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={modalRef}>
      {/* Share Button */}
      <button
        className="flex items-center gap-1 hover:text-brand-primary font-heading"
        onClick={() => setIsVisible(!isVisible)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 -960 960 960"
        >
          <path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85 35-85 85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35 85 35 35 85-35 85-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5-1 14.5-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85-35 85-85 35m0-640q17 0 28.5-11.5T760-760t-11.5-28.5T720-800t-28.5 11.5T680-760t11.5 28.5T720-720M240-440q17 0 28.5-11.5T280-480t-11.5-28.5T240-520t-28.5 11.5T200-480t11.5 28.5T240-440m480 280q17 0 28.5-11.5T760-200t-11.5-28.5T720-240t-28.5 11.5T680-200t11.5 28.5T720-160m0-40" />
        </svg>
        Share
      </button>

      {/* Floating Share Modal */}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white p-2 shadow-lg rounded-md flex gap-3">
          <a
            href={shareLinks.pinterest}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaPinterest className="text-red-600 hover:text-red-700 text-xl" />
          </a>
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter className="text-blue-400 hover:text-blue-500 text-xl" />
          </a>
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook className="text-blue-600 hover:text-blue-700 text-xl" />
          </a>
          <a href={emailShare} target="_blank" rel="noopener noreferrer">
            <FaEnvelope className="text-gray-600 hover:text-gray-800 text-xl" />
          </a>
        </div>
      )}
    </div>
  );
};

export default ShareModal;

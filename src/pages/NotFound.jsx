// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-8">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="font-heading text-lg mb-6">
        Oops! The page you're looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="text-brand-primary font-heading hover:underline font-semibold text-lg"
      >
        Back to Home
      </Link>
    </div>
  );
}

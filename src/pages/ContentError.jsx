// src/components/ContentError.jsx
import { Link } from "react-router-dom";

export default function ContentError({ message = "Something went wrong." }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <h2 className="text-2xl font-bold mb-4">Oops!</h2>
      <p className="font-heading text-lg mb-6 text-gray-700">{message}</p>
      <Link
        to="/"
        className="text-brand-primary font-heading hover:underline font-semibold text-lg"
      >
        Back to Home
      </Link>
    </div>
  );
}

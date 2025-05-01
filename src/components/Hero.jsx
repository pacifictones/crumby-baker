// src/components/Hero.jsx
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative bg-[#DEE7E7] py-16 sm:py-24">
      {/* tagline + CTA */}
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <h1 className="font-heading text-3xl sm:text-5xl mb-6">
          Bake better, every time
        </h1>
        <p className="font-body text-lg mb-8 max-w-2xl mx-auto">
          Tried-and-tested recipes, tips, and a pinch of sarcasm from Heather —
          The Crumby Baker.
        </p>
        <Link
          to="/recipes"
          className="inline-block bg-brand-primary hover:bg-brand-hover text-white px-8 py-3 rounded-full font-heading text-lg shadow"
        >
          Browse Recipes
        </Link>
      </div>

      {/* wave transition */}
      <svg
        viewBox="0 0 1440 80"
        className="absolute bottom-0 left-0 w-full h-12 fill-white"
        preserveAspectRatio="none"
      >
        <path d="M0 40h1440v40H0z" />
        <path d="M0 40Q360 0 720 40T1440 40V80H0z" />
      </svg>
    </section>
  );
}

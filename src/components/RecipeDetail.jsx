import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client, { urlFor } from "../sanityClient";
import { PortableText } from "@portabletext/react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import StarRating from "./StarRating";
import ReviewForm from "./ReviewForm";
import { createClient } from "@sanity/client";
import StarBreakdown from "./StarBreakdown";
import CookModeToggle from "./CookModeToggle";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

const readClient = createClient({
  projectId: "ulggaxa8",
  dataset: "production",
  useCdn: true, // read
});

function RecipeDetail() {
  const { slug } = useParams(); // Get the slug from the URL
  const [recipe, setRecipe] = useState(null); // State to store recipe data

  //delete soon
  const [showImages, setShowImages] = useState(true);

  // For Swiper thumbs
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // For Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  //Modal visibility state
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Store reviews
  const [reviews, setReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  const fetchRecipe = async () => {
    try {
      const data = await client.fetch(
        `*[_type == "recipe" && slug.current == $slug][0]{
        _id,
        title,
        mainImage,
        gallery,
        description,
        prepTime,
        cookTime,
        totalTime,
        servings,
        ingredients,
        instructions []{
        text,
        image,
        },
        "reviews": *[
        _type == "review" && recipe._ref == ^._id &&
        confirmed == true
        ] | order(_createdAt desc)
        }`,
        { slug }
      );
      console.log("Fetched recipe:", data);
      setRecipe(data);
      setReviews(data?.reviews || []);
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [slug]);

  if (!recipe) return <div>Loading...</div>;

  const imageUrls = recipe.gallery.map((img) => urlFor(img).url());

  // const reviews = recipe.reviews || [];
  const averageRating = reviews.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  const displayedReviews = reviews.slice(0, visibleCount);

  const handleReviewSubmitted = async (newReview) => {
    setShowReviewModal(false);
    fetchRecipe();
  };

  // const handleReviewSubmitted = (newReview) => {
  //   setReviews([newReview, ...reviews]);
  //   setShowReviewModal(false);
  // };

  function StarRatingDisplay({ rating }) {
    return (
      <StarRating
        rating={rating}
        maxStars={5}
        //No setRating, so read-only
      />
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[40rem] flex items-center justify-start px-6 sm:px-12 lg:px-20 mb-12"
        style={{ backgroundImage: `url(${urlFor(recipe.mainImage).url()})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        {/* Title Section */}
        <div className="relative z-10  text-white px-4">
          <h1 className="font-heading text-4xl font-bold">{recipe.title}</h1>
        </div>
      </section>

      {/* Info and Gallery section */}
      <section className="max-w-screen-lg mx-auto font-body px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Left: Description and Info */}

        <div>
          <div className="felx items-center gap-2 mb-2">
            <StarRating rating={Math.round(averageRating)} />
            <p className="mt-2">
              <a
                href="#reviews"
                className="font-heading text-brand-primary hover:text-brand-hover text-md"
              >
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </a>
            </p>
          </div>
          <p className="mb-8">{recipe.description}</p>
          {/* Row 1: Prep, Cook, Total */}
          <div className="font-heading grid grid-cols-3 gap-y-4 text-center mb-4">
            <div>
              <p>Prep</p>
              <p>
                <strong>{recipe.prepTime} mins</strong>
              </p>
            </div>
            <div className="divide-x divide-gray-300">
              <p>Cook</p>
              <p>
                <strong>{recipe.cookTime} mins</strong>{" "}
              </p>
            </div>
            <div className="divide-x divide-gray-300 ">
              <p>Total</p>
              <p>
                <strong>{recipe.totalTime} mins</strong>
              </p>
            </div>
            <div className="col-span-3 border-b border-gray-300 my-2"></div>

            <div>
              <p>Servings</p>
              <p>
                <strong>{recipe.servings}</strong>
              </p>
            </div>

            <div className="col-span-3 border-b border-gray-300 my-2"></div>
            <div>
              <button onClick={() => window.print()}>🖨️ Print</button>
            </div>
          </div>
        </div>

        {/* Right: Swiper Main + Thumbnails */}
        <div>
          {/* Big image */}
          <img
            src={imageUrls[0]}
            alt="Main dish"
            className="w-full h-auto rounded shadow mb-4 cursor-pointer"
            onClick={() => {
              setLightboxIndex(0);
              setLightboxOpen(true);
            }}
          />

          {/* Thumbnail Swiper */}
          <Swiper
            key={imageUrls.length}
            modules={[Navigation, Thumbs]}
            navigation
            onSwiper={setThumbsSwiper}
            slidesPerView={2.5} // Show 3 thumbs at a time
            slidesPerGroup={1}
            spaceBetween={10}
            watchSlidesProgress
            className="cursor-pointer h-40"
          >
            {imageUrls.slice(1).map((url, idx) => (
              <SwiperSlide key={idx}>
                <div className="w-full aspect-square overflow-hidden">
                  <img
                    src={url}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover rounded shadow"
                    onClick={() => {
                      setLightboxIndex(idx + 1);
                      setLightboxOpen(true);
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Lightbox Component */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={imageUrls.map((src) => ({ src }))}
          index={lightboxIndex}
          on={{
            view: ({ index }) => setLightboxIndex(index),
          }}
        />
      )}

      {/* Ingredients and Instructions Section */}

      <div className=" printable-recipe w-full bg-[#DEE7E7] py-8">
        <div className="max-w-screen-lg mx-auto px-4">
          <section className="grid grid-cols-1 lg:grid-cols-6 gap-8 ">
            {/* Left: Ingredients */}
            <div className="lg:col-span-2">
              <div className="border-b border-gray-300 pb-2 mb-4">
                <h2 className=" font-heading text-2xl font-bold mb-4">
                  Ingredients
                </h2>
              </div>

              <ul className="font-body list-disc list-inside space-y-1">
                {recipe.ingredients.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Right: Instructions */}
            <div className="lg:col-span-4 bg-white p-10 rounded">
              <div className="flex w-full flex-col sm:flex-row sm:justify-between border-b border-gray-300 pb-2 mb-4 sm:mt-0 text-center sm:text-left">
                <h2 className="font-heading text-2xl font-bold mb-2 sm:mb-0 w-full">
                  Instructions
                </h2>
                {recipe.instructions.some((step) => step.image) && (
                  <div className="w-full flex justify-center sm:justify-end mt-2 sm:mt-0">
                    <button
                      onClick={() => setShowImages(!showImages)}
                      className="mb-4 btn-primary"
                    >
                      {showImages ? "Hide Photos" : "Show Photos"}
                    </button>
                  </div>
                )}
              </div>
              <div className=" border-b border-gray-300 pb-2 mb-4">
                <CookModeToggle />
              </div>

              <ol className="font-body list-decimal list-outside space-y-6">
                {recipe.instructions.map((step, idx) => (
                  <li key={idx}>
                    <PortableText value={step.text} />
                    {showImages && step.image && (
                      <img
                        src={urlFor(step.image).url()}
                        alt={`Step ${idx + 1}`}
                        className="rounded shadow mt-2"
                      />
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </div>
      </div>

      {/* ============ Reviews section at bottom ============ */}
      <section id="reviews" className="max-w-screen-lg mx-auto px-4 py-8">
        <h2 className="font-heading text-3xl font-bold mb-4">Reviews</h2>
        {/* Reviews Header and Hero section */}
        <div className="border-b border-gray-300 pb-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-y-4">
            {/* Left: Average Rating and Stars */}
            <div className="font-heading flex flex-col items-center  py-4">
              <p className="text-4xl font-bold">{averageRating.toFixed(1)}</p>
              <StarRating rating={averageRating} />
              <p className="text-gray-600">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
            </div>
            {/* Middle: StarBreakdown */}
            <div className="flex flex-col justify-center px-6 sm:border-r sm:border-l border-gray-300 py-4">
              <StarBreakdown reviews={reviews} maxStars={5} />
            </div>
            <div>
              {/* Right: Write a review button*/}
              <div className="flex items-center justify-center py-4">
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="btn-primary"
                >
                  Write a Review
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* If no reviews, show a message */}
        {!reviews.length && (
          <p className="font-heading text-gray-600">
            No reviews yet. Be the first!
          </p>
        )}

        {/* Show only "visibleCount" reviews */}
        {displayedReviews.map((review) => (
          <div key={review.id} className="border-b py-4 mb-4">
            {/* StarRatingDisplay */}
            <div className="flex items-center gap-2 mb-1">
              <StarRatingDisplay rating={review.rating} />
              <span className="font-heading text-md text-gray-600">
                {review.authorName || "Anonymous"}
              </span>
            </div>
            <p className="font-body text-gray-800">{review.reviewText}</p>
          </div>
        ))}

        {/* Load More button if more reivews that visibleCount */}
        {reviews.length > visibleCount && (
          <button
            onClick={() => setVisibleCount(visibleCount + 5)}
            className="font-heading bg-[#ED6A5A] text-white px-3 py-1 rounded"
          >
            Load More
          </button>
        )}

        {/* Review form modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md mx-auto p-6 rounded shadow-lg relative">
              {/* Close button */}
              <button
                className="absolute top-2 right-2 text-gray-600"
                onClick={() => setShowReviewModal(false)}
              >
                ✕
              </button>

              <h3 className="font-heading text-2xl font-semibold mb-4">
                Leave a Review
              </h3>
              {/* ReviewForm */}
              <ReviewForm
                recipeId={recipe._id}
                onReviewSubmitted={handleReviewSubmitted}
              />
              {console.log("Passing recipeID to ReviewForm:", recipe?._id)}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default RecipeDetail;

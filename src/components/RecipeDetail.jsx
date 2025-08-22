import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client, { urlFor } from "../sanityClient";
import { PortableText } from "@portabletext/react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import StarRating from "./StarRating";
import ReviewForm from "./ReviewForm";
import StarBreakdown from "./StarBreakdown";
import CookModeToggle from "./CookModeToggle";
import ShareModal from "./ShareModal";
import { Helmet } from "react-helmet-async";
import RecipeSchema from "./RecipeSchema";
import Breadcrumbs from "./Breadcrumbs";
import Loading from "./Loading";
import ContentError from "../pages/ContentError";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

const ptComponents = {
  marks: {
    link: ({ children, value }) => {
      const rel = value?.nofollow ? "nofollow noopener" : "noopener";
      const target = value?.blank ? "_blank" : undefined;
      return (
        <a href={value?.href} target={target} rel={rel}>
          {children}
        </a>
      );
    },
  },
};
export function formatQuantity(qty) {
  if (qty == null || isNaN(qty)) return qty; // fail-safe

  // Round to max two decimals, then let Intl strip trailing zeros
  const rounded = Math.round(qty * 100) / 100;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rounded);
}

function RecipeDetail() {
  const { slug } = useParams(); // Get the slug from the URL
  const [recipe, setRecipe] = useState(null); // State to store recipe data
  const [error, setError] = useState(false);

  const [loading, setLoading] = useState(true);

  // State for how many servigns user wants now
  const [currentServings, setCurrentServings] = useState(null);

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

  const RECIPE_QUERY = `*[_type == "recipe" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    description,
    seoTitle,
    metaDescription,
    keywords,
    categories[]->{ _id },
    mainImage{ ..., alt },
    gallery[]{ ..., alt },
    prepTime,
    cookTime,
    totalTime,
    servings,
  
    ingredientSections[]{
      sectionTitle,
      items[]{ quantity, unit, item, notes }
    },
  
    instructionSections[]{
      sectionTitle,
      steps[]{ text, image }
    },
  
    notes,
  
    internalLinks[]->{ _id, title, "slug": slug.current, mainImage{ ..., alt } },
    externalLinks[]{ label, url },
  
    "relatedAutoRecipes": *[
      _type == "recipe" &&
      slug.current != ^.slug.current &&
      (
        references(^.categories[]._ref) ||
        count(coalesce(^.keywords, [])[@ in coalesce(keywords, [])]) > 0
      )
    ]{
      _id,
      title,
      "slug": slug.current,
      mainImage{ ..., alt },
      "overlap": count(coalesce(^.keywords, [])[@ in coalesce(keywords, [])])
    } | order(overlap desc, _createdAt desc)[0...6],
  
    "relatedPosts": *[
      _type == "blog" &&
      (
        references(^.categories[]._ref) ||
        count(coalesce(^.keywords, [])[@ in coalesce(keywords, [])]) > 0
      )
    ]{
      _id,
      title,
      "slug": slug.current,
      mainImage{ ..., alt },
      "overlap": count(coalesce(^.keywords, [])[@ in coalesce(keywords, [])])
    } | order(overlap desc, _createdAt desc)[0...4],
  
    "reviews": *[
      _type == "review" && recipe._ref == ^._id && confirmed == true
    ] | order(_createdAt desc)
  }`;

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      setError(false);

      const data = await client.fetch(RECIPE_QUERY, { slug });
      console.log("Fetched recipe:", data);

      setRecipe(data);
      setReviews(data?.reviews || []);
      setCurrentServings(data?.servings);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) return <Loading />;
  if (!recipe)
    return <p className="text-center py-12 font-heading">Recipe not found.</p>;

  const galleryImages =
    recipe.gallery?.map((img) => ({
      raw: img,
      thumb: urlFor(img).width(400).quality(80).url(),
      alt: img.alt ?? "",
    })) || [];

  const lightboxSlides = galleryImages.map((imgObj) => ({
    src: urlFor(imgObj.raw).width(1000).quality(80).url(),
  }));

  const ogImageUrl = recipe.mainImage
    ? urlFor(recipe.mainImage).width(1600).quality(80).url()
    : "";

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

  if (error) return <ContentError message="We couldn't load the recipe." />;

  function StarRatingDisplay({ rating }) {
    return (
      <StarRating
        rating={rating}
        maxStars={5}
        //No setRating, so read-only
      />
    );
  }

  const cardImg = (img) =>
    img
      ? urlFor(img).width(600).height(400).fit("crop").quality(80).url()
      : null;

  // Merge manual + auto related recipes, de-dupe by slug, cap at 6
  const manualRelated = recipe.internalLinks || [];
  const autoRelated = recipe.relatedAutoRecipes || [];
  const seen = new Set();
  const combinedRecipes = [...manualRelated, ...autoRelated]
    .filter((r) => {
      const k = r?.slug;
      if (!k || seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .slice(0, 6);

  function scaleQuantity(baseQty, baseServings, newServings) {
    const qty = Number(baseQty);
    if (!qty || !baseServings || !newServings) return baseQty;
    return qty * (newServings / baseServings);
  }

  const canonical = `https://thecrumbybaker.com/recipes/${slug}`;
  const pageTitle = recipe.seoTitle?.trim()
    ? recipe.seoTitle
    : `${recipe.title} | The Crumby Baker`;
  const metaDesc = (recipe.metaDescription || recipe.description || "").slice(
    0,
    155
  );

  return (
    <>
      {/* Helmet for dynamic og: tags based on the loaded recipe */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonical} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDesc} />
        {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
        <meta property="og:url" content={canonical} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDesc} />
        {ogImageUrl && <meta name="twitter:image" content={ogImageUrl} />}
      </Helmet>

      <RecipeSchema
        recipe={recipe}
        reviews={reviews}
        canonicalUrl={canonical}
      />

      <div className="px-4">
        <Breadcrumbs />
      </div>

      <div className="w-full">
        {/* Hero Section */}
        <section
          className="relative bg-cover bg-center h-[40rem] flex items-center justify-start px-6 sm:px-12 lg:px-20 mb-12"
          style={{ backgroundImage: `url(${ogImageUrl})` }}
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
            <div className="flex items-center gap-2 mb-2">
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
                  <input
                    type="number"
                    className="font-bold text-center border border-gray-300 rounded appearance-auto outline-none focus:border-brand-primary w-12"
                    value={currentServings ?? ""}
                    onChange={(e) => setCurrentServings(Number(e.target.value))}
                  />
                </p>
              </div>

              <div className="col-span-3 border-b border-gray-300 my-2"></div>
              <div className="col-span-1 flex justify-center">
                <button
                  onClick={() => window.open(`/print/${slug}`, "_blank")}
                  className="flex items-center space-x-2 hover:text-brand-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 -960 960 960"
                    stroke="black"
                    strokeWidth="0.01"
                  >
                    <path d="M640-640v-120H320v120h-80v-200h480v200zm-480 80h640zm560 100q17 0 28.5-11.5T760-500t-11.5-28.5T720-540t-28.5 11.5T680-500t11.5 28.5T720-460m-80 260v-160H320v160zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80z" />
                  </svg>
                  <span>Print</span>
                </button>
              </div>
              <div>
                <ShareModal
                  url={`https://thecrumbybaker.com/recipes/${slug}`}
                  image={
                    recipe.mainImage
                      ? urlFor(recipe.mainImage).url()
                      : undefined
                  }
                  title={recipe.title}
                />
              </div>
            </div>
          </div>

          {/* Right: Swiper Main + Thumbnails */}
          <div>
            {/* Big image */}
            {galleryImages.length > 0 && (
              <img
                src={galleryImages[0].thumb}
                alt={galleryImages[0].alt || "Main dish"}
                className="w-full h-auto rounded shadow mb-4 cursor-pointer"
                onClick={() => {
                  setLightboxIndex(0);
                  setLightboxOpen(true);
                }}
              />
            )}

            {/* Thumbnail Swiper */}
            <Swiper
              key={galleryImages.length}
              modules={[Navigation, Thumbs]}
              navigation
              onSwiper={setThumbsSwiper}
              slidesPerView={2.5} // Show 3 thumbs at a time
              slidesPerGroup={1}
              spaceBetween={10}
              watchSlidesProgress
              className="cursor-pointer h-40"
            >
              {galleryImages.slice(1).map((imgObj, idx) => (
                <SwiperSlide key={idx}>
                  <div className="w-full aspect-square overflow-hidden">
                    <img
                      src={imgObj.thumb}
                      alt={imgObj.alt || `Thumbnail ${idx + 1}`}
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
            slides={lightboxSlides}
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

                {recipe.ingredientSections?.map((section, secIdx) => (
                  <div key={secIdx} className="mb-6">
                    {section.sectionTitle && (
                      <h3 className="font-heading text-xl mb-2">
                        {section.sectionTitle}
                      </h3>
                    )}
                    {/*  The ingredients within section */}
                    <ul className="font-body list-disc list-outside space-y-1">
                      {section.items?.map((line, idx) => {
                        // line is an IngredientLine: {quanitity, unit, item, notes}
                        const scaledQty = scaleQuantity(
                          line.quantity,
                          recipe.servings,
                          currentServings
                        );

                        return (
                          <li key={idx}>
                            {/* Displayed scaled quantity if numeric */}
                            {typeof scaledQty === "number" &&
                              !isNaN(scaledQty) && (
                                <span>{formatQuantity(scaledQty)}</span>
                              )}
                            {/* Then unit, item */}
                            {line.unit && ` ${line.unit} `}
                            {line.item}
                            {/* NEW – show per-ingredient note, if any */}
                            {line.notes && (
                              <span className="italic text-gray-600">
                                {" "}
                                — {line.notes}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Right: Instructions */}
              <div className="lg:col-span-4 bg-white p-10 rounded">
                <div className="flex w-full flex-col sm:flex-row sm:justify-between border-b border-gray-300 pb-2 mb-4 sm:mt-0 text-center sm:text-left">
                  <h2 className="font-heading text-2xl font-bold mb-2 sm:mb-0 w-full">
                    Instructions
                  </h2>
                  {/* Only show "Hide/Show Photos" if at least one step has an image */}
                  {recipe.instructionSections?.some((instSec) =>
                    instSec.steps?.some((step) => step.image)
                  ) && (
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
                {/* Instructions Sections */}
                {recipe.instructionSections?.map((instSec, secIdx) => (
                  <div key={secIdx} className="mb-6">
                    {instSec.sectionTitle && (
                      <h3 className="font-heading text-xl font-bold mb-2">
                        {instSec.sectionTitle}
                      </h3>
                    )}
                    <ol className="font-body list-decimal list-outside space-y-6">
                      {instSec.steps?.map((step, idx) => (
                        <li key={idx}>
                          <PortableText
                            value={step.text}
                            components={ptComponents}
                          />

                          {showImages && step.image && (
                            <img
                              src={urlFor(step.image)
                                .width(800)
                                .quality(80)
                                .url()}
                              alt={step.image.alt || `Step ${idx + 1}`}
                              className="rounded shadow mt-2"
                            />
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
                {/* Cook’s Notes */}
                {recipe.notes?.length > 0 && (
                  <section className="max-w-screen-lg mx-auto px-4 py-8">
                    <h2 className="font-heading text-2xl font-bold mb-4">
                      Notes
                    </h2>
                    <div className="prose max-w-none">
                      <PortableText
                        value={recipe.notes}
                        components={ptComponents}
                      />
                    </div>
                  </section>
                )}
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

          {combinedRecipes.length > 0 && (
            <section className="mt-14">
              <h3 className="font-heading text-2xl mb-5">Related recipes</h3>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {combinedRecipes.map((doc) => {
                  const img = cardImg(doc.mainImage);
                  return (
                    <li
                      key={doc._id}
                      className="group rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
                    >
                      <a href={`/recipes/${doc.slug}`} className="block">
                        <div className="aspect-[3/2] bg-gray-100">
                          {img ? (
                            <img
                              src={img}
                              alt={doc.mainImage?.alt || doc.title}
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition"
                              loading="lazy"
                            />
                          ) : null}
                        </div>
                        <div className="p-4">
                          <h4 className="font-heading text-lg">{doc.title}</h4>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
          {recipe.relatedPosts?.length > 0 && (
            <section className="mt-12">
              <h3 className="font-heading text-2xl mb-5">From the blog</h3>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recipe.relatedPosts.map((post) => {
                  const img = cardImg(post.mainImage);
                  return (
                    <li
                      key={post._id}
                      className="group rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
                    >
                      <a href={`/blog/${post.slug}`} className="block">
                        <div className="aspect-[3/2] bg-gray-100">
                          {img ? (
                            <img
                              src={img}
                              alt={post.mainImage?.alt || post.title}
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition"
                              loading="lazy"
                            />
                          ) : null}
                        </div>
                        <div className="p-4">
                          <h4 className="font-heading text-lg">{post.title}</h4>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {recipe.externalLinks?.length > 0 && (
            <section className="mt-8">
              <h3 className="font-heading text-xl mb-3">Further reading</h3>
              <ul className="list-disc list-inside space-y-1">
                {recipe.externalLinks.map((l, i) => (
                  <li key={i}>
                    <a href={l.url} target="_blank" rel="noopener nofollow">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </section>
      </div>
    </>
  );
}

export default RecipeDetail;

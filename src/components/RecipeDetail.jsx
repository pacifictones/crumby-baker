import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client, { urlFor } from "../sanityClient";
import { PortableText } from "@portabletext/react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Breadcrumbs from "./Breadcrumbs";
import ThumbnailCarousel from "./ThumbnailCarousel";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

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

  useEffect(() => {
    client
      .fetch(
        `*[_type == "recipe" && slug.current == $slug][0]{
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
        image
        }
        }`,
        { slug }
      )
      .then((data) => {
        console.log("fetched recipe:", data);
        setRecipe(data);
      })

      .catch(console.error);
  }, [slug]);

  if (!recipe) return <div>Loading...</div>;

  const imageUrls = recipe.gallery.map((img) => urlFor(img).url());

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-96 flex items-center px-6 sm:px-12 lg:px-20 mb-10"
        style={{ backgroundImage: `url(${urlFor(recipe.mainImage).url()})` }}
      >
        <div className="abosolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10  text-white px-4">
          <Breadcrumbs />
          <h1 className="font-heading text-4xl font-bold">{recipe.title}</h1>
        </div>
      </section>

      {/* Info and Gallery section */}
      <section className="font-body grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Left: Description and Info */}
        <div>
          <p className="mb-4">{recipe.description}</p>
          <p>
            <strong>Prep Time:</strong> {recipe.prepTime} mins
          </p>
          <p>
            <strong>Cook Time:</strong> {recipe.cookTime} mins
          </p>
          <p>
            <strong>Total Time:</strong> {recipe.totalTime} mins
          </p>
          <p>
            <strong>Servings:</strong> {recipe.servings}
          </p>
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
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Ingredients */}
        <div>
          <h2 className="font-heading text-2xl font-bold mb-4">Ingredients</h2>
          <ul className="font-body list-disc list-inside space-y-1">
            {recipe.ingredients.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Right: Instructions */}
        <div>
          <h2 className="font-heading text-2xl font-bold mb-4">Instructions</h2>
          <button
            onClick={() => setShowImages(!showImages)}
            className="mb-4 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            {showImages ? "Hide Photos" : "Show Photos"}
          </button>
          <ol className="list-decimal list-inside space-y-6">
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
  );
}

export default RecipeDetail;
//  <h1 className="font-heading text-3xl">{recipe.title}</h1>
//       <img
//         className="my-8"
//         src={urlFor(recipe.image).width(400).url()}
//         alt={recipe.title}
//       />
//       <h2 className="font-heading text-2xl">Ingredients</h2>
//       <ul className="font-body my-6">
//         {recipe.ingredients.map((ingredient, index) => (
//           <li key={index}>{ingredient}</li>
//         ))}
//       </ul>
//       <div>
//         <h2 className="font-heading text-2xl font-semibold mb-2">
//           Instructions
//         </h2>
//         <div className="font-body my-6 prose max-w-none">
//           <PortableText
//             value={recipe.instructions}
//             components={{
//               block: {
//                 normal: ({ children }) => (
//                   <p className="text-justify indent-6 mb-4">{children}</p>
//                 ),
//               },
//             }}
//           />
//         </div>
//       </div>

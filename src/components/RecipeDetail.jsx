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
          <p className="mb-8">{recipe.description}</p>
          {/* Row 1: Prep, Cook, Total */}
          <div className="grid grid-cols-3 gap-y-4 text-center mb-4">
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

      <div className=" w-full bg-[#DEE7E7] py-8">
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
              <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-4">
                <h2 className="font-heading text-2xl font-bold mb-4">
                  Instructions
                </h2>
                <button
                  onClick={() => setShowImages(!showImages)}
                  className="mb-4 bg-[#ED6A5A] text-white font-heading px-3 py-1 rounded focus:outline-none focus:ring-0 active:outline-none active:ring-0"
                >
                  {showImages ? "Hide Photos" : "Show Photos"}
                </button>
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

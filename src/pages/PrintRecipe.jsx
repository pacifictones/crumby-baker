import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client, { urlFor } from "../sanityClient";
import { PortableText } from "@portabletext/react";

const PrintRecipe = () => {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [columnCount, setColumnCount] = useState(1);
  const [showImage, setShowImage] = useState(true);
  const [showDescription, setShowDescription] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "recipe" && slug.current == $slug][0]{
                    title,
                    mainImage,
                    description,
                    prepTime,
                    cookTime,
                    totalTime,
                    servings,
                    ingredients,
                    instructions
                    }`,
          { slug }
        );
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    fetchRecipe();
  }, [slug]);

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="printable-recipe max-w-4xl mx-auto p-8 font-body">
      {/*  Toggle Buttons + Print Button */}
      <div className="no-print mb-4 flex flex-wrap gap-4">
        <button
          onClick={() => setColumnCount(1)}
          className={` font-heading px-3 rounded ${
            columnCount === 1
              ? "bg-brand-primary text-white"
              : "bg-gray-200 text-black"
          } `}
        >
          1 Column
        </button>
        <button
          onClick={() => setColumnCount(2)}
          className={` px-3 rounded font-heading ${
            columnCount === 2
              ? "bg-brand-primary text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          2 Columns
        </button>
        <button
          onClick={() => setShowImage(!showImage)}
          className={` px-3 rounded font-heading ${
            showImage ? "bg-brand-primary text-white" : "bg-gray-200 text-black"
          }`}
        >
          {showImage ? "Hide Image" : "Show Image"}
        </button>
        <button
          onClick={() => setShowDescription(!showDescription)}
          className={` px-3 rounded font-heading ${
            showDescription
              ? "bg-brand-primary text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          {showDescription ? "Hide Description" : "Show Description"}
        </button>
        <button
          onClick={() => window.print()}
          className="px-3 py-1 rounded font-heading bg-brand-primary text-white"
        >
          Print Preview
        </button>
      </div>

      {/* Recipe Info */}

      <h1 className="text-3xl font-heading mb-4">{recipe.title}</h1>

      {showImage && recipe.mainImage && (
        <img
          src={urlFor(recipe.mainImage).url()}
          alt={recipe.title}
          className="mb-4 w-full rounded shadow"
        />
      )}
      <div className="grid grid-cols-4 gap-2 text-center mb-6 border-b pb-4 border-gray-300">
        <div>
          <p className="font-heading">Prep</p>
          <p className="font-heading font-bold">{recipe.prepTime} mins</p>
        </div>
        <div>
          <p className="font-heading">Cook</p>
          <p className="font-heading font-bold">{recipe.cookTime} mins</p>
        </div>
        <div>
          <p className="font-heading">Total</p>
          <p className="font-heading font-bold">{recipe.totalTime} mins</p>
        </div>
        <div>
          <p className="font-heading">Servings</p>
          <p className="font-heading font-bold">{recipe.servings}</p>
        </div>
      </div>

      {/* Description  */}

      {showDescription && recipe.description && (
        <p className="mb-8 font-body">{recipe.description}</p>
      )}

      <div
        className={
          columnCount === 2
            ? "grid grid-cols-6 gap-8"
            : "grid grid-cols-1 gap-8"
        }
      >
        <div className={columnCount === 2 ? "col-span-2" : "col-span-1"}>
          <h2 className="text-2xl font-heading mb-2">Ingredients</h2>
          <ul className="font-body list-disc list-outside mb-4">
            {recipe.ingredients.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        <div className={columnCount === 2 ? "col-span-4" : "col-span-1"}>
          <h2 className="text-2xl font-heading mb-2">Instrucitons</h2>
          <ol className="font-body list-decimal list-outside space-y-3">
            {recipe.instructions.map((step, idx) => (
              <li key={idx}>
                <PortableText value={step.text} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PrintRecipe;

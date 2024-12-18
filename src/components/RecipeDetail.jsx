import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client, { urlFor } from "../sanityClient";
import { PortableText } from "@portabletext/react";

function RecipeDetail() {
  const { slug } = useParams(); // Get the slug from the URL
  const [recipe, setRecipe] = useState(null); // State to store recipe data

  useEffect(() => {
    client
      .fetch(
        `*[_type == "recipe" && slug.current == $slug][0]{
        title,
        image,
        ingredients,
        instructions
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

  return (
    <div>
      <h1 className="font-heading text-3xl">{recipe.title}</h1>
      <img
        className="my-8"
        src={urlFor(recipe.image).width(400).url()}
        alt={recipe.title}
      />
      <h2 className="font-heading text-2xl">Ingredients</h2>
      <ul className="font-body my-6">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <div>
        <h2 className="font-heading text-2xl font-semibold mb-2">
          Instructions
        </h2>
        <div className="font-body my-6 prose max-w-none">
          <PortableText
            value={recipe.instructions}
            components={{
              block: {
                normal: ({ children }) => (
                  <p className="text-justify indent-6 mb-4">{children}</p>
                ),
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;

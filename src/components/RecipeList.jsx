import React, { isValidElement, useEffect, useState } from "react";
import client, { urlFor } from "../sanityClient";
import { Link } from "react-router-dom";

const RecipeList = ({ filterCategory, sortOption }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    client
      .fetch(
        '*[_type == "recipe"]{_id,title, "image": image.asset->url, slug, category, _createdAt}'
      )
      .then((data) => setRecipes(data))
      .catch(console.error);
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    if (filterCategory === "All") return true;
    return recipe.category === filterCategory;
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortOption === "Newest") {
      return new Date(b._createdAt) - new Date(a._createdAt);
    } else if (sortOption === "Oldest") {
      return new Date(a._createdAt) - new Date(b._createdAt);
    } else if (sortOption === "Alphabetical") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
      {sortedRecipes.map((recipe) => {
        console.log("Rendering recipe: ", recipe);
        if (!recipe.slug) {
          return null;
        }

        return (
          <div
            key={recipe._id}
            className="recipe-thumbnail text-center mx-auto border border-gray-200 rounded-lg sahdow-md overflow-hidden"
          >
            <Link to={`/recipes/${recipe.slug.current}`} className="block">
              <div className="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={urlFor(recipe.image).width(300).url()}
                  alt={recipe.title}
                />
              </div>
              <div className="flex items-center justify-center h-16">
                <h3 className="text-lg font-semibold mt-2">{recipe.title}</h3>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default RecipeList;

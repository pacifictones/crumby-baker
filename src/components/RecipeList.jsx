import React, { isValidElement, useEffect, useState } from "react";
import client, { urlFor } from "../sanityClient";
import { Link } from "react-router-dom";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    client
      .fetch('*[_type == "recipe"]{_id,title, "image": image.asset->url, slug}')
      .then((data) => setRecipes(data))
      .catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {recipes.map((recipe) => {
        console.log("Rendering recipe: ", recipe);
        if (!recipe.slug) {
          return null;
        }

        return (
          <div key={recipe._id} className="recipe-thumbnail">
            <Link to={`/recipes/${recipe.slug.current}`}>
              <img
                src={urlFor(recipe.image).width(200).url()}
                alt={recipe.title}
              />
              <h3>{recipe.title}</h3>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default RecipeList;

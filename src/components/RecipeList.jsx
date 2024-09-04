import React, { isValidElement, useEffect, useState } from "react";
import client from "../sanityClient";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    client
      .fetch('*[_type == "recipe"]') //Fetch all documents of type "recipe"
      .then((data) => setRecipes(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      {recipes.map((recipe) => (
        <div key={recipe._id}>
          <h2>{recipe.title}</h2>
          <p>{recipe.instructions}</p>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          {recipe.image && (
            <img src={recipe.image.asset.url} alt={recipe.title} />
          )}
        </div>
      ))}
    </div>
  );
};

export default RecipeList;

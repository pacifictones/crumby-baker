import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import client, { urlFor } from "../sanityClient";

function RecipeDetail() {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState(null);

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
      .then((data) => setRecipe(data))
      .catch(console.error);
  }, [slug]);

  if (!recipe) return <div>Loading...</div>;

  return (
    <div>
      <h1>{recipe.title}</h1>
      <img src={urlFor(recipe.image).width(400).url()} alt={recipe.title} />
      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h2>Instructions</h2>
      <p>{recipe.instructions}</p>
    </div>
  );
}

export default RecipeDetail;

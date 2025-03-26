import React from "react";
import { Helmet } from "react-helmet";
import { urlFor } from "../sanityClient";

function RecipeSchema({ recipe, reviews = [] }) {
  function toISOTime(minutes) {
    if (!minutes || typeof minutes !== "number") return undefined;
    return `PT${minutes}M`;
  }

  // Buil an array of ingredients
  const allIngredients = [];
  recipe.ingredientSections?.forEach((section) => {
    section.items?.forEach((line) => {
      const quantityPart =
        typeof line.quantity === "number"
          ? `${line.quantity} `
          : line.quantity
            ? `${line.quantity} 
            `
            : "";
      const unitPart = line.unit ? `${line.unit} ` : "";
      const itemPart = line.item || "";
      const combined = `${quantityPart}${unitPart}${itemPart}`.trim();

      if (combined) {
        allIngredients.push(combined);
      }
    });
  });

  //Build an array of steps. Each step is an object wth "@type": "HowToStep"
  //and a "text" property in Google's format.
  const allSteps = [];
  recipe.instructionSections?.forEach((instSec) => {
    instSec.steps?.forEach((step) => {
      allSteps.push({
        "@type": "HowToStep",
        text: step.text
          ? step.text
              .map((block) =>
                typeof block === "string"
                  ? block
                  : block.children?.map((c) => c.text).join(" ")
              )
              .join(" ")
          : "",
        image: step.image ? [step.image] : undefined,
      });
    });
  });

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / totalReviews
      : 0;

  const recipeData = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    image: recipe.mainImage ? [urlFor(recipe.mainImage).url()] : [],
    recipeIngredient: allIngredients,
    recipeInstructions: allSteps,
    prepTime: toISOTime(recipe.prepTime),
    cookTime: toISOTime(recipe.cookTime),
    totalTime: toISOTime(recipe.totalTime),
  };

  if (totalReviews > 0) {
    recipeData.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: averageRating.toFixed(1),
      reviewCount: totalReviews.toString(),
      bestRating: "5",
      worstRating: "1",
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(recipeData)}</script>
    </Helmet>
  );
}

export default RecipeSchema;

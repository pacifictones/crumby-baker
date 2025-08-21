// RecipeSchema.jsx
import React from "react";
// Use the same Helmet library app-wide. If you already use react-helmet-async elsewhere,
// keep this import as-is. Otherwise switch to "react-helmet" here and in your app root.
import { Helmet } from "react-helmet-async";
import { urlFor } from "../sanityClient";

function toISOTime(minutes) {
  if (!minutes || typeof minutes !== "number") return undefined;
  return `PT${minutes}M`;
}

function clean(obj) {
  Object.keys(obj).forEach((k) => {
    const v = obj[k];
    if (
      v === undefined ||
      v === null ||
      (Array.isArray(v) && v.length === 0) ||
      (typeof v === "object" &&
        !Array.isArray(v) &&
        Object.keys(v).length === 0)
    ) {
      delete obj[k];
    }
  });
  return obj;
}

export default function RecipeSchema({ recipe, reviews = [], canonicalUrl }) {
  if (!recipe?.title) return null;

  // 1) Canonical URL: prefer prop; otherwise build from location (client-side)
  let pageUrl = canonicalUrl;
  if (!pageUrl && typeof window !== "undefined") {
    pageUrl = window.location.origin + window.location.pathname;
  }

  // 2) Main image URL (nice large size)
  const mainImageUrl = recipe.mainImage
    ? urlFor(recipe.mainImage).width(1600).quality(80).url()
    : undefined;

  // 3) Ingredients (flatten sections)
  const recipeIngredient = [];
  recipe.ingredientSections?.forEach((section) => {
    section.items?.forEach((line) => {
      const qty =
        typeof line.quantity === "number"
          ? String(line.quantity)
          : (line.quantity || "").trim();
      const unit = line.unit ? ` ${line.unit}` : "";
      const item = line.item || "";
      const notes = line.notes ? ` (${line.notes})` : "";
      const combined = `${
        qty ? qty + " " : ""
      }${unit.trim()} ${item}${notes}`.trim();
      if (combined) recipeIngredient.push(combined);
    });
  });

  // 4) Instructions (text + optional image URL)
  const recipeInstructions = [];
  recipe.instructionSections?.forEach((instSec) => {
    instSec.steps?.forEach((step) => {
      const text = Array.isArray(step.text)
        ? step.text
            .map((block) =>
              typeof block === "string"
                ? block
                : block?.children?.map((c) => c.text).join(" ")
            )
            .join(" ")
        : step.text || "";
      const imageUrl = step.image
        ? urlFor(step.image).width(1200).quality(80).url()
        : undefined;

      const node = clean({
        "@type": "HowToStep",
        text,
        image: imageUrl ? [imageUrl] : undefined,
      });
      recipeInstructions.push(node);
    });
  });

  // 5) Ratings → AggregateRating
  const ratings = (reviews || [])
    .map((r) => Number(r.rating))
    .filter((n) => Number.isFinite(n));
  const aggregateRating =
    ratings.length > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: (
            ratings.reduce((a, b) => a + b, 0) / ratings.length
          ).toFixed(2),
          ratingCount: ratings.length,
          bestRating: "5",
          worstRating: "1",
        }
      : undefined;

  // 6) Core JSON-LD
  const data = clean({
    "@context": "https://schema.org",
    "@type": "Recipe",
    "@id": pageUrl ? `${pageUrl}#recipe` : undefined,
    mainEntityOfPage: pageUrl
      ? { "@type": "WebPage", "@id": pageUrl }
      : undefined,

    name: recipe.title,
    description: recipe.description || undefined,
    image: mainImageUrl ? [mainImageUrl] : undefined,
    author: { "@type": "Person", name: "The Crumby Baker" },

    datePublished: recipe._createdAt,
    prepTime: toISOTime(recipe.prepTime),
    cookTime: toISOTime(recipe.cookTime),
    totalTime: toISOTime(recipe.totalTime),
    recipeYield: recipe.servings ? `${recipe.servings} servings` : undefined,
    recipeCategory: "Dessert",
    recipeCuisine: "Sri Lankan",

    recipeIngredient,
    recipeInstructions,
    ...(aggregateRating ? { aggregateRating } : {}),
  });

  return (
    <Helmet>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Helmet>
  );
}

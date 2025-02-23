import { createClient } from "@sanity/client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    //parse incoming JSON
    const { recipeId, rating, reviewText, authorName } = req.body;

    // Create Sanity client using secret token from Vercel
    const client = createClient({
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET || "production",
      useCdn: false,
      token: process.env.SANITY_WRITE_TOKEN,
      apiVersion: "2023-03-01",
    });

    // Create new review
    const newReview = await client.create({
      _type: "review",
      recipe: { _type: "reference", _ref: recipeId },
      rating,
      reviewText,
      authorName,
      confirmed: true,
    });

    // Return the new review
    return res.status(200).json(newReview);
  } catch (error) {
    console.error("Error in submitReview", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

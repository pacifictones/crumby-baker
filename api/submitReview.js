import { createClient } from "@sanity/client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    //parse incoming JSON
    const { recipeId, rating, reviewText, authorName, email } = req.body;

    console.log("Recieved recipeId in API:", recipeId);
    console.log("Full payload:", {
      recipeId,
      rating,
      reviewText,
      authorName,
      email,
    });

    if (!recipeId) {
      throw new Error("Missing recipeId in request");
    }

    // Create Sanity client using secret token from Vercel
    const client = createClient({
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET || "production",
      useCdn: false,
      token: process.env.SANITY_WRITE_TOKEN,
      apiVersion: "2023-03-01",
    });

    // Create a unique confirmationCode
    const confirmationCode = [...crypto.getRandomValues(new Uint8Array(16))]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Create new review
    const newReview = await client.create({
      _type: "review",
      recipe: {
        _type: "reference",
        _ref: recipeId,
        _weak: false,
      },
      rating,
      reviewText,
      authorName,
      email,
      confirmed: false,
      confirmationCode,
    });

    console.log("New review doc in Sanity:", newReview);

    // Send confirmation email by calling sendReviewConfirmation
    await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/sendReviewConfirmation`,
      {
        method: "POST",
        headers: { "Conent-Type": "application/json" },
        body: JSON.stringify({
          reviewId: newReview._id,
          email,
          confirmationCode,
        }),
      }
    );

    console.log("Confirmation email triggered!");

    // Return a success response
    return res.status(200).json({
      message: "Review submitted, check your email for confirmation!",
    });
  } catch (error) {
    console.error("Error in submitReview", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

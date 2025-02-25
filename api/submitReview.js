import { createClient } from "@sanity/client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Parse incoming JSON
    const { recipeId, rating, reviewText, authorName, email } = req.body;

    if (!recipeId) {
      throw new Error("Missing recipeId in request");
    }

    console.log("✅ Received request with recipeId:", recipeId);
    console.log("✅ Full payload:", {
      recipeId,
      rating,
      reviewText,
      authorName,
      email,
    });

    // Create Sanity client
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

    // Create new review in Sanity
    const newReview = await client.create({
      _type: "review",
      recipe: { _type: "reference", _ref: recipeId, _weak: false },
      rating,
      reviewText,
      authorName,
      email,
      confirmed: false,
      confirmationCode,
    });

    console.log("✅ New review created in Sanity:", newReview);

    // Check if NEXT_PUBLIC_SITE_URL is set properly
    const sendReviewUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/sendReviewConfirmation`;
    console.log("⚠️ [submitReview] Calling URL:", sendReviewUrl);

    // Send confirmation email by calling sendReviewConfirmation
    let confirmResp;
    try {
      confirmResp = await fetch(sendReviewUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: newReview._id,
          email,
          confirmationCode,
        }),
      });

      // Check if response is okay
      console.log(
        "🔎 Confirmation request status:",
        confirmResp.status,
        confirmResp.ok
      );
      const confirmText = await confirmResp.text();
      console.log("🔎 Confirmation response:", confirmText);
    } catch (fetchError) {
      console.error("❌ Error calling sendReviewConfirmation:", fetchError);
    }

    // Return success response
    return res.status(200).json({
      message: "Review submitted, check your email for confirmation!",
    });
  } catch (error) {
    console.error("❌ Error in submitReview:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

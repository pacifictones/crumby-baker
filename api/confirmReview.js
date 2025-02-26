import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: "production",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

export default async function handler(req, res) {
  console.log("⚠️ [confirmReview] API route invoked!");
  console.log("⚠️ [confirmReview] Method:", req.method);

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { code } = req.query;
  console.log("⚠️ [confirmReview] Received confirmation code:", code);

  if (!code) {
    return res.status(400).json({ message: "No confirmation code provided" });
  }

  try {
    //look up the reivew by confirmationCode
    const review = await sanityClient.fetch(
      `*[_type == "review" && confirmationCode == $code] [0]`,
      { code }
    );
    if (!review) {
      console.log("❌ [confirmReview] Review not found in Sanity!");
      return res.status(404).json({ message: "Review not found" });
    }

    console.log("✅ [confirmReview] Review found:", review);
    // Mark the review as confirmed
    const updatedReview = await sanityClient
      .patch(review._id)
      .set({ confirmed: true })
      .commit();

    console.log(
      "✅ [confirmReview] Review successfully updated:",
      updatedReview
    );

    // Send HTML response
    return res.redirect(302, "/").status(200);
    //   .send("<h1>Your review is now confirmed. Thanks!</h1>");
  } catch (error) {
    console.error("Error confirming review:", error);
    return res.status(500).json({ message: "Server error confirming review" });
  }
}

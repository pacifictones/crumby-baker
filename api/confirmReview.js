import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: "production",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ message: "No confirmation code provided" });
  }

  try {
    //look up the reivew by confirmationCode
    const review = await sanityClient.fetch(
      `[_type == "review" && confirmationCode == $code] [0]`,
      { code }
    );
    if (!reivew) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Mark the review as confirmed
    await sanityClient.patch(review._id).set({ confirmed: true }).commit();

    // Send HTML response
    return res
      .status(200)
      .send("<h1>Your review is now confirmed. Thanks!</h1>");
  } catch (error) {
    console.error("Error confirming review:", error);
    return res.status(500).json({ message: "Server error confirming review" });
  }
}

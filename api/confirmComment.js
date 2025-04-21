import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: "production",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  const { code } = req.query;
  if (!code) return res.status(400).json({ message: "No code" });

  const comment = await client.fetch(
    `*[_type == "comment" && confirmationCode == $code][0]`,
    { code }
  );

  if (!comment) return res.status(404).json({ message: "Not found" });

  await client.patch(comment._id).set({ confirmed: true }).commit();

  // redirect to homepage or thank‑you page
  return res.redirect(302, "/");
}

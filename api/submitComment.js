import { createClient } from "@sanity/client";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { blogId, text, authorName, email, parentId } = req.body;
  if (!blogId || !text || !email)
    return res.status(400).json({ message: "Missing fields" });

  const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: "production",
    useCdn: false,
    token: process.env.SANITY_WRITE_TOKEN,
    apiVersion: "2023-03-01",
  });

  // create random confirmation code
  const confirmationCode = [...crypto.getRandomValues(new Uint8Array(16))]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const newComment = await client.create({
    _type: "comment",
    blog: { _type: "reference", _ref: blogId },
    parent: parentId ? { _type: "reference", _ref: parentId } : undefined,
    text,
    authorName,
    email,
    confirmed: false,
    confirmationCode,
  });

  // Fire off email
  await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/sendCommentConfirmation`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        confirmationCode,
      }),
    }
  );

  return res.status(200).json({ message: "Check your email to confirm!" });
}

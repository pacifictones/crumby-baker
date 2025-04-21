import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: "production",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).send("Method not allowed");

  const { code } = req.query;
  if (!code) return res.status(400).send("No code");

  // 1) find the comment and grab its blog’s slug
  const result = await client.fetch(
    `*[_type == "comment" && confirmationCode == $code][0]{
      _id,
      blog->{ "slug": slug.current }
    }`,
    { code }
  );
  if (!result) return res.status(404).send("Not found");

  // 2) mark confirmed
  await client.patch(result._id).set({ confirmed: true }).commit();

  // 3) redirect back to that post’s comments section
  const slug = result.blog?.slug;
  const dest = slug ? `/blog/${slug}#comments?confirmed=true` : `/`;
  return res.redirect(302, dest);
}

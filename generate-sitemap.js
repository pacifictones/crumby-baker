import "dotenv/config";
import { SitemapStream, streamToPromise } from "sitemap";

import { writeFileSync } from "fs";
import client from "./src/sanityClient.js";

async function generateSitemap() {
  // Query Sanity for all recipes
  const recipes = await client.fetch(
    `*[_type == "recipe"]{"slug": slug.current }`
  );

  // Map recipes to sitemap entries
  const recipeUrls = recipes.map((recipe) => ({
    url: `/recipes/${recipe.slug}`,
    changefreq: "daily",
    priority: 0.8,
  }));

  const smStream = new SitemapStream({
    hostname: "https://thecrumbybaker.com",
  });

  // Write homepage and static pages

  smStream.write({ url: "/", changefreq: "daily", priority: 1.0 });
  smStream.write({ url: "/about", changefreq: "monthly", priority: 0.5 }),
    smStream.write({ url: "/blog", changefreq: "weekly", priority: 0.6 }),
    // Write each recipe URL
    recipeUrls.forEach((urlEntry) => {
      smStream.write(urlEntry);
    });

  // End stream
  smStream.end();

  // Convert stream to string
  const sitemapOutput = await streamToPromise(smStream);

  // Write sitemap.xml to public folder
  writeFileSync("./public/sitemap.xml", sitemapOutput.toString());
  console.log("Sitemap generated successfully!");
}

generateSitemap().catch((err) => {
  console.error("Error generating sitemap:", err);
});

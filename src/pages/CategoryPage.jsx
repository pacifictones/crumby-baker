// src/pages/CategoryPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import client, { urlFor } from "../sanityClient";
import ResponsiveCarouselGrid from "../components/ResponsiveCarouselGrid";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { cat, rec, blg } = await client.fetch(
        `{
          "cat": *[_type=="category" && slug.current==$slug][0]{title},
          "rec": *[_type=="recipe" && $slug in categories[]->slug.current]{
            _id,title,slug,"image":mainImage
          } | order(_createdAt desc),
          "blg": *[_type=="blog" && $slug in categories[]->slug.current]{
            _id,title,slug,"image":mainImage
          } | order(_createdAt desc)
        }`,
        { slug }
      );
      setCategory(cat);
      setRecipes(rec);
      setBlogs(blg);
    }
    fetchData();
  }, [slug]);

  if (!category) return <div className="p-10 text-center">Loading…</div>;

  return (
    <>
      <Helmet>
        <title>{category.title} | The Crumby Baker</title>
      </Helmet>

      {/* ◀── Wrap everything in this dark container ──▶ */}
      <div className="bg-[#DEE7E7]">
        {/* Recipes always shows on that background */}
        {recipes.length > 0 && (
          <section className="max-w-screen-xl mx-auto px-4 py-14 text-center">
            <h2 className="font-heading text-2xl mb-8">Recipes</h2>
            <ResponsiveCarouselGrid
              items={recipes}
              renderItem={(r) => (
                <Link
                  to={`/recipes/${r.slug.current}`}
                  className="rounded shadow flex flex-col hover:text-brand-primary"
                >
                  <div className="w-full aspect-square overflow-hidden">
                    <img
                      src={urlFor(r.image).width(400).quality(80).url()}
                      alt={r.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 bg-[#f9f9f7]">
                    <h3 className="font-heading text-center font-bold">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              )}
            />
          </section>
        )}

        {/* Blog section, if it exists, sits *above* that same wrapper */}
        {blogs.length > 0 && (
          <section className="max-w-screen-xl mx-auto px-4 py-14 text-center bg-white">
            <h2 className="font-heading text-2xl mb-8">Blog Posts</h2>
            <ResponsiveCarouselGrid
              items={blogs}
              renderItem={(b) => (
                <Link
                  to={`/blog/${b.slug.current}`}
                  className="rounded shadow flex flex-col hover:text-brand-primary"
                >
                  <div className="w-full aspect-square overflow-hidden">
                    <img
                      src={urlFor(b.image).width(400).quality(80).url()}
                      alt={b.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 bg-[#f9f9f7]">
                    <h3 className="font-heading text-center font-bold">
                      {b.title}
                    </h3>
                  </div>
                </Link>
              )}
            />
          </section>
        )}
      </div>

      {/* Your footer can remain exactly as-is */}
    </>
  );
}

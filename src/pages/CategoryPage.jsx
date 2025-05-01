// src/pages/CategoryPage.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import client, { urlFor } from "../sanityClient";
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
            _id, title, slug, "image": mainImage
          } | order(_createdAt desc),
          "blg": *[_type=="blog" && $slug in categories[]->slug.current]{
            _id, title, slug, "image": mainImage
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

      {/* ——— WRAPPER THAT COVERS FULL WIDTH ——— */}
      <div className="w-full bg-[#DEE7E7]">
        {/* ——— RECIPES BAND ——— */}
        {recipes.length > 0 && (
          <div className="max-w-screen-xl mx-auto px-4 py-12">
            <h2 className="font-heading text-2xl inline-block mb-6 pb-1 ">
              Recipes
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4  xl:grid-cols-6 gap-6">
              {recipes.map((r) => (
                <Link
                  key={r._id}
                  to={`/recipes/${r.slug.current}`}
                  className="group block rounded shadow overflow-hidden hover:text-brand-primary"
                >
                  <div className="w-full aspect-square overflow-hidden">
                    <img
                      src={urlFor(r.image).width(400).quality(80).url()}
                      alt={r.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-2 bg-[#f9f9f7] text-center">
                    <h3 className="font-heading text-base font-semibold">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ——— BLOG BAND ——— */}
        {blogs.length > 0 && (
          <div className="w-full bg-white">
            <div className="max-w-screen-xl mx-auto px-4 py-12">
              <h2 className="font-heading text-2xl inline-block mb-6 pb-1 ">
                Blog Posts
              </h2>

              <div className="grid grid-cols-2  md:grid-cols-4 xl:grid-cols-6 gap-6">
                {blogs.map((b) => (
                  <Link
                    key={b._id}
                    to={`/blog/${b.slug.current}`}
                    className="group block rounded shadow overflow-hidden hover:text-brand-primary"
                  >
                    <div className="w-full aspect-square overflow-hidden">
                      <img
                        src={urlFor(b.image).width(400).quality(80).url()}
                        alt={b.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-2 bg-[#f9f9f7] text-center">
                      <h3 className="font-heading text-base font-semibold">
                        {b.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ——— FOOTER ——— */}
      {/* (your existing Footer component here) */}
    </>
  );
}

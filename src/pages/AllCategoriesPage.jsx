import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import client, { urlFor } from "../sanityClient";

export default function AllCategoriesPage() {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    client
      .fetch(
        `*[_type=="category"]|order(title asc){
        _id, title, slug, image
      }`
      )
      .then(setCats)
      .catch((err) => console.error("Category fetch failed:", err));
  }, []);

  if (!cats.length) return <div className="p-10 text-center">Loading…</div>;

  return (
    <div className="max-w-screen-xl mx-auto px-4 pb-16">
      <Helmet>
        <title>Categories | The Crumby Baker</title>
      </Helmet>
      <h1 className="font-heading text-4xl text-center my-10">
        All Categories
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {cats.map((c) => {
          /* ---------- choose a safe image source ---------- */
          const hasImg = c.image && c.image.asset;
          const imgSrc = hasImg
            ? urlFor(c.image).width(400).height(400).fit("crop").url()
            : "/photos/placeholder.jpg"; // make sure this exists in /public/img

          /* ---------- the actual card ---------- */
          return (
            <Link
              key={c._id}
              to={`/category/${c.slug.current}`}
              className="group rounded shadow overflow-hidden flex flex-col hover:text-brand-primary"
            >
              <div className="w-full aspect-square overflow-hidden">
                <img
                  src={imgSrc}
                  alt={hasImg ? c.image.alt || c.title : c.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 bg-[#f9f9f7] flex-1 flex items-center justify-center">
                <h3 className="font-heading text-lg font-bold text-center">
                  {c.title}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

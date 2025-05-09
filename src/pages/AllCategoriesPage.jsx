import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import client, { urlFor } from "../sanityClient";
import ContentError from "./ContentError";
import Loading from "../components/Loading";

export default function AllCategoriesPage() {
  const [cats, setCats] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await client.fetch(
          `*[_type == "category"] | order(title asc) {
            _id,
            title,
            slug,
            image
          }`
        );
        setCats(data);
      } catch (err) {
        console.error("Category fetch failed:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCats();
  }, []);

  if (error) return <ContentError message="We couldn't load the categories." />;
  if (loading) return <Loading />;

  return (
    <div className="max-w-screen-xl mx-auto px-4 pb-16">
      <Helmet>
        <title>Categories | The Crumby Baker</title>
      </Helmet>
      <h1 className="font-heading text-4xl text-center my-10">
        All Categories
      </h1>

      <div className="grid gap-6 grid-cols-2 md:grid-cols-4  xl:grid-cols-6 ">
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

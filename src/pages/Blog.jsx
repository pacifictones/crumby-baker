// src/pages/Blog.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import client from "../sanityClient";

export default function Blog() {
  const PER_PAGE = 8;

  const [posts, setPosts] = useState([]);
  const [loading, setLoad] = useState(true);

  /* ▼▼ NEW ▼▼ */
  const [cats, setCats] = useState([]); // {id,title}
  const [catId, setCatId] = useState("all"); // dropdown value
  /* ▲▲ NEW ▲▲ */

  const [sortOpt, setSort] = useState("Newest");
  const [visible, setVis] = useState(PER_PAGE);

  /* ─ fetch categories & posts once ─ */
  useEffect(() => {
    (async () => {
      setLoad(true);

      // 1) categories
      const catData = await client.fetch(
        `*[_type=="category"] | order(title asc){
          _id, title
        }`
      );
      setCats(catData);

      // 2) blog posts with populated category refs
      const postData = await client.fetch(
        `*[_type=="blog"]{
          title,
          excerpt,
          "image": mainImage.asset->url,
          slug,
          _createdAt,
          "categories": categories[]->{_id,title}
        }`
      );

      setPosts(sortPosts(postData, "Newest"));
      setLoad(false);
    })();
  }, []);

  /* re-sort when dropdown changes */
  useEffect(() => {
    if (posts.length) setPosts(sortPosts(posts, sortOpt));
    setVis(PER_PAGE); // reset pagination
  }, [sortOpt]);

  /* helper */
  const sortPosts = (arr, opt) => {
    const s = [...arr];
    if (opt === "Newest")
      s.sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt));
    else s.sort((a, b) => new Date(a._createdAt) - new Date(b._createdAt));
    return s;
  };

  /* ▼▼ NEW : filter by chosen category before slicing for pagination ▼▼ */
  const filtered =
    catId === "all"
      ? posts
      : posts.filter((p) => p.categories?.some((c) => c._id === catId));

  const shown = filtered.slice(0, visible);
  /* ▲▲ NEW ▲▲ */

  return (
    <>
      <Helmet>
        <title>Blog</title>
      </Helmet>

      <div className="max-w-screen-xl mx-auto px-4">
        <header className="text-center py-10">
          <h1 className="font-heading text-4xl font-bold">
            Crumby Baker Blogs
          </h1>
        </header>

        {/* ── filters row ── */}
        <div className="font-heading flex flex-wrap justify-center gap-6 my-6">
          {/* ▼▼ NEW Category dropdown ▼▼ */}
          <div className="flex items-center gap-2">
            <label htmlFor="catSel" className="font-semibold">
              Category:
            </label>
            <select
              id="catSel"
              value={catId}
              onChange={(e) => {
                setCatId(e.target.value);
                setVis(PER_PAGE);
              }}
              className="border rounded px-2 py-1"
            >
              <option value="all">All</option>
              {cats.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          {/* ▲▲ NEW ▲▲ */}

          {/* sort dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sortSel" className="font-semibold">
              Sort&nbsp;by:
            </label>
            <select
              id="sortSel"
              value={sortOpt}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* ── loading ── */}
        {loading && (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-8 w-8 rounded-full border-t-2 border-b-2 border-gray-500" />
          </div>
        )}

        {/* ── cards ── */}
        {!loading &&
          (filtered.length > 0 ? (
            <>
              <div
                className="
                flex flex-nowrap gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide
                sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible
                lg:grid-cols-4 lg:gap-8 lg:justify-center
                py-4 px-2
              "
              >
                {shown.map((b) => (
                  <Link
                    key={b.slug.current}
                    to={`/blog/${b.slug.current}`}
                    className="flex flex-col rounded shadow hover:text-brand-primary w-72 sm:w-auto"
                  >
                    <div className="w-full aspect-square overflow-hidden">
                      <img
                        src={b.image}
                        alt={b.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4 bg-[#f9f9f7]">
                      <h3 className="font-heading text-xl font-bold mb-2">
                        {b.title}
                      </h3>
                      <p className="font-body text-sm text-gray-600">
                        {b.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {visible < filtered.length && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => setVis((v) => v + PER_PAGE)}
                    className="font-heading bg-brand-primary text-white px-6 py-2 rounded hover:bg-brand-hover"
                  >
                    Show&nbsp;more
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500">
              No posts in this category.
            </p>
          ))}
      </div>
    </>
  );
}

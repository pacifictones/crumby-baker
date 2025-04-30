import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import client from "../sanityClient";

/* ──────────────────────────────────────────
   1. LOCAL STATE
   ──────────────────────────────────────────*/
const PER_PAGE = 8; // how many cards shown each “page”

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  /* category list for the dropdown  */
  const [cats, setCats] = useState([]); // [{_id,title,slug}]
  const [selectedCatId, setCat] = useState(""); // '' = All categories

  /* paging */
  const [visible, setVisible] = useState(PER_PAGE);

  /* ───────────────────────────────────────
       2.  FETCH ALL CATEGORIES   (once)
     ───────────────────────────────────────*/
  useEffect(() => {
    client
      .fetch('*[_type=="category"]{_id,title,slug} | order(title asc)')
      .then(setCats)
      .catch(console.error);
  }, []);

  /* ───────────────────────────────────────
       3.  FETCH RECIPES  (runs whenever
           selectedCatId OR sort option changes)
     ───────────────────────────────────────*/
  const [sortOpt, setSort] = useState("Newest");

  useEffect(() => {
    setLoading(true);
    setVisible(PER_PAGE); // reset paging on every new fetch

    /* =========== QUERY =========== */
    const baseFields = `{title, "image": mainImage.asset->url, slug,
        "categories": categories[]->{_id,title},
        description, _createdAt}`;
    const query = selectedCatId
      ? `*[_type=="recipe" && $cid in categories[]._ref]|order(_createdAt desc)${baseFields}`
      : `*[_type=="recipe"]|order(_createdAt desc)${baseFields}`;

    client
      .fetch(query, { cid: selectedCatId })
      .then((recData) => {
        /* optional secondary sort in JS */
        const sorted = [...recData].sort((a, b) => {
          if (sortOpt === "Newest")
            return new Date(b._createdAt) - new Date(a._createdAt);
          if (sortOpt === "Oldest")
            return new Date(a._createdAt) - new Date(b._createdAt);
          return a.title.localeCompare(b.title); // Alphabetical
        });
        setRecipes(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCatId, sortOpt]);

  /* ──────────────────────────────────────────
   4.  RENDER
   ──────────────────────────────────────────*/
  const visibleRecipes = recipes.slice(0, visible);

  return (
    <>
      <Helmet>
        <title>Recipes</title>
      </Helmet>
      <div className="max-w-screen-xl mx-auto px-4">
        {/* HEADER, DROPDOWNS ─────────────────── */}
        <header className="text-center py-10">
          <h1 className="font-heading text-4xl font-bold mb-4">
            Crumby Baker Recipes
          </h1>

          <div className="font-heading flex flex-wrap justify-center gap-4 mt-8">
            {/* ◾ Category dropdown */}
            <select
              value={selectedCatId}
              onChange={(e) => setCat(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="">All categories</option>
              {cats.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>

            {/* ◾ Sort dropdown */}
            <select
              value={sortOpt}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
              <option value="Alphabetical">A → Z</option>
            </select>
          </div>
        </header>

        {/* GRID / LOADING ─────────────────────── */}
        {loading ? (
          <p className="text-center py-12">Loading…</p>
        ) : recipes.length === 0 ? (
          <p className="text-center text-gray-500">No recipes found.</p>
        ) : (
          <>
            <div
              className="
                flex flex-nowrap gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide
                sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible
                lg:grid-cols-4 lg:gap-8 lg:justify-center
                py-4 px-2
              "
            >
              {visibleRecipes.map((r) => (
                <Link
                  key={r.slug.current}
                  to={`/recipes/${r.slug.current}`}
                  className="flex flex-col rounded shadow hover:text-brand-primary"
                >
                  <div className="w-full aspect-square overflow-hidden">
                    <img
                      src={r.image}
                      alt={r.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4 bg-[#f9f9f7]">
                    <h3 className="font-heading text-xl font-bold mb-2">
                      {r.title}
                    </h3>
                    <p className="font-body text-gray-600 text-sm">
                      {r.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* SHOW-MORE BUTTON */}
            {visible < recipes.length && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setVisible((v) => v + PER_PAGE)}
                  className="font-heading bg-brand-primary text-white px-6 py-2 rounded hover:bg-brand-hover"
                >
                  Show more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

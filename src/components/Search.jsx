import { useState } from "react";
import client from "../sanityClient";
import { urlFor } from "../sanityClient";
import { Link } from "react-router-dom";

const Search = ({ type }) => {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (term.trim() === "") return;

    try {
      setLoading(true);
      setError(null);

      const searchWords = term.trim().split(/\s+/); // split by spaces

      const searchConditions = searchWords
        .map(
          (word) =>
            `title match "${word}*" || description match "${word}*" || ingredients match "${word}*"`
        )
        .join(" || ");

      const data = await client.fetch(
        `{
      "recipes": *[_type == "recipe" && ( ${searchConditions} )]{
            _id,
            title,
            slug,
            image,
            description,
            _type
            },
          "blogs": *[_type == "blog" && ( ${searchConditions})]{
            _id,
            title,
            slug,
            image,
            description,
            _type
            }
            }`,
        { term }
      );

      setResults([...data.recipes, ...data.blogs]);
    } catch (err) {
      console.error("Search error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative">
      {/* Magnifying Glass Icon */}

      <button
        onClick={() => setShowSearch(!showSearch)}
        className="text-gray-700 hover:text-black focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 4a6 6 0 100 12 6 6 0 000-12zM21 21l-4.35-4.35"
          />
        </svg>
      </button>

      {/* Search Bar */}
      {showSearch && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-start pt-16 z-50"
          onClick={() => {
            setShowSearch(false);
            setTerm("");
            setResults([]);
          }}
        >
          <div
            className="fixed top-[60px] left-1/2 transform -translate-x-1/2 w-full max-w-screen-lg bg-white shadow-lg rounded z-50 border p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-0 right-2 text-gray-600 hover:text-black"
              onClick={() => {
                setShowSearch(false);
                setTerm("");
                setResults([]);
              }}
            >
              ✖
            </button>
            <form className="flex gap-2" onSubmit={handleSearch}>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search for recipes or blogs..."
                className="w-full border p-2 rounded"
              />
              <button
                type="submit"
                className=" p-2 bg-blue-600 text-white rounded "
              >
                Search
              </button>
            </form>

            {/* Loading Indicator */}
            {loading && <p className="mt-2 text-gray-500">Loading...</p>}

            {/* Search Results */}
            {!loading && results.length > 0 && (
              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4  gap-6 space-y-2">
                {results.map((item) => (
                  <li key={item._id} className="flex items-center space-x-4">
                    <Link
                      to={`/${item._type === "recipe" ? "recipes" : "blog"}/${
                        item.slug.current
                      }`}
                      onClick={() => setShowSearch(false)}
                      className="block"
                    >
                      <div className="w-full aspect-square overflow-hidden rounded">
                        <img
                          src={urlFor(item.image).width(300).url()}
                          alt="{item.title}"
                          className="w-full h-full object-cover rounded"
                        />
                      </div>

                      <h3 className="mt-2 text-lg font-bold line-clamp-1 text-center">
                        {item.title}
                      </h3>
                      {/* <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p> */}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {!loading && results.length === 0 && term && (
              <p className="mt-2 text-gray-500">No results found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;

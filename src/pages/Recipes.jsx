import React, { useEffect, useState } from "react";
import client from "../sanityClient";
import { Link } from "react-router-dom";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]); // All recipes fetched from Sanity
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [filterCategory, setFilteredCategory] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");
  const [loading, setLoading] = useState(true); // Track loading state

  const categories = ["All", "Pastry", "Cake", "Bread", "Cookie", "Pie"];

  // Fetch recipes from Sanity
  useEffect(() => {
    client
      .fetch(
        '*[_type == "recipe"]{title, "image": mainImage.asset->url, slug, category, description, _createdAt}'
      )
      .then((data) => {
        setRecipes(data);
        setFilteredRecipes(data);
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
        setLoading(false); // Stop loading even if there's an error
      });
  }, []);

  //Update filteredRecipes when filterCategory or sortOption changes
  useEffect(() => {
    let updatedRecipes = [...recipes];

    //Filter by category

    if (filterCategory != "All") {
      updatedRecipes = updatedRecipes.filter(
        (recipe) => recipe.category === filterCategory
      );
    }

    //Sort recipes
    if (sortOption === "Newest") {
      updatedRecipes.sort(
        (a, b) => new Date(b._createdAt) - new Date(a._createdAt)
      );
    } else if (sortOption === "Oldest") {
      updatedRecipes.sort(
        (a, b) => new Date(a.created_At) - new Date(b._createdAt)
      );
    } else if (sortOption === "Alphabetical") {
      updatedRecipes.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredRecipes(updatedRecipes);
  }, [filterCategory, sortOption, recipes]);

  // Handlers for filter and sort changes

  const handleCategoryChange = (e) => setFilteredCategory(e.target.value);
  const handleSortChange = (e) => setSortOption(e.target.value);

  return (
    <div className="max-w-screen-lg mx-auto px-4">
      <header className="text-center py-10">
        <h1 className="font-heading text-4xl font-bold mb-4 text-gray-800">
          Crumby Baker Recipes
        </h1>

        {/* <p className="text-lg text-gray-700">
          I hope you find something you like!
        </p> */}
      </header>

      {/* filter and sort controls */}
      <div className="font-heading filter-controls flex flex-wrap justify-center gap-4 my-6">
        {/* category filter */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="categoryFilter"
            className="font-semibold whitespace-nowrap"
          >
            Filter by Category:{" "}
          </label>
          <select
            id="categoryFilter"
            value={filterCategory}
            onChange={handleCategoryChange}
            className="ml-2 border rounded px-2 py-1"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Option */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="sortOption"
            className="font-semibold whitespace-nowrap"
          >
            Sort by:{" "}
          </label>
          <select
            id="sortOption"
            value={sortOption}
            onChange={handleSortChange}
            className="ml-2 border rounded px-2 py-1"
          >
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
            <option value="Alphabetical">A-Z</option>
          </select>
        </div>
      </div>

      {/* Loading Indicator */}

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div
            className="animate-spin rounded-full h-8 w-8
          border-t-2 border-b-2 border-gray-500"
          ></div>
        </div>
      ) : filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Recipe Grid */}
          {filteredRecipes.map((recipe) => (
            <Link
              to={`/recipes/${recipe.slug.current}`}
              className="block rounded shadow"
              key={recipe.slug.current}
            >
              <div className="w-full aspect-square overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-heading text-xl font-bold mb-2">
                  {recipe.title}
                </h3>
                <p className="font-body  text-gray-600 text-sm">
                  {recipe.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No recipes found.</p>
      )}
    </div>
  );
};

export default Recipes;

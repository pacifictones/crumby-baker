import React, { useState } from "react";
import RecipeList from "../components/RecipeList";

const Recipes = () => {
  const [filterCategory, setFilteredCategory] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");

  const categories = ["All", "Pastry", "Cake", "Bread", "Cookie", "Pie"];

  const handleCategoryChange = (e) => setFilteredCategory(e.target.value);
  const handleSortChange = (e) => setSortOption(e.target.value);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-4">
        Crumby Baker Recipes
      </h1>
      <p className="text-lg text-gray-700 text-center">
        I hope you find something you like!
      </p>

      {/* filter and sort controls */}
      <div className="filter-controls flex flex-wrap justify-center gap-4 my-6">
        {/* category filter */}
        <label htmlFor="categoryFilter" className="font-semibold">
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

        {/* Sort Option */}
        <label htmlFor="sortOption" className="font-semibold">
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

      <RecipeList filterCategory={filterCategory} sortOption={sortOption} />
    </div>
  );
};

export default Recipes;

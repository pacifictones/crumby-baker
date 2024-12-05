import React, { useEffect, useState } from "react";
import List from "../components/List";
import client from "../sanityClient";
import { Link } from "react-router-dom";

const Blog = () => {
  const [blogs, setBlogs] = useState([]); // All blogs fetched from Sanity
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [sortOption, setSortOption] = useState("Newest");

  // Fetch blogs form Sanity
  useEffect(() => {
    client
      .fetch(
        '*[_type == "blog"]{title, "image": image.asset->url, slug, excerpt, content, _createdAt}'
      )
      .then((data) => {
        setBlogs(data);
        setFilteredBlogs(data);
      })
      .catch(console.error);
  }, []);

  //Update filteredBlogs when sortOption changes
  useEffect(() => {
    let updatedBlogs = [...blogs];

    // //Filter by category

    // if (filterCategory != "All") {
    //   updatedRecipes = updatedRecipes.filter(
    //     (recipe) => recipe.category === filterCategory
    //   );
    // }

    //Sort recipes
    if (sortOption === "Newest") {
      updatedBlogs.sort(
        (a, b) => new Date(b._createdAt) - new Date(a._createdAt)
      );
    } else if (sortOption === "Oldest") {
      updatedBlogs.sort(
        (a, b) => new Date(a.created_At) - new Date(b._createdAt)
      );
    } // else if (sortOption === "Alphabetical") {
    //   updatedBlogs.sort((a, b) => a.title.localeCompare(b.title));
    // }

    setFilteredBlogs(updatedBlogs);
  }, [sortOption, blogs]);

  // Handlers for filter and sort changes

  // const handleCategoryChange = (e) => setFilteredCategory(e.target.value);
  const handleSortChange = (e) => setSortOption(e.target.value);

  return (
    <div className="max-w-screen-lg mx-auto p-4 py-60">
      <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
        Crumby Baker Blogs
      </h1>
      <p className="text-lg text-gray-700 text-center">
        Have a read into my crumby mind!
      </p>

      {/* filter and sort controls */}
      <div className="filter-controls flex flex-wrap justify-center gap-4 my-6">
        {/* category filter */}
        {/* <div className="flex items-center gap-2"> */}
        {/* <label
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
        </div> */}

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
            {/* <option value="Alphabetical">A-Z</option> */}
          </select>
        </div>
      </div>

      {/* Blog Grid */}

      <List
        data={filteredBlogs}
        renderItem={(blog) => (
          <div
            key={blog.slug.current}
            className="blog-thumbnail rounded-lg shadow-md overflow-hidden "
          >
            <Link to={`/blog/${blog.slug.current}`} className="block">
              <img
                src={blog.image}
                alt={blog.title}
                className=" w-full aspect-[4/3] h-full object-cover"
              />
            </Link>

            <div className="p-4 flex-1 text-left">
              <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
              <p className="text-gray-600 text-sm">{blog.excerpt}</p>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default Blog;

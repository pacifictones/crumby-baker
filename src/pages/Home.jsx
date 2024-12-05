import { useEffect, useState } from "react";
import client from "../sanityClient";
import { set } from "react-hook-form";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch latest recipes
        const recipeData = await client.fetch(
          `*[_type == "recipe"] | order(_createdAt desc)[0...3] {
          _id,
          title,
          slug,
          "image": image.asset->url,
          description
          }`
        );
        setRecipes(recipeData);

        // Fetch latest blogs
        const blogData = await client.fetch(
          `*[_type == "blog"] | order(_createdAt desc)[0...3] {
          _id,
          title, 
          slug,
          "image": image.asset->url,
          excerpt
          }`
        );
        setBlogs(blogData);
      } catch (error) {
        console.log("error fetching data", error);
      }
    };
    fetchContent();
  }, []);

  return (
    <>
      <header className="w-full py-10 text-center">
        <h1 className="text-4xl font-semibold mb-4">
          Welcome to the Crumby Baker
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          Your one-stop shop for delicious recipes and baking tips.
        </p>
      </header>
      {/* Latest Recipe Section */}
      <section className="my-8 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-semibold mb-4">Latest Recipes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="  rounded shadow">
              <div className="w-full aspect-square overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              <h3 className="mt-2 text-lg font-bold">{recipe.title}</h3>
            </div>
          ))}
        </div>
      </section>
      <section className="my-8 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-semibold mb-4">Latest Blogs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* blog thumbs here */}
          {blogs.map((blog) => (
            <div key={blog._id} className="  rounded shadow">
              <div className=" w-full aspect-square overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              <h3 className="mt-2 text-lg font-bold">{blog.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;

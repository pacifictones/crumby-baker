import { useEffect, useState } from "react";
import client from "../sanityClient";
import { set } from "react-hook-form";
import { Link } from "react-router-dom";

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
            <Link
              to={`/recipes/${recipe.slug.current}`}
              key={recipe._id}
              className="block rounded shadow"
            >
              <div className="w-full aspect-square overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="mt-2 text-lg font-bold mb-2">{recipe.title}</h3>
                <p className="text-gray-600 text-sm">{recipe.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="my-8 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-semibold mb-4">Latest Blogs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* blog thumbs here */}
          {blogs.map((blog) => (
            <Link
              to={`/blog/${blog.slug.current}`}
              key={blog._id}
              className="block rounded shadow"
            >
              <div className=" w-full aspect-square overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                <p className="text-gray-600 text-sm">{blog.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="my-12 flex flex-col  items-center">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          About me
        </h2>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 max-w-5xl px-4">
          <img
            src="/photos/Heather-Waterfall.jpg"
            alt="waterFall"
            className=" h-60 
             w-auto md:h-64 rounded-md shadow-lg"
          />
          <div className="text-left leading-relaxed text-gray-700">
            <p className=" mb-4">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde,
              aperiam eaque veritatis cumque molestias recusandae temporibus
              quos facilis, aspernatur vero asperiores blanditiis, accusamus rem
              voluptates doloribus dolore quis eligendi quae. Lorem ipsum dolor
              sit amet consectetur adipisicing elit. Commodi fuga similique
              labore soluta obcaecati quia nisi, rerum natus illum quibusdam,
              corporis aspernatur neque ducimus architecto quaerat repellendus
              doloribus impedit perferendis.
            </p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsam
              laudantium doloremque nesciunt expedita blanditiis aperiam aliquam
              hic odit rem deleniti, repellendus pariatur officia corrupti
              suscipit dignissimos iusto a eveniet temporibus!
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

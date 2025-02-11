import { useEffect, useState } from "react";
import client from "../sanityClient";
import { set } from "react-hook-form";
import { Link } from "react-router-dom";
import ResponsiveCarouselGrid from "../components/ResponsiveCarouselGrid";
import SeeMoreCard from "../components/SeeMoreCard";

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
      {/* <header className="w-full py-10 text-center">
        <h1 className="text-4xl font-semibold mb-4">
          Welcome to the Crumby Baker
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          Your one-stop shop for delicious recipes and baking tips.
        </p>
      </header> */}
      {/* Latest Recipe Section */}
      <section className=" w-full mb-10">
        <div className="max-w-screen-lg mx-auto px-2 sm:px-4">
          <Link
            className="font-heading text-2xl font-semibold hover:text-gray-600"
            to="/recipes"
          >
            Latest Recipes
          </Link>

          <ResponsiveCarouselGrid
            items={[...recipes, { isSeeMore: true }]} // Append "See More Card"
            renderItem={(recipe) =>
              recipe.isSeeMore ? (
                <SeeMoreCard
                  to="/recipes"
                  title="See All Recipes"
                  description="Explore our full collection of recipes!"
                  className=" font-heading w-full aspect-square lg:hidden" // Hide on larger screens
                  backgroundImage={null} // Or pass an image path
                />
              ) : (
                <Link
                  to={`/recipes/${recipe.slug.current}`}
                  className="rounded shadow w-72 flex flex-col"
                >
                  <div className="w-full aspect-square overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Text Section */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h3 className="font-heading mt-2 text-lg font-bold mb-2 text-center">
                      {recipe.title}
                    </h3>
                    <p className="font-body text-gray-600 text-md line-clamp-3">
                      {recipe.description}
                    </p>
                  </div>
                </Link>
              )
            }
          />
        </div>
      </section>
      <section className="py-10 w-full mb-10 ">
        <div className="  border-gray-500 max-w-screen-lg mx-auto px-2 sm:px-4 p-4">
          <Link
            className="font-heading text-2xl font-semibold hover:text-gray-600"
            to="/blog"
          >
            Latest Blogs
          </Link>

          <ResponsiveCarouselGrid
            items={[...blogs, { isSeeMore: true }]} // Append See More Card
            renderItem={(blog) =>
              blog.isSeeMore ? (
                <SeeMoreCard
                  to="/blog"
                  title="See All Blogs"
                  description="Explore our full collection of blogs!"
                  className="font-heading w-full aspect-square lg:hidden" // Hide on larger screens
                  backgroundImage={null} // Optional image
                />
              ) : (
                <Link
                  to={`/blog/${blog.slug.current}`}
                  className="rounded shadow w-72 flex flex-col"
                >
                  <div className="w-full aspect-square overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Text Section */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h3 className="font-heading mt-2 text-lg font-bold mb-2 text-center">
                      {blog.title}
                    </h3>
                    <p className="font-body text-gray-600 text-md line-clamp-3">
                      {blog.excerpt}
                    </p>
                  </div>
                </Link>
              )
            }
          />
        </div>
      </section>
      <section className="py-10 w-full mb-10">
        <div className="flex flex-col ">
          <Link
            className="font-heading text-2xl font-semibold hover:text-gray-600 mb-4"
            to="/about"
          >
            About me
          </Link>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 max-w-5xl px-4">
            <img
              src="/photos/Heather-Waterfall.jpg"
              alt="waterFall"
              className=" h-60 
             w-auto md:h-64 rounded-md shadow-lg"
            />
            <div className="font-body text-md text-left leading-relaxed text-gray-700">
              <p className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde,
                aperiam eaque veritatis cumque molestias recusandae temporibus
                quos facilis, aspernatur vero asperiores blanditiis, accusamus
                rem voluptates doloribus dolore quis eligendi quae.
              </p>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsam
                laudantium doloremque nesciunt expedita blanditiis aperiam
                aliquam hic odit rem deleniti, repellendus pariatur officia
                corrupti suscipit dignissimos iusto a eveniet temporibus!
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

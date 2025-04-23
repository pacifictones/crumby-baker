import { useEffect, useState } from "react";
import client, { urlFor } from "../sanityClient";
import { set } from "react-hook-form";
import { Link } from "react-router-dom";
import ResponsiveCarouselGrid from "../components/ResponsiveCarouselGrid";
import SeeMoreCard from "../components/SeeMoreCard";
import { Helmet } from "react-helmet";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch latest recipes
        const recipeData = await client.fetch(
          `*[_type == "recipe"] | order(_createdAt desc)[0...4] {
          _id,
          title,
          slug,
          "image": mainImage.asset->url,
          description
          }`
        );
        setRecipes(recipeData);

        // Fetch latest blogs
        const blogData = await client.fetch(
          `*[_type == "blog"] | order(_createdAt desc)[0...4] {
          _id,
          title, 
          slug,
          "image": mainImage.asset->url,
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
    <div>
      <Helmet>
        <title>The Crumby Baker</title>
      </Helmet>
      {/* <header className="w-full py-10 text-center">
        <h1 className="text-4xl font-semibold mb-4">
          Welcome to the Crumby Baker
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          Your one-stop shop for delicious recipes and baking tips.
        </p>
      </header> */}
      {/* Latest Recipe Section */}
      <section className=" py-10 bg-white px-4 ">
        <div className="mx-auto max-w-screen-xl text-center">
          <div className="mb-6">
            <Link
              className="font-heading rounded-xl hover:translate-y-1 hover:shadow-lg transition-transform duration-200 text-2xl font-semibold hover:text-brand-primary"
              to="/recipes"
            >
              Latest Recipes
            </Link>
          </div>

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
                  className="rounded shadow w-full flex flex-col hover:text-brand-primary"
                >
                  <div className="w-full aspect-square overflow-hidden">
                    <img
                      src={urlFor(recipe.image).width(400).quality(80).url()}
                      alt={recipe.image.alt || recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Text Section */}
                  <div className=" p-4 flex-1 flex flex-col justify-between bg-[#f9f9f7] min-h-[160px] ">
                    <h3 className="font-heading mt-2 text-lg font-bold mb-2 text-center">
                      {recipe.title}
                    </h3>
                    <p className="font-body text-gray-600 text-md line-clamp-3 min-h-[72px]">
                      {recipe.description}
                    </p>
                  </div>
                </Link>
              )
            }
          />
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-10 bg-[#DEE7E7] px-4">
        <div className="  border-gray-500 max-w-screen-xl mx-auto text-center">
          <div className="mb-6">
            <Link
              className="font-heading text-2xl font-semibold hover:text-brand-primary"
              to="/blog"
            >
              Latest Blogs
            </Link>
          </div>

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
                  className="rounded shadow hover:text-brand-primary w-full flex flex-col"
                >
                  <div className="w-full aspect-square overflow-hidden ">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Text Section */}
                  <div className="p-4 flex-1 flex flex-col justify-between bg-[#f9f9f7] min-h-[150px]">
                    <h3 className="font-heading mt-2 text-lg font-bold mb-2 text-center">
                      {blog.title}
                    </h3>
                    <p className="font-body text-gray-600 text-md line-clamp-3 min-h-[72px]">
                      {blog.excerpt}
                    </p>
                  </div>
                </Link>
              )
            }
          />
        </div>
      </section>

      {/* About Me */}
      <section className="py-10 bg-white">
        <div className="max-w-screen-lg mx-auto px-4 text-center ">
          <div className="mb-6">
            <Link
              className="font-heading text-2xl font-semibold hover:text-brand-primary mb-4 inline-block"
              to="/about"
            >
              About me
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
            <img
              src="/photos/Heather-Waterfall.jpg"
              alt="waterFall"
              className=" h-60 
             w-auto md:h-64 rounded-md shadow-lg"
            />
            <div className="font-body text-md  leading-relaxed text-gray-700 text-left">
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
    </div>
  );
};

export default Home;

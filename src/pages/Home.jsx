import { useEffect, useState } from "react";
import client, { urlFor } from "../sanityClient";
import { set } from "react-hook-form";
import { Link } from "react-router-dom";
import ResponsiveCarouselGrid from "../components/ResponsiveCarouselGrid";
import SeeMoreCard from "../components/SeeMoreCard";
import { Helmet } from "react-helmet";
import Hero from "../components/Hero";

import { useTransition } from "react";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);

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

        // Categories with cover images
        const catData = await client.fetch(`
          *[_type == "category" && featured == true && defined(image)]
          | order(title asc)[0...4]{
            _id, title, slug, image
          }
        `);

        setCategories(catData);
      } catch (error) {
        console.log("Fetching home content failed:", error);
      }
    };
    fetchContent();
  }, []);

  return (
    <div>
      <Helmet>
        <title>The Crumby Baker</title>
      </Helmet>
      {/* ─────────────── HERO ─────────────── */}
      <Hero />

      {/* ─────────────── FEATURED CATEGORIES ─────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="font-heading text-2xl mb-6 text-center">
            <Link to="/categories" className="hover:text-brand-primary">
              Explore by Category
            </Link>
          </h2>

          <ResponsiveCarouselGrid
            items={categories}
            renderItem={(cat) => (
              <Link
                to={`/category/${cat.slug.current}`}
                className="group block rounded shadow overflow-hidden hover:text-brand-primary"
              >
                <img
                  src={urlFor(cat.image)
                    .width(400)
                    .height(400)
                    .fit("crop")
                    .url()}
                  alt={cat.image?.alt || cat.title}
                  className="w-full h-full object-cover"
                />
                <div className="bg-[#f9f9f7] px-2 py-2">
                  <h3 className="font-heading text-center text-base font-semibold">
                    {cat.title}
                  </h3>
                </div>
              </Link>
            )}
          />
        </div>
      </section>
      {/* <header className="w-full py-10 text-center">
        <h1 className="text-4xl font-semibold mb-4">
          Welcome to the Crumby Baker
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          Your one-stop shop for delicious recipes and baking tips.
        </p>
      </header> */}

      {/* Latest Recipe Section */}
      <section className=" py-16 bg-[#DEE7E7] px-4 ">
        <div className="mx-auto max-w-screen-xl text-center">
          <div className="mb-6">
            <Link
              className="font-heading text-2xl font-semibold hover:text-brand-primary"
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
                  className=" font-heading w-full aspect-square sm:hidden" // Hide on larger screens
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
      <section className="py-16 bg-white px-4">
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
                  className="font-heading w-full aspect-square sm:hidden" // Hide on larger screens
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
      {/* About Teaser – place between Hero and Latest Recipes */}
      <section className="bg-[#DEE7E7] py-12">
        <div className="max-w-screen-lg mx-auto px-6  py-6 md:flex md:items-center md:gap-8">
          <img
            src="/photos/Heather-Waterfall.jpg"
            alt="Heather smiling"
            className="w-40 h-40 rounded-full object-cover mx-auto md:mx-0 mb-6 md:mb-0 shadow"
          />
          <div className="text-center md:text-left">
            <h2 className="font-heading text-2xl font-bold mb-2">
              Oh, hi. I’m Heather.
            </h2>
            <p className="font-body text-gray-700 max-w-xl mx-auto md:mx-0 mb-4">
              I drop batter on the oven door, forget the baking powder, and
              still try again. Welcome to mediocrity — grab a whisk.
            </p>
            <Link
              to="/about"
              className="inline-block font-heading text-brand-primary hover:text-brand-hover"
            >
              Read the whole messy story →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

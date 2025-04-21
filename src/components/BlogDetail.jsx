import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client, { urlFor } from "../sanityClient";
import { PortableText } from "@portabletext/react";
import { Helmet } from "react-helmet";
import ShareModal from "./ShareModal";
import Breadcrumbs from "./Breadcrumbs";
import CommentForm from "./CommentForm";

function BlogDetail() {
  const { slug } = useParams(); // Get the slug from the URL
  const [blog, setBlog] = useState(null); // State to store blog data

  useEffect(() => {
    client
      .fetch(
        `*[_type == "blog" && slug.current == $slug][0]{
        title,
        mainImage,
        content,
        author,
        excerpt,
        publishedAt,
        "comments": *[
+       _type=="comment" &&
+       blog._ref == ^._id &&
+       confirmed == true
+     ] | order(_createdAt asc){
+       _id,
+       authorName,
+       text,
+       // add parent{_id} later for threading
+     }
        }`,
        { slug }
      )
      .then((data) => {
        console.log("Fetched blog detail:", data);
        setBlog(data);
      })
      .catch(console.error);
  }, [slug]);

  if (!blog) return <div>Loading...</div>;

  const testUrl = urlFor(blog.mainImage).width(600).url();
  console.log("Test image URL:", testUrl);

  return (
    <>
      <Helmet>
        <title>{blog.title}</title>
      </Helmet>
      <div className="max-w-screen-xl mx-auto px-4 py8">
        {/* Top Section: Title, Info and Image */}
        <section className="max-w-screen-lg mx-auto font-body  grid grid-cols-1 lg:grid-cols-2 gap-10 mb-24 items-stretch">
          {/* Left Column: Title, exerpt, author, date, share icons */}
          <div className=" flex flex-col justify-center">
            <Breadcrumbs />
            {/* Title */}
            <h1 className="font-heading text-5xl font-bold mt-6 mb-4">
              {blog.title}
            </h1>
            {/* Optional excerpt/subtitle */}
            <p className="font-heading text-2xl text-gray-700 mb-8">
              {blog.excerpt || "Hello"}
            </p>

            {/* Meta Info: author, date */}
            <div className="flex items-center gap-12 mb-2">
              <div>
                <p className="text-sm uppercase font-heading">Author</p>

                <p className=" font-heading text-lg ">
                  {blog.author || "Anonymous"}
                </p>
              </div>
              <div>
                <p className="text-sm uppercase font-heading">Date</p>
                <p className=" font-heading text-lg">
                  {blog.publishedAt
                    ? new Date(blog.publishedAt).toLocaleDateString()
                    : ""}
                </p>
              </div>
            </div>

            {/* Social share or 'comments' placeholder */}
            <div className="mt-4 flex items-center gap-16">
              <p className="font-heading text-gray-500 text-md">
                Comments: Be the first!
              </p>
              {/*  Share component */}
              <ShareModal />
            </div>
            <div className="col-span-3 border-b border-gray-300 my-3"></div>
          </div>
          {/* Right Column: Main Image */}
          <div className="overflow-hidden relative">
            {blog.mainImage && (
              <img
                src={urlFor(blog.mainImage).width(700).url()}
                alt={blog.title}
                className="w-full h-full object-cover rounded shadow-sm"
              />
            )}
          </div>
        </section>

        <div className="my-8 mx-auto font-body max-w-prose">
          <PortableText
            value={blog.content}
            components={{
              block: {
                normal: ({ children }) => (
                  <p className="mb-8 mt-8 text-justify indent-6 text-lg leading-relaxed">
                    {children}
                  </p>
                ),
              },
              types: {
                image: ({ value }) => {
                  // value is the entire image object
                  return (
                    <img
                      src={urlFor(value).width(800).quality(80).url()}
                      alt={value.alt || ""}
                      className="my-4 rounded shadow"
                    />
                  );
                },
              },
            }}
          />
          {/* ------------------ Comments Section ------------------ */}
          <div className="max-w-screen-lg mx-auto mt-16 mb-24">
            <h2 className="font-heading text-2xl font-bold mb-6">Comments</h2>

            {/* Existing comments */}
            {blog.comments && blog.comments.length > 0 ? (
              blog.comments.map((c) => (
                <div key={c._id} className="mb-6 border-b pb-4">
                  <p className="font-heading font-semibold mb-1">
                    {c.authorName || "Anonymous"}
                  </p>
                  <p className="font-body">{c.text}</p>
                </div>
              ))
            ) : (
              <p className="font-body text-gray-600 mb-8">
                No comments yet. Be the first!
              </p>
            )}

            {/* Comment form */}
            <CommentForm
              blogId={blog._id}
              onSubmitted={() => {
                // simple refresh: re‑fetch the blog to get the new confirmed comment
                client
                  .fetch(
                    `*[_type == "blog" && _id == $id][0]{
             "comments": *[_type=="comment" && blog._ref == ^._id && confirmed == true] | order(_createdAt asc){
               _id, authorName, text
             }
           }`,
                    { id: blog._id }
                  )
                  .then((data) =>
                    setBlog((prev) => ({ ...prev, comments: data.comments }))
                  );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogDetail;

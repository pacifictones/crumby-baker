import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client, { urlFor } from "../sanityClient";
import { PortableText } from "@portabletext/react";
import { Helmet } from "react-helmet";
import ShareModal from "./ShareModal";
import Breadcrumbs from "./Breadcrumbs";
import CommentForm from "./CommentForm";

function interleaveReplies(comments) {
  // group replies by parent ID
  const repliesByParent = {};
  comments.forEach((c) => {
    const pid = c.parent?._id;
    if (pid) {
      repliesByParent[pid] = repliesByParent[pid] || [];
      repliesByParent[pid].push(c);
    }
  });

  // now build a new array where each top‑level comment
  // is immediately followed by its replies
  const result = [];
  comments.forEach((c) => {
    if (!c.parent) {
      result.push(c);
      const kids = repliesByParent[c._id];
      if (kids) {
        // optional: sort replies by date if you like
        kids.sort((a, b) => new Date(a._createdAt) - new Date(b._createdAt));
        result.push(...kids);
      }
    }
  });

  return result;
}

function BlogDetail() {
  const { slug } = useParams(); // Get the slug from the URL
  const [blog, setBlog] = useState(null); // State to store blog data
  const [replyTo, setReplyTo] = useState(null);

  const COMMENTS_PER_PAGE = 6;
  const [page, setPage] = useState(1); // current page
  const totalPages = Math.ceil(
    (blog?.comments?.length || 0) / COMMENTS_PER_PAGE
  );

  const refreshComments = () => {
    client
      .fetch(
        `*[_type=="blog" && slug.current==$slug][0]{
          _id,
          title,
          mainImage,
          content,
          author,
          excerpt,
          publishedAt,
          "comments": *[
            _type=="comment" &&
            blog._ref == ^._id &&
            confirmed == true
          ] | order(_createdAt asc){
            _id,
            authorName,
            text,
            _createdAt,
            parent->{_id, authorName}
          }
        }`,
        { slug }
      )
      .then((data) => {
        console.log("Raw comments:", data.comments);
        const ordered = interleaveReplies(data.comments);
        setBlog({ ...data, comments: ordered });
      })

      .catch(console.error);
  };

  // 2) On mount or slug change, just call the helper
  useEffect(() => {
    refreshComments();
  }, [slug]);

  useEffect(() => {
    // scroll the comments section into view when page changes
    const el = document.getElementById("comments-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

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
              {/* comment‑count link */}
              <button
                onClick={() => {
                  const el = document.getElementById("comments-section");
                  if (el)
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="font-heading text-md text-brand-primary hover:underline"
              >
                {blog.comments?.length
                  ? `${blog.comments.length} Comment${
                      blog.comments.length !== 1 ? "s" : ""
                    }`
                  : "Be the first to comment"}
              </button>

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
        </div>

        {/* ------------------ Comments Section ------------------ */}
        <div
          id="comments-section"
          className="max-w-screen-lg mx-auto mt-16 mb-24"
        >
          <h2 className="font-heading text-2xl font-bold border-b mb-6 text-center py-4 mx-16">
            Comments
          </h2>

          {/* Existing comments */}
          {blog.comments && blog.comments.length > 0 ? (
            blog.comments
              .slice((page - 1) * COMMENTS_PER_PAGE, page * COMMENTS_PER_PAGE)
              .map((c) => (
                <article
                  key={c._id}
                  className={`mb-6 rounded border-b border-gray-200 px-12 py-3
                odd:bg-[#DEE7E7] even:bg-white ${
                  c.parent ? "ml-20 border-l-4 border-brand-primary" : ""
                }
                `}
                >
                  <h3 className="font-heading text-brand-primary font-semibold ">
                    {c.authorName || "Anonymous"}
                  </h3>

                  {/* Date and Time */}
                  <time className="font-body text-sm text-gray-500 ">
                    {new Date(c._createdAt).toLocaleString()}
                  </time>
                  <p className="font-body leading-relaxed whitespace-pre-line mt-4">
                    {c.parent && (
                      <span className="font-heading text-brand-primary mr-2">
                        @{c.parent.authorName || "Anonymous"}
                      </span>
                    )}
                    {c.text}
                  </p>
                  {!c.parent && (
                    <button
                      onClick={() => setReplyTo(c)}
                      className="mt-3 inline-block   px-2 py-1 font-heading text-white text-sm bg-brand-primary hover:bg-brand-hover"
                    >
                      Reply
                    </button>
                  )}

                  {replyTo?._id === c._id && (
                    <div className="mt-4">
                      <CommentForm
                        blogId={blog._id}
                        parentId={c._id}
                        onSubmitted={() => {
                          setReplyTo(null);
                          refreshComments(); // your existing refresh call
                        }}
                      />
                    </div>
                  )}
                </article>
              ))
          ) : (
            <p className="font-body text-gray-600 mb-8">
              No comments yet. Be the first!
            </p>
          )}

          {/* ---------- Pagination controls ---------- */}
          {totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-4 ">
              {/* Previous arrow */}
              {page > 1 && (
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`px-2 py-1 font-heading text-lg ${
                    page === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-brand-primary"
                  }`}
                >
                  &lt;
                </button>
              )}

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`px-2 py-1 font-heading text-xl ${
                      num === page
                        ? "text-brand-primary font-bold "
                        : "text-gray-600 hover:text-brand-hover"
                    }`}
                  >
                    {num}
                  </button>
                )
              )}

              {/* Next arrow */}
              {page < totalPages && (
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`px-2 py-1 font-heading text-lg ${
                    page === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-brand-primary"
                  }`}
                >
                  &gt;
                </button>
              )}
            </nav>
          )}
          {replyTo === null && (
            <div className="mt-10">
              <CommentForm
                blogId={blog._id}
                parentId={null}
                onSubmitted={() => {
                  refreshComments(); // reload with the new top‑level comment
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BlogDetail;

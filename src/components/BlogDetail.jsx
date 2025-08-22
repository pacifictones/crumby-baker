import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client, { urlFor } from "../sanityClient";
import { PortableText } from "@portabletext/react";
import { Helmet } from "react-helmet-async";
import ShareModal from "./ShareModal";
import Breadcrumbs from "./Breadcrumbs";
import CommentForm from "./CommentForm";
import Loading from "./Loading";
import ContentError from "../pages/ContentError";

// ---------------- PortableText link marks + components ----------------
const ptLinkMarks = {
  link: ({ children, value }) => {
    const rel = value?.nofollow ? "nofollow noopener" : "noopener";
    const target = value?.blank ? "_blank" : undefined;
    return (
      <a href={value?.href} target={target} rel={rel}>
        {children}
      </a>
    );
  },
};

const ptBlogComponents = {
  marks: ptLinkMarks,
  block: {
    normal: ({ children }) => (
      <p className="mb-8 mt-8 text-justify indent-6 text-lg leading-relaxed">
        {children}
      </p>
    ),
  },
  types: {
    image: ({ value }) => (
      <img
        src={urlFor(value).width(800).quality(80).url()}
        alt={value.alt || ""}
        className="my-4 rounded shadow"
      />
    ),
  },
};

// ---------------- GROQ query (top-level constant) ----------------
const BLOG_QUERY = `*[_type=="blog" && slug.current==$slug][0]{
  _id,
  _createdAt,
  title,
  author,
  excerpt,
  seoTitle,
  metaDescription,
  keywords,
  categories[]->{ _id },
  mainImage{ ..., alt },
  content,
  publishedAt,
  internalLinks[]->{ _id, _type, title, "slug": slug.current, mainImage{ ..., alt } },
  externalLinks[]{ label, url },

  "relatedRecipes": *[
    _type=="recipe" &&
    (
      references(^.categories[]._ref) ||
      (defined(^.keywords) && defined(keywords) && count((^.keywords)[@ in keywords]) > 0)
    )
  ] | order(_createdAt desc)[0...6]{
    _id, _type, title, "slug": slug.current, mainImage{ ..., alt }
  },

  "relatedPosts": *[
    _type=="blog" &&
    slug.current != ^.slug.current &&
    (
      references(^.categories[]._ref) ||
      (defined(^.keywords) && defined(keywords) && count((^.keywords)[@ in keywords]) > 0)
    )
  ] | order(_createdAt desc)[0...6]{
    _id, _type, title, "slug": slug.current, mainImage{ ..., alt }
  },

  "comments": *[
    _type=="comment" &&
    blog._ref == ^._id &&
    confirmed == true
  ] | order(_createdAt asc){
    _id,
    authorName,
    text,
    _createdAt,
    parent->{ _id, authorName }
  }
}`;

// ---------------- Helper: thread top-level comments with replies ----------------
function interleaveReplies(comments) {
  const repliesByParent = {};
  (comments || []).forEach((c) => {
    const pid = c.parent?._id;
    if (pid) {
      repliesByParent[pid] = repliesByParent[pid] || [];
      repliesByParent[pid].push(c);
    }
  });

  const result = [];
  (comments || []).forEach((c) => {
    if (!c.parent) {
      result.push(c);
      const kids = repliesByParent[c._id];
      if (kids) {
        kids.sort((a, b) => new Date(a._createdAt) - new Date(b._createdAt));
        result.push(...kids);
      }
    }
  });

  return result;
}

// ---------------- Component ----------------
function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const COMMENTS_PER_PAGE = 6;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(
    (blog?.comments?.length || 0) / COMMENTS_PER_PAGE
  );

  // Fetch blog + comments
  const refreshComments = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await client.fetch(BLOG_QUERY, { slug });
      const ordered = interleaveReplies(data?.comments || []);
      setBlog({ ...data, comments: ordered });
    } catch (err) {
      console.error("Failed to refresh blog:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Scroll to comments when page changes
  useEffect(() => {
    const el = document.getElementById("comments-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  if (loading) return <Loading />;
  if (error) return <ContentError message="Failed to load blog." />;
  if (!blog)
    return <p className="text-center py-12 font-heading">Blog not found.</p>;

  // ---------------- SEO head values ----------------
  const canonical = `https://thecrumbybaker.com/blog/${slug}`;
  const pageTitle = blog.seoTitle?.trim()
    ? blog.seoTitle
    : `${blog.title} | The Crumby Baker`;
  const metaDesc = (blog.metaDescription || blog.excerpt || "").slice(0, 155);
  const ogImageUrl = blog.mainImage
    ? urlFor(blog.mainImage).width(1600).quality(80).url()
    : undefined;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDesc} />
        {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
        <meta property="og:url" content={canonical} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDesc} />
        {ogImageUrl && <meta name="twitter:image" content={ogImageUrl} />}
      </Helmet>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Top Section: Title, Info and Image */}
        <section className="max-w-screen-lg mx-auto font-body grid grid-cols-1 lg:grid-cols-2 gap-10 mb-24 items-stretch">
          {/* Left Column: Title, excerpt, author, date, share */}
          <div className="flex flex-col justify-center">
            <Breadcrumbs />
            <h1 className="font-heading text-5xl font-bold mt-6 mb-4">
              {blog.title}
            </h1>
            <p className="font-heading text-2xl text-gray-700 mb-8">
              {blog.excerpt || ""}
            </p>

            <div className="flex items-center gap-12 mb-2">
              <div>
                <p className="text-sm uppercase font-heading">Author</p>
                <p className="font-heading text-lg">
                  {blog.author || "Anonymous"}
                </p>
              </div>
              <div>
                <p className="text-sm uppercase font-heading">Date</p>
                <p className="font-heading text-lg">
                  {blog.publishedAt
                    ? new Date(blog.publishedAt).toLocaleDateString()
                    : ""}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-16">
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

              <ShareModal
                url={canonical}
                image={ogImageUrl}
                title={blog.title}
              />
            </div>

            <div className="col-span-3 border-b border-gray-300 my-3"></div>
          </div>

          {/* Right Column: Main Image */}
          <div className="overflow-hidden relative">
            {blog.mainImage && (
              <img
                src={urlFor(blog.mainImage).width(700).url()}
                alt={blog.mainImage?.alt || blog.title}
                className="w-full h-full object-cover rounded shadow-sm"
              />
            )}
          </div>
        </section>

        {/* Body */}
        <div className="my-8 mx-auto font-body max-w-prose">
          <PortableText value={blog.content} components={ptBlogComponents} />
        </div>

        {/* ------------------ Comments Section ------------------ */}
        <div
          id="comments-section"
          className="max-w-screen-lg mx-auto mt-16 mb-24"
        >
          <h2 className="font-heading text-2xl font-bold border-b mb-6 text-center py-4 mx-16">
            Comments
          </h2>

          {blog.comments && blog.comments.length > 0 ? (
            blog.comments
              .slice((page - 1) * COMMENTS_PER_PAGE, page * COMMENTS_PER_PAGE)
              .map((c) => (
                <article
                  key={c._id}
                  className={`mb-6 rounded border-b border-gray-200 px-12 py-3
                    odd:bg-[#DEE7E7] even:bg-white ${
                      c.parent ? "ml-20 border-l-4 border-brand-primary" : ""
                    }`}
                >
                  <h3 className="font-heading text-brand-primary font-semibold ">
                    {c.authorName || "Anonymous"}
                  </h3>
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
                      className="mt-3 inline-block px-2 py-1 font-heading text-white text-sm bg-brand-primary hover:bg-brand-hover"
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
                          refreshComments();
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

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-4 ">
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
                  refreshComments();
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

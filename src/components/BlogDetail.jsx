import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client, { urlFor } from "../sanityClient";
import { PortableText } from "@portabletext/react";

function BlogDetail() {
  const { slug } = useParams(); // Get the slug from the URL
  const [blog, setBlog] = useState(null); // State to store blog data

  useEffect(() => {
    client
      .fetch(
        `*[_type == "blog" && slug.current == $slug][0]{
        title,
        mainImage,
        content
        }`,
        { slug }
      )
      .then((data) => setBlog(data))
      .catch(console.error);
  }, [slug]);

  if (!blog) return <div>Loading...</div>;

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <h1 className="font-heading text-3xl font-bold mb-4">{blog.title}</h1>
      <img
        src={urlFor(blog.mainImage).width(400).url()}
        alt={blog.title}
        className="my-8 rounded-lg mb-4"
      />
      <div className="my-8 font-body prose max-w-none">
        <PortableText
          value={blog.content}
          components={{
            block: {
              normal: ({ children }) => (
                <p className="mb-4 text-justify indent-6">{children}</p>
              ),
            },
          }}
        />
      </div>
    </div>
  );
}

export default BlogDetail;

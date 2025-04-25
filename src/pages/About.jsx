// src/pages/About.jsx
import React, { useEffect, useState } from "react";
import client, { urlFor } from "../sanityClient";
import { PortableText } from "@portabletext/react";
import { Helmet } from "react-helmet";

export default function About() {
  const [aboutContent, setAboutContent] = useState(null);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "about"][0]{
          title,
          content,
          image
        }`
      )
      .then((data) => setAboutContent(data))
      .catch(console.error);
  }, []);

  if (!aboutContent) {
    return <p className="p-8 text-center font-body">Loading…</p>;
  }

  return (
    <>
      <Helmet>
        <title>About | The Crumby Baker</title>
      </Helmet>

      <div className="max-w-screen-lg mx-auto p-4">
        {/* Page title */}
        <h1 className="font-heading text-3xl text-center mb-14 mt-10">
          {aboutContent.title}
        </h1>

        {/* prose container (requires @tailwindcss/typography) */}
        <div className="prose prose-lg font-body">
          {/* Desktop: float left, one-third width; Mobile: full width */}
          {aboutContent.image && (
            <img
              src={urlFor(aboutContent.image).width(800).url()}
              alt={aboutContent.title}
              className="
                w-full                 /* full-width on mobile */
                md:w-1/3               /* one-third on md+ */
                rounded-lg
                object-cover
                mb-6                   /* gap below on mobile */
                md:float-left md:mr-6  /* float + right margin on md+ */
                md:mb-               /* tighter gap on desktop */
              "
            />
          )}

          {/* All your PortableText content will wrap around the floated image */}
          <PortableText value={aboutContent.content} />
        </div>
      </div>
    </>
  );
}

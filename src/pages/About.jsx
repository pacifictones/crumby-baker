import React, { useEffect, useState } from "react";
import client, { urlFor } from "../sanityClient";
import { PortableText } from "@portabletext/react";

const About = () => {
  const [aboutContent, setAboutConent] = useState(null);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "about"][0]{
    title,
    content,
    image
    }`
      )
      .then((data) => {
        console.log(data);
        setAboutConent(data);
      })
      .catch(console.error);
  }, []);

  if (!aboutContent) return <div className="font-heading">Loading...</div>;

  // Custom components for PortableText
  const components = {
    block: {
      normal: ({ children }) => {
        //skip empty or whitespace-only blocks
        if (!children || children.join("").trim() === "") return null;
        return <p className="mb-4 indent-6">{children}</p>; // Add spacing between paragraph
      },
    },
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <h1 className="font-heading text-3xl font-bold text-center mb-4">
        {aboutContent.title}
      </h1>
      {aboutContent.image && (
        <img
          className="mx-auto rounded-lg mb-4"
          src={urlFor(aboutContent.image).url()}
          alt="About"
        />
      )}

      <div className="font-body prose max-w-none">
        <PortableText value={aboutContent.content} components={components} />
        {aboutContent.content.map((block, index) => (
          <p key={index}>{block.children[0]?.text}</p>
        ))}
      </div>
    </div>
  );
};

export default About;

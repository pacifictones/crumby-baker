import React, { useEffect, useState } from "react";
import client, { urlFor } from "../sanityClient";

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
      .then((data) => setAboutConent(data))
      .catch(console.error);
  }, []);

  if (!aboutContent) return <div>Loading...</div>;

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">
        {aboutContent.title}
      </h1>
      <img
        className="mx-auto rounded-lg mb-4"
        src={urlFor(aboutContent.image).url()}
        alt="About"
      />
      <div className="prose max-w-none">
        {aboutContent.content.map((block, index) => (
          <p key={index}>{block.children[0]?.text}</p>
        ))}
      </div>
    </div>
  );
};

export default About;

import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const isNode = typeof process !== "undefined" && process?.versions?.node;
let token = null;

if (isNode) {
  //Running in Node env
  token = process.env.Vite_Sanity_API_Token;
} else {
  token = import.meta.env.Vite_Sanity_API_Token;
}

const client = createClient({
  projectId: "ulggaxa8",
  dataset: "production",
  useCdn: true,
  apiVersion: "2024-09-04",
  token,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);

export default client;

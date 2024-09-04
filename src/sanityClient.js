import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const client = createClient({
  projectId: "ulggaxa8",
  dataset: "production",
  useCdn: true,
  apiVersion: "2024-09-04",
  token: import.meta.env.Vite_Sanity_API_Token,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);

export default client;

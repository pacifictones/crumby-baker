import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "ulggaxa8",
  dataset: "production",
  useCdn: true,
  apiVersion: "2024-09-04",
  token: import.meta.env.Vite_Sanity_API_Token,
});

export default client;

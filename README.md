# The Crumby Baker

Recipe and baking website, live at [thecrumbybaker.com](https://thecrumbybaker.com).

I designed, built and maintain the site. The baker (my wife) writes the recipes and takes the photos; I handle everything else.

## Built with

- **React** (Vite) front end
- **Sanity** headless CMS for recipes and posts
- **Vercel** for hosting and deployment
- Responsive layouts for mobile and desktop

## What it does

- Reusable page templates for recipes and blog posts, so new content can be published through the CMS without code changes
- Content planned around search demand, using a Node.js script that pulls Google rankings and autocomplete suggestions via SerpApi and exports them to CSV

## Run it locally

```bash
npm install
npm run dev
```

## Next up

- Migrating to Astro to improve SEO and social sharing previews

export default {
  name: 'blog',
  title: 'Blog',
  type: 'document',
  fields: [
    {name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()},

    {name: 'author', title: 'Author', type: 'string'},

    {name: 'publishedAt', title: 'Published At', type: 'datetime'},

    // 👇 Switch to your reusable rich text so inline links work
    {name: 'content', title: 'Content', type: 'blockContent'},

    // Main image with alt
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text', type: 'string'}],
    },

    // Optional gallery, now with per-image alt
    {
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [{name: 'alt', title: 'Alt text', type: 'string'}],
        },
      ],
    },

    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
      validation: (r) => r.min(1).error('Choose at least one category'),
    },

    {name: 'excerpt', title: 'Excerpt', type: 'string'},

    {
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    },

    // 👇 Manual related picks (recipes or other posts)
    {
      name: 'internalLinks',
      title: 'Related Content (manual)',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'recipe'}, {type: 'blog'}]}],
    },

    // 👇 External links list (label + URL)
    {
      name: 'externalLinks',
      title: 'External Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', type: 'string', title: 'Label'},
            {name: 'url', type: 'url', title: 'URL'},
          ],
        },
      ],
    },

    // 👇 SEO for Helmet
    {name: 'seoTitle', title: 'SEO Title (≤60)', type: 'string', validation: (r) => r.max(60)},
    {
      name: 'metaDescription',
      title: 'Meta Description (≤155)',
      type: 'text',
      rows: 2,
      validation: (r) => r.max(155),
    },

    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
    },
  ],
}

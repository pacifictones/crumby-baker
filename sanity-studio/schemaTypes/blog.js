export default {
  name: 'blog',
  title: 'Blog',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string',
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {type: 'block'},
        {
          name: 'image',
          type: 'image',
          title: 'Image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              description: 'Describe the image for screen readers',
            },
          ],
        },
      ], //Allows rich text content
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },

    {
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
      validation: (r) => r.min(1).error('Choose at least one category'),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'string',
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
  ],
}

// /schemas/category.js
export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()},

    // optional slug so you can route /category/cookies
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
    },

    // optional parent reference → lets you build sub-categories later
    {
      name: 'parent',
      title: 'Parent Category',
      type: 'reference',
      to: [{type: 'category'}],
    },
  ],
}

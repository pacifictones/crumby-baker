import step from './step'

export default {
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'ingredients',
      title: 'Ingredients',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'instructions',
      title: 'Instructions',
      type: 'array',
      of: [{type: 'step'}], // Reference custom step object
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
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: [
          {title: 'Pastry', value: 'Pastry'},
          {title: 'Cake', value: 'Cake'},
          {title: 'Bread', value: 'Bread'},
          {title: 'Cookie', value: 'Cookie'},
          {title: 'Pie', value: 'Pie'},
        ],
      },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'string',
    },
    {
      name: 'prepTime',
      title: 'Prep Time (mins)',
      type: 'number',
    },
    {
      name: 'cookTime',
      title: 'Cook Time (mins)',
      type: 'number',
    },
    {
      name: 'totalTime',
      title: 'Total Time (mins)',
      type: 'number',
    },
    {
      name: 'servings',
      title: 'Servings/Yield',
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

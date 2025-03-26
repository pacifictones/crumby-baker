import step from './step'
import ingredientLine from './ingredientLine'

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
      name: 'ingredientSections',
      title: 'Ingredient Sections',
      type: 'array',
      of: [
        {
          name: 'ingredientSection',
          title: 'Ingredient Section',
          type: 'object',
          fields: [
            {
              name: 'sectionTitle',
              title: 'Section Title',
              type: 'string',
              description: "e.g., 'Crust', 'Filling', 'Topping'",
            },
            // Array of "ingredientLine" objects
            {
              name: 'items',
              title: 'Ingredients',
              type: 'array',
              of: [{type: 'ingredientLine'}],
            },
          ],
        },
      ],
    },
    {
      name: 'instructionSections',
      title: 'Instruction Sections',
      type: 'array',
      of: [
        {
          name: 'instructionSection',
          title: 'Instruction Section',
          type: 'object',
          fields: [
            {
              name: 'sectionTitle',
              title: 'Section Title',
              type: 'string',
            },
            {
              name: 'steps',
              title: 'Steps',
              type: 'array',
              of: [{type: 'step'}],
            },
          ],
        },
      ],
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'A short description of the image for screen readers',
        },
      ],
    },
    {
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description: 'A short description of the image for sceen readers',
            },
          ],
        },
      ],
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
      type: 'number',
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

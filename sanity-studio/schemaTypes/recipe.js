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
          preview: {
            select: {
              title: 'sectionTitle',
              items: 'items',
            },
            prepare({title, items}) {
              const list = Array.isArray(items) ? items : []
              const count = list.length

              // Try to show the first 1–2 ingredient item names for context
              const firstTwo = list
                .slice(0, 2)
                .map((it) => it?.item || '') // relies on your ingredientLine.item
                .filter(Boolean)
                .join(', ')

              return {
                title: title?.trim() || 'Ingredients',
                subtitle:
                  count === 0
                    ? '0 items'
                    : firstTwo
                      ? `${count} item${count === 1 ? '' : 's'} · ${firstTwo}${count > 2 ? ', …' : ''}`
                      : `${count} item${count === 1 ? '' : 's'}`,
              }
            },
          },
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
          preview: {
            select: {title: 'sectionTitle', steps: 'steps'},
            prepare({title, steps}) {
              const count = Array.isArray(steps) ? steps.length : 0
              return {
                title: title || 'Method',
                subtitle: `${count} step${count === 1 ? '' : 's'}`,
              }
            },
          },
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
    // inside recipe.js  (same in blog.js)
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
      validation: (r) => r.min(1).error('Choose at least one category'),
    },

    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'seoTitle',
      title: 'SEO Title (<=60 chars)',
      type: 'string',
      validation: (r) => r.max(60),
    },
    {
      name: 'metaDescription',
      title: 'Meta Description (<=155 chars)',
      type: 'text',
      rows: 2,
      validation: (r) => r.max(155),
    },

    {
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
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
      name: 'notes',
      title: 'Cook’s Notes',
      type: 'blockContent',

      description: 'Extra tips, substitutions, mistakes to avoid…',
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
    {
      name: 'internalLinks',
      title: 'Related Recipes',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'recipe'}]}],
      description: 'Select other recipes to recommend at the bottom of the page',
    },
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
      description: 'Optional further reading or inspiration links',
    },
  ],
}

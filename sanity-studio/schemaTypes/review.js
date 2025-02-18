import {defineField, defineType} from 'sanity'

export default {
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({
      name: 'recipe',
      title: 'Recipe',
      type: 'reference',
      to: [{type: 'recipe'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'reviewText',
      title: 'Review Text',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'confirmed',
      title: 'Confirmed?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'confirmationCode',
      title: 'Confirmation Code',
      type: 'string',
      hidden: true,
    }),
  ],
}

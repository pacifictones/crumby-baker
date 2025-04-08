export default {
  name: 'step',
  title: 'Step',
  type: 'object',
  fields: [
    {
      name: 'text',
      title: 'Step Text',
      type: 'array',
      of: [{type: 'block'}], // Rich text for each step
    },
    {
      name: 'image',
      title: 'Step Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'A short description for screen readers',
        },
      ],
    },
  ],
}

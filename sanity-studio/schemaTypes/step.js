export default {
  name: 'step',
  title: 'Step',
  type: 'object',
  fields: [
    {
      name: 'text',
      title: 'Text',
      type: 'blockContent',
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
          options: {isHighlighted: true}, // shows in the image “edit” popover
          validation: (Rule) =>
            Rule.custom((val, context) => {
              // Require alt if an image asset is set
              return context.parent?.asset ? (val ? true : 'Please add alt text') : true
            }).max(120),
        },
      ],
    },
  ],
}

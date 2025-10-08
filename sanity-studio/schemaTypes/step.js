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
  preview: {
    select: {
      blocks: 'text', // Portable Text array
      media: 'image', // show the image thumbnail if set
      alt: 'image.alt',
    },
    prepare({blocks, media, alt}) {
      const pt = Array.isArray(blocks) ? blocks : []

      // Extract plain text from Portable Text blocks
      const plain = pt
        .filter((b) => b?._type === 'block')
        .map((b) => (Array.isArray(b.children) ? b.children.map((c) => c.text || '').join('') : ''))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()

      const title = plain ? (plain.length > 90 ? plain.slice(0, 90) + '…' : plain) : '(empty step)'

      const subtitle = media ? (alt ? `🖼 ${alt}` : '🖼 Step image') : undefined

      return {title, subtitle, media}
    },
  },
}

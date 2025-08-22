export default {
  name: 'blockContent',
  title: 'Rich Text',
  type: 'array',
  of: [
    {
      type: 'block',
      marks: {
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {name: 'href', type: 'url', title: 'URL'},
              {name: 'blank', type: 'boolean', title: 'Open in new tab'},
              {name: 'nofollow', type: 'boolean', title: 'No follow'},
            ],
          },
        ],
      },
    },
    {type: 'image', options: {hotspot: true}},
  ],
}

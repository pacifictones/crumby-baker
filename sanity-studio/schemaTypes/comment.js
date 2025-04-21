export default {
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    {name: 'blog', title: 'Blog post', type: 'reference', to: [{type: 'blog'}]},
    {name: 'parent', title: 'Parent comment', type: 'reference', to: [{type: 'comment'}]},
    {name: 'authorName', title: 'Author name', type: 'string'},
    {name: 'email', title: 'Email', type: 'string'},
    {name: 'text', title: 'Comment text', type: 'text'},
    {name: 'confirmed', title: 'Confirmed', type: 'boolean', initialValue: false},
    {name: 'confirmationCode', title: 'Confirmation code', type: 'string'},
  ],
}

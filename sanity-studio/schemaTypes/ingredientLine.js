export default {
  name: 'ingredientLine',
  title: 'Ingredient Line',
  type: 'object',
  fields: [
    {
      name: 'item',
      title: 'Item',
      type: 'string',
      description: 'The ingredients itself, e.g. Flour',
    },
    {
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
      description: 'Numeric amount (for scaling)',
    },
    {
      name: 'unit',
      title: 'Unit',
      type: 'string',
      description: 'e.g., cups, grams, tablespoons, etc.',
    },

    {
      name: 'notes',
      title: 'Notes',
      type: 'string',
      description: 'Anything like sifted, room temp. etc.',
    },
  ],
}

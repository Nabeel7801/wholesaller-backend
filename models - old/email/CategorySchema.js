const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema({
  name: String,
  pic: String,
  slug: { type: String, index: true },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'Category',
  },
  ancestors: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        index: true,
      },
      name: String,
      slug: String,
      pic: String,
    },
  ],
});

module.exports = mongoose.model('Categories', CategorySchema);

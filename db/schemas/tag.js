// Require Mongoose
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const Tags = new Schema({
  value: { type: String, lowercase: true, required: [true, 'missing tag value'] },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
});

// Export function to create "Tag" model class
module.exports = mongoose.model('Tag', Tags);
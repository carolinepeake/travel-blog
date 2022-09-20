// Require Mongoose
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const Tags = new Schema({
  name: { type: String, lowercase: true, required: true }
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
});

// Export function to create "Tag" model class
module.exports = mongoose.model('Tag', Tags);
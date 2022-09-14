// Require Mongoose
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const Posts = new Schema(
  {
    title: String,
    // tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    // location: {type: mongoose.Schema.Types.ObjectId, ref: 'Location'},
    description: { type: String, maxLength: 500 }
    // photos: [String],
    // author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    // created_at: { type: Date, default: Date.now() }
  },
   // will automatically create and set createdAt and updatedAt timestamps
  { timestamps: true }
);

// Export "Post" model class
const Post = mongoose.model('Post', Posts);
module.exports = Post;

// or

// Export function to create "Post" model class
// module.exports = mongoose.model('Post', Posts);
// Require Mongoose
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const Posts = new Schema(
  {
    title: String,
    description: { type: String, maxLength: [1500, 'description too long'] },
    location: { type: Schema.Types.ObjectId, ref: 'Location' },
    city: { type: String, lowercase: true },
    state: { type: String, lowercase: true },
    country: { type: String, lowercase: true },
    region: { type: String, lowercase: true },
    photos: [String],
    // can be mongoose.Schema or Schema b/c Schema is defined above as mongoose.Schema
    tags: [{ type: String, lowercase: true, trim: true }],
    //tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag', lowercase: true }],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'missing author'] }
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
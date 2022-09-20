// Require Mongoose
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const Users = new Schema(
  {
    name: String,
    email: { type: String, lowercase: true, required: [true, 'missing user email'] },
    password: { type: String, required: [true, 'missing user password'] },
    terms: Boolean,
    city: {type: String, unique: false},
    country: {type: String, unique: false},
    image: {type: String, default: null},
    bucketList: [{ type: Schema.Types.ObjectId, ref: 'Post', default: null }]
  },
  // will automatically create and set createdAt and updatedAt timestamps
  { timestamps: true }
);

// Export function to create "User" model class
module.exports = mongoose.model('User', Users);
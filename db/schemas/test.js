// Require Mongoose
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const Tests = new Schema({
  testTitle: String,
  testDescription: String
  // test_created_at: { type: Date, default: Date.now() }
});

// Export function to create "Test" model class
module.exports = mongoose.model('Test', Tests);
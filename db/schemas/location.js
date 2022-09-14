// Require Mongoose
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const Locations = new Schema({
  city: {type: 'string', unique: false},
  state: {type: 'string', unique: false, default: null},
  country:{type: 'string', unique: false},
  region: {type: 'string', unique: false},
});

// Export function to create "Location" model class
module.exports = mongoose.model('Location', Locations);
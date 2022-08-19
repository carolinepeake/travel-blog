const mongoose = require("mongoose");
const db = require('./../server/db.js');


new User({name: 'Eric', city: 'San Francisco', country: 'usa', image: '', bucketList: []}).save()

// module.exports.models = {
//   saveUser: function(entry) {
//     return new User(entry).save();
//   },

//   savePost: function(entry) {
//     return new Post(entry).save()
//   },

//   saveTag: function(entry) {
//     return new Tag(entry).save()
//   }

//   saveLocation: function(entry) {
//     return new Location(entry).save()
//   }

// };




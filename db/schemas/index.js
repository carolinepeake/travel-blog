const mongoose = require('mongoose');
//const db = require('./../server/db'); // this might be unnecessary

module.exports.Test = require('./test');
module.exports.Post = require('./post');
module.exports.Location = require('./location');
module.exports.Tag = require('./tag');
module.exports.User = require('./user');


// new User({name: 'Eric', city: 'San Francisco', country: 'usa', image: '', bucketList: []}).save()

// module.exports.models = {
//   saveUser: function(entry) {
//     return new User(entry).save();
//   },

//  module.exports.saveTest = function(entry) {
//     return new db.Test(entry).save()
//   };

//   saveTag: function(entry) {
//     return new Tag(entry).save()
//   }

//   saveLocation: function(entry) {
//     return new Location(entry).save()
//   }

//   getTags:

// };




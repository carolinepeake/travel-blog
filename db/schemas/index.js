const mongoose = require('mongoose');
const db = require('../connection');

module.exports.Post = require('./post');
module.exports.Location = require('./location');
module.exports.Tag = require('./tag');
module.exports.User = require('./user');

// think I'd want to move this to directly under db

// might be like

// export function to create each class directly from its schema file

//const db = require('../connection');
// const Post = require('./post');
//const Location = require('./location');
//...

// module.exports = {
//   Post: db.Post,
//   Location: db.Location,
// }

// but I'm not sure








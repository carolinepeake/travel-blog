const mongoose = require('mongoose');
const db = require('../connection');

module.exports.Post = require('./post');
module.exports.Location = require('./location');
module.exports.Tag = require('./tag');
module.exports.User = require('./user');

// think I'd want to move this to directly under db





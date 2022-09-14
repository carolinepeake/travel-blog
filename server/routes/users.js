// posts.js - Posts route module
const express = require('express');
const users = express.Router();
const { getUsers, postUser} = require('.././controllers').UsersController;

// const express = require("express");
// const router = express.Router();

// Home page route
users.get('/', getUsers);

users.post('/', postUser);

// About page route
// PostsRouter.get("/about", function (req, res) {
//   res.send("About this wiki");
// });

//PostsRouter.get('/posts', controllers.getPosts);

module.exports = users;
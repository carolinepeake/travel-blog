// posts.js - Posts route module
const express = require('express');
const users = express.Router();
const { getUsers, handleUserSignup, handleUserLogin } = require('.././controllers').UsersController;


users.get('/', getUsers);

// signup route
users.post('/signup', handleUserSignup);

//login route
users.post('/login', handleUserLogin);



// About page route
// PostsRouter.get("/about", function (req, res) {
//   res.send("About this wiki");
// });

//PostsRouter.get('/posts', controllers.getPosts);

module.exports = users;
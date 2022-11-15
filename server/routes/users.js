// posts.js - Posts route module
const express = require('express');
const users = express.Router();
const { getUsers, handleUserSignup, handleUserLogin, handleLikePost, handleUnlikePost, handleGetBucketList, handleEditAvatar } = require('.././controllers').UsersController;


users.get('/', getUsers);

// signup route
users.post('/signup', handleUserSignup);

// login route
  // should this be get?  no, b/c posting password?
users.post('/login', handleUserLogin);

users.get('/:userId', handleGetBucketList);

users.put('/:userId/like/:postId', handleLikePost);

users.put('/:userId/unlike/:postId', handleUnlikePost);

users.put('/:userId/avatar', handleEditAvatar);


// About page route
// PostsRouter.get("/about", function (req, res) {
//   res.send("About this wiki");
// });

//PostsRouter.get('/posts', controllers.getPosts);

module.exports = users;
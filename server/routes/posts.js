// posts.js - Posts route module
const express = require('express');
const posts = express.Router();
const { getPosts, postPost, deletePost, uploadImage, getFilteredPosts,
getPostsFilteredByAuthor } = require('.././controllers').PostsController;

// const express = require("express");
// const router = express.Router();

// Home page route
posts.get('/', getPosts);

posts.get('/filter/:route/:filterTerm', getFilteredPosts);

posts.get('/user/:userID', getPostsFilteredByAuthor);

posts.post('/', postPost);

posts.delete('/:postId', deletePost);


posts.post('/cloudinary/upload', uploadImage);

// About page route
// PostsRouter.get("/about", function (req, res) {
//   res.send("About this wiki");
// });

//PostsRouter.get('/posts', controllers.getPosts);

module.exports = posts;
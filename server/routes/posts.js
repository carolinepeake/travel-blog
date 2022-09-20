// posts.js - Posts route module
const express = require('express');
const posts = express.Router();
const { getPosts, postPost, getTags, uploadImage } = require('.././controllers').PostsController;

// const express = require("express");
// const router = express.Router();

// Home page route
posts.get('/', getPosts);

posts.post('/', postPost);

posts.get('/getTags', getTags);

posts.post('/cloudinary/upload', uploadImage);

// About page route
// PostsRouter.get("/about", function (req, res) {
//   res.send("About this wiki");
// });

//PostsRouter.get('/posts', controllers.getPosts);

module.exports = posts;
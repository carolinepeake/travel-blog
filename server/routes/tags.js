// posts.js - Posts route module
const express = require('express');
const tags = express.Router();
const { getTags, postTag } = require('.././controllers').TagsController;

// const express = require("express");
// const router = express.Router();

// Home page route
tags.get('/', getTags);

tags.post('/', postTag);

// About page route
// PostsRouter.get("/about", function (req, res) {
//   res.send("About this wiki");
// });

//PostsRouter.get('/posts', controllers.getPosts);

module.exports = tags;
// posts.js - Posts route module
const express = require('express');
const tests = express.Router();
const { postTest, getAuthors } = require('.././controllers').TestsController;

// const express = require("express");
// const router = express.Router();

// Home page route
//tests.get('/', getTests);

tests.post('/', postTest);

tests.get('/authors', getAuthors);

// About page route
// PostsRouter.get("/about", function (req, res) {
//   res.send("About this wiki");
// });

//PostsRouter.get('/posts', controllers.getPosts);

module.exports = tests;
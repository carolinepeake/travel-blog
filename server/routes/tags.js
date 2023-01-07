const express = require('express');
const { getTags, postTag, postTags } = require('.././controllers').TagsController;

// could maybe instantiate the different routers in index.js and then require each router to its own routes file or require each file's routes to index.js
const tagsRouter = express.Router();

tagsRouter.get('/', getTags);

tagsRouter.post('/', postTag);

tagsRouter.post('/addTags', postTags);

module.exports = tagsRouter;
// const express = require('express');
// const router = express.Router();
// const { LocationsController, PostsController, TagsController, TestsController, UsersController } = require('./controllers');

exports.posts = require('./posts');
exports.locations = require('./locations');
exports.tests = require('./tests');
exports.users = require('./users');
exports.tags = require('./tags');
// …
//app.use('/posts', router.posts);

// rename controllers directory to services? and put all controllers in separate folder or in database/index.js?
// and make services the queries/transactions?
  //router.use('/users', handleUsersEndpoint); ?
  // see https://docs.nestjs.com/providers

// router.get('/users', controllers.getUser);

// router.get('/tags', controllers.getTags);

// router.get('/regions', controllers.getRegions);

// router.all('/posts', PostsController);


// router.get('/posts', controllers.getPosts);


// router.post('/users', controllers.postUser);

// router.post('/tests', controllers.postTest);

// router.get('/tests', controllers.getTests);

//module.exports = router;
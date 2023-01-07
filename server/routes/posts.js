// posts.js - Posts route module
const express = require('express');
const postsRouter = express.Router();
const { getPosts, postPost, deletePost, uploadImage } = require('.././controllers').PostsController;

// Home page route
postsRouter.get('/', getPosts);

postsRouter.post('/', postPost);

postsRouter.delete('/:postId', deletePost);


postsRouter.post('/cloudinary/upload', uploadImage);

// About page route
// PostsRouter.get("/about", function (req, res) {
//   res.send("About this wiki");
// });

//PostsRouter.get('/posts', controllers.getPosts);

module.exports = postsRouter;
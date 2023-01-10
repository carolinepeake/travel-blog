const express = require('express');

const { getUsers, handleUserSignup, handleUserLogin, handleLikePost, handleUnlikePost, handleGetBucketList, handleEditAvatar } = require('.././controllers').UsersController;

const usersRouter = express.Router();

usersRouter.get('/', getUsers);

// signup route
usersRouter.post('/signup', handleUserSignup);

// login route
  // should this be get?  no, b/c posting password?
usersRouter.post('/login', handleUserLogin);

usersRouter.get('/:userId', handleGetUser);

usersRouter.put('/:userId/like/:postId', handleLikePost);

usersRouter.put('/:userId/unlike/:postId', handleUnlikePost);

usersRouter.put('/:userId/avatar', handleEditAvatar);

module.exports = usersRouter;
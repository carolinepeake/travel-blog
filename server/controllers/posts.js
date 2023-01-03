const mongoose = require('mongoose');
const db = require('../../db/connection.js');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const Post = require('../../db/schemas').Post;
const User = require('../../db/schemas').User;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports.controllers= {

  postPost: function(req, res) {
    var entry = req.body;
    console.log('request body from postPost in controllers: ', req.body);
    // might want to use .create() instead - automatically instantiates new instance (make sure returns saved doc)
    new Post(entry).save()
    .then((savedPost) => {
      console.log('success saving post: ', savedPost);
      res.status(201).send(savedPost);
    })
    .catch((err) => {
      console.log('error saving post: ', err);
      res.status(401).json({ error: 'error saving post' });
    })
  },

  getPosts: function(req, res) {
    console.log('request params from getPosts', req.params);
    Post.find(req.params)
    .populate('location')
    .populate('author')
    .exec()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log('error in controller getPosts: ', err);
      res.status(400).json({ error: "error retrieving posts" });
    })
  },

  getFilteredPosts: function(req, res) {
    console.log('request params from getFilteredPosts', req.params);
    let filterKey = req.params.route.toLowerCase();
    let filterValue = req.params.filterTerm.toLowerCase();
    Post.find({ [filterKey] : filterValue })
    .populate('location')
    .populate('author')
    .exec()
    .then((result) => {
      console.log('query response from getFilteredPosts: ', result);
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log('error in controller getPosts: ', err);
      res.status(400).json({ error: "error retrieving posts" });
    })
  },

  getPostsFilteredByAuthor: function(req, res) {
    Post.find({author: req.params.userID})
      .populate('location')
      .populate('author')
      .exec()
      .then((posts) => {
        res.status(200).send(posts);
      })
      .catch((err) => {
        console.log('error in controller getPostsFilteredByAuthor: ', err);
        res.status(400).json({ error: "error retrieving user" });
      })
  },

  deletePost: function(req, res) {
    console.log('request params from deletePost controller: ', req.params);
    const postID = req.params.postId;
    console.log('postID from deletePost controller: ', postID);
    Post.deleteOne({ _id: postID })
    .then((result) => {
      // status code 204 if send no result data back
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log('error deleting post : ', err);
      res.status(404).json({ error: "error deleting post" });
    })
  },

  uploadImage: async (req, res) => {
    try {
      const file = req.body.image;
      const uploadedResponse = await cloudinary.uploader.upload(file, {
        upload_preset: 'travel_blog',
      });
      console.log('successfully uploaded image to cloudinary: ', uploadedResponse);
      res.status(201).send(uploadedResponse);
    } catch (err) {
      console.log('error uplodaing image to cloudinary: ', err);
      res.status(401).json({error : "error uplodaing image to cloudinary "});
    }
  }

    // return models.saveTest(entry)
    // // return Promise.all([savePost(entry), saveRegion(entry.region), saveTag(entry.tag)])
    // .then((result) => {
    //   console.log('success saving test');
    //   res.status(201).send(result);
    // })
    // .catch((err) => {
    //   console.log('error saving test', err);
    //   res.status(401).send('error');
    // })
};








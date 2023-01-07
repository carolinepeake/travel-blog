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
    Post.find(req.query)
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

  deletePost: function(req, res) {
    const postID = req.params.postId;
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
};








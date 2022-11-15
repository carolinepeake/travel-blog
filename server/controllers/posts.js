const mongoose = require('mongoose');
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
      res.status(401).send('error');
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
      res.status(400);
    })
  },

  getFilteredPosts: function(req, res) {
    console.log('request params from getFilteredPosts', req.params);
    let filterKey = req.params.route;
    let filterValue = req.params.filterTerm;
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
      res.status(400);
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
        res.status(400);
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
      res.status(404);
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
    }
  },


  postTest: function(req, res) {
    var entry = req.body;
    console.log('request body from postPost in controllers: ', req.body);

    new Test(entry).save()
    .then((result) => {
      console.log('success saving test');
      res.status(201).send(result.data);
    })
    .catch((err) => {
      console.log('error saving test', err);
      res.status(401).send('error');
    })

  // const newAttendee = new Attendee({
  //   firstName: req.body.firstname,
  //   lastName: req.body.lastName,
  //   email: req.body.email,
  //   shirt: req.body.shirt,
  //   skillLevel: req.body.skillLevel
  // })
  // newAttendee.save()
  // .then((addedAttendee) => {
  //   console.log('success saving newAttendee', addedAttendee);
  //   res.status(201)
  // })
  // .catch((err) => {
  //   console.log('error adding newAttendee', err);
  //   res.status(401)
  // })

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
  }
};








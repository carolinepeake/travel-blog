const mongoose = require('mongoose');
const db = require('../../db/connection.js');
const Tag = require('../../db/schemas').Tag;
const Post = require('../../db/schemas').Post;

module.exports.controllers = {

  getTags: function(req, res) {
    console.log('getting tags in tags controller');
    Post.distinct( "tags" )
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log('error in controller getPosts: ', err);
      res.status(400);
    })
  },

  postTags: function(req, res) {
    var tags = req.body.tags;
    console.log('request body from postTags in controllers: ', req.body.tags);
    Promise.all( tags.forEach((tag) => {
      return new Tag({tag}).save()
    }))
    .then((savedTags) => {
      console.log('success saving tags: ', savedTags);
      res.status(201).send(savedTags);
    })
    .catch((err) => {
      console.log('error saving tags', err);
      res.status(401).send('error saving tags');
    })
  },

  postTag: function(req, res) {
    var entry = req.body;
    console.log(req.body.json);
    new Tag(entry).save()
    .then((result) => {
      res.status(201).send(result.data);
    })
    .catch((err) => {
      console.log('error in controller handlingAddTag : ', err);
      res.status(401).send('error');
    })
  },

};
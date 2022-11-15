const mongoose = require('mongoose');
const db = require('../../db/connection'); // this is unnecessary
const Test = require('../../db/schemas').Test;
const Post = require('../../db/schemas').Post;

module.exports.controllers = {

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
  },

  getAuthors: function(req, res) {
    Post.find()
    .populate('author')
    .select('author')
    .exec()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log('error in controller getPosts: ', err);
      res.status(400);
    })
  },


};
const mongoose = require('mongoose'); // do I need this?
//const db = require('../server/db'); // this might be unnecessary
const User = require('../../db/schemas').User;

module.exports.controllers = {

  postUser: function(req, res) {
    var entry = req.body;
    console.log('request body from postUser in controllers: ', req.body);
    new User(entry).save()
    .then((savedUser) => {
      console.log('success saving user: ', savedUser);
      res.status(201).send(savedUser);
    })
    .catch((err) => {
      console.log('error saving user: ', err);
      res.status(401).send('error');
    })
  },

  postTest: function(req, res) {
    var entry = req.body;
    console.log('request body from postPost in controllers: ', req.body);
  //   if (err) {
  //     res.status(401).send('error');
  //   } else {
  //     res.status(201).send('success');
  //   }
  // }

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
  },

  getUsers: function(req, res) {
    User.find()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log('error in controller getUsers: ', err);
      res.status(400);
    })
  },

  getTests: function(req, res) {
    Test.find()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log('error in controller getPosts: ', err);
      res.status(400);
    })
  }

// const getUser = function(req, res) {
//   console.log('request from getPosts controller: ', req);
//   return getPosts()
//   .then((result) => {
//     res.status(201).send(result);
//   })
//   .catch((err) => {
//     console.log('error in controller getPosts: ', err);
//     res.status(401);
//   })
// };
};
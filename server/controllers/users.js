const mongoose = require('mongoose'); // do I need this?
const db = require('../../db/connection'); // this might be unnecessary
const bcrypt = require("bcrypt");
const User = require('../../db/schemas').User;

module.exports.controllers = {

  handleUserSignup: async (req, res) => {
    const body = req.body;
    console.log('request body from handleUserSignup in controllers: ', req.body);

    // if (!(body.email && body.password)) {
    //   return res.status(400).send({ error: "Data not formatted properly" });
    // };
    // can add try/catch blocks
    const user = new User(body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    // can refactor to use await - maybe not w/ mongoose?
    user.save()
    .then((doc) => {
      console.log('success creating user: ', doc);
      res.status(201).send(doc);
    })
    .catch((err) => {
      console.log('error saving user: ', err);
      res.status(401).send('error creating user');
    })
  },

  handleUserLogin: async (req, res) => {
    const body = req.body;
    console.log('request body from handleUserLogin in controllers: ', req.body);
    // add try/catch block
    const user = await User.findOne({ email: body.email });
    if (user) {
      // check user password with hashed password stored in the database
      const validPassword = await bcrypt.compare(body.password, user.password);
      if (validPassword) {
        // res.status(200).json({ message: "Valid password" }).send(user);
        res.status(200).send(user);
      } else {
        res.status(400).json({ error: "Invalid Password" });
      }
    } else {
      res.status(401).json({ error: "User does not exist" });
    }
  },

  handleLikePost: async (req, res) => {
    console.log('handling like post');
    try {
      const userId = req.params.userId;
      const postId = req.params.postId;
      console.log('request user parameter from handleLikePost controller: ', userId);
      console.log('request post parameter from handleLikePost controller: ', postId);
      // const updatedUser = await User.findByIdAndUpdate(user, { $push: { bucketList: post }}, { returnDocument='after', timestamps=false, });
      // const updatedUser = await User.updateOne({ _id: user, { $push: {bucketList: post} }, { returnDocument: 'after', timestamps: false, new: true });
      const updatedUser = await User.findByIdAndUpdate(userId, { $push: { bucketList: postId }});
      console.log('updatedUser', updatedUser);
      res.status(200).send(updatedUser);
    } catch (err) {
      console.log('error updating user: ', err);
      res.status(404).json({ error: "unable to update user" });
    }
  },

  handleUnlikePost: async (req, res) => {
    console.log('handling unlike post');
    try {
      const userId = req.params.userId;
      const postId = req.params.postId;
      console.log('request user parameter from handleLikePost controller: ', userId);
      console.log('request post parameter from handleLikePost controller: ', postId);
      // might be $pullAll
      // const updatedUser = await User.findByIdAndUpdate(user, { $pull: { bucketList: post } }, { returnDocument='after', timestamps=false, new=true });
      const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { bucketList: postId }});
      console.log('updatedUser', updatedUser);
      // status code 204 if send no result data back
      res.status(200).send(updatedUser);
    } catch (err) {
      console.log('error updating user: ', err);
      res.status(404).json({ error: "unable to update user" });
    }
  },




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
  },

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
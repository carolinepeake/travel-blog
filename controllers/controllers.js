import models from '../models/models.js';

const postUser = function(req, res) {
  var entry = req.body;
  console.log(req.body.json);
  return saveUser(entry)
  .then((result) => {
    res.status(201).send(result);
  })
  .catch((err) => {
    console.log('error in controller handlingAddUser: ', err);
    res.status(401);
  })
};

const postPost = function(req, res) {
  var entry = req.body;
  console.log(req.body);
  return Promise.all([savePost(entry), saveRegion(entry.region), saveTag(entry.tag)])
  .then((result) => {
    res.status(201).send(result);
  })
  .catch((err) => {
    console.log('error in controller handlingAddPost: ', err);
    res.status(401);
  })
};

// const postRegion = function(req, res) {
//   var entry = req.body;
//   console.log(req.body.json);
//   return saveRegion(entry)
//   .then((result) => {
//     res.status(201).send(result);
//   })
//   .catch((err) => {
//     console.log('error in controller handlingAddRegion : ', err);
//     res.status(401);
//   })
// };


// const postTag = function(req, res) {
//   var entry = req.body;
//   console.log(req.body.json);
//   return saveTag(entry)
//   .then((result) => {
//     res.status(201).send(result);
//   })
//   .catch((err) => {
//     console.log('error in controller handlingAddTag : ', err);
//     res.status(401);
//   })
// };

const getPosts = function(req, res) {
  console.log('request from getPosts controller: ', req);
  return getPosts()
  .then((result) => {
    res.status(201).send(result);
  })
  .catch((err) => {
    console.log('error in controller getPosts: ', err);
    res.status(401);
  })
};

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



export default controllers;
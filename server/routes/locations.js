// posts.js - Posts route module
const express = require('express');
const locations = express.Router();
const { getLocations, postLocation, getPlaces } = require('.././controllers').LocationsController;

// const express = require("express");
// const router = express.Router();

//Home page route
locations.get('/', getLocations);

locations.post('/', postLocation);

locations.get('/places/:text/:locality', getPlaces);

// About page route
// PostsRouter.get("/about", function (req, res) {
//   res.send("About this wiki");
// });

//PostsRouter.get('/posts', controllers.getPosts);

module.exports = locations;
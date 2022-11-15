const mongoose = require('mongoose');
const Location = require('../../db/schemas').Location;

module.exports.controllers = {

  postLocation: function(req, res) {
    let entry = req.body;
    console.log('request body from postLocation in controllers: ', req.body);
    new Location(entry).save()
    // should I just be sending back savedLocation.data here?
    .then((savedLocation) => {
      console.log('success saving location: ', savedLocation);
      res.status(201).send(savedLocation);
    })
    .catch((err) => {
      console.log('error saving location: ', err);
      res.status(401).send('error');
    })
  },

  getLocations: function(req, res) {
    Location.find()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log('error getting: ', err);
      res.status(400).send('error gettin locations');
    })
  }

};
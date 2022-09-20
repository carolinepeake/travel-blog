const mongoose = require('mongoose');
//const db = require('../server/db'); // this might be unnecessar
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
  },

  // getRegion: function(req, res) {
  //   // req params or query value will be region name
  //   Location.find()
  //     .where('region').equals(`${}`)
  //  // .sort()  sort alphabetical
  //     .select('country')
  //     .exec()
  //   .then((result) => {
  //     res.status(200).send(result);
  //   })
  //   .catch((err) => {
  //     console.log('error in controller getRegion : ', err);
  //     res.status(400).send(`error getting countried for ${} region`);
  //   })
  // },

  // might want to refactor to use async/await

  // check if 400 the correct error code

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



};
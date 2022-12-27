const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();
const path = require('path');
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

  getPlaces: async (req, res) => {
    const text = req.params.text;
    console.log('text from getPlaces controller: ', text);
    const locality = req.params.locality;
    let placeTypes = '&types=';
    switch (locality) {
      case 'city' :
        placeTypes += 'place,locality,neighborhood';
        break;
      case 'state' :
        placeTypes += 'region,district';
        break;
      case 'country' :
        placeTypes += 'country';
        break
      case 'all' :
        placeTypes = 'country,region,district,place,locality,neighborhood';
        break;
      default:
        placeTypes = '';
        console.log('error parsing locality parameter in getPlaces controller: ', req.params);
    };

    try {
      // will want to use path or params instead of template literals to ensure works in all browsers
      const result = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=${process.env.MAP_API_KEY}&cachebuster=1625641871908&autocomplete=true${placeTypes}`
      );
      // if (!result.OK) throw new Error(result.statusText);
      res.status(200).send(result.data);
    } catch (err) {
      console.log("Unable to retrieve places", err);
      res.status(400);
    }
  },

};
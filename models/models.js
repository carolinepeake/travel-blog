const mongoose = require("mongoose");
const db = require('./../server/db.js');

module.exports.models = {
  saveUser: function(entry) {
    return new Word(entry).save();
  },

  savePost: function(entry) {
    return new Word(entry).save()
  },

  saveTag: function(entry) {
    return new Word(entry).save()
  }

  saveRegion: function(entry) {
    return new Region(entry).save()
  }

};



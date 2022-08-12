const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(`mongodb://localhost:27017/${process.env.DBNAME}`)
  .then(() => console.log('database connected'))

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const { Schema } = mongoose;

const examplePost = {id: 1, title: 'Shark Diving in Jupiter, FL', tags: ['scuba'], region: ['Florida', 'United States', 'North America'], language: ['English'], city: 'Jupiter, FL', country: 'United States', description: 'A sleepy southern coastal town an hour and a half drive north from Miami, Jupiter, Florida is home to some of the best shark diving in the world. Here, experienced divers have a rare opportunity to go deep and get personal with several species of shark including tiger, bull, nurse, reef, and the ellusive hammerhead. Emerald Charters is the better known of two (number per Google) dive companies providing this boutique dive experience.', photos: [], author: {name: 'carolinep', city: 'san francisco', country: 'usa', image: ''}, created_at: 'Aug 2022'};
const Posts = new Schema({
  title: String,
  tags: {
    type: subSchema,
    default: []
  },
  region:{
    type: subSchema,
    default: []
  },
  language: [{type: 'string', unique: false}],
  city: {type: 'string', unique: false},
  county: {type: 'string', unique: false},
  description: String,
  photos: [String],
  user: {
    type: subSchema,
    default: {}
  },
  created_at: { type: Date, default: Date.now() }
});

const Tags = new Schema({
  tag: String,
  posts: [Number]
});

const Users = new Schema({
  name: String,
  city: {type: String, unique: false},
  country: {type: String, unique: false},
  image: String,
  bucketList: [{type: Number, unique: false}],
});

const Regions = new Schema({
  name: {type: String, unique: false},
  type: {type: String, unique: false}
})

const Post = mongoose.model('Post', Posts);
const Users = mongoose.model('User', Users);
const Tag = mongoose.model('Tag', Tags);
const Region = mongoose.model('Region', Region);